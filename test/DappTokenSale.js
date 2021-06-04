const DappTokenSale = artifacts.require("DappTokenSale");
const DappToken = artifacts.require("DappToken");

contract('DappTokenSale', function(accounts) {
    var tokenSaleInstance;
    var tokenInstance;
    var tokenPrice = 1000000000000000;
    var buyer = accounts[1];
    var admin = accounts[0];
    var numberOfTokens;
    var tokensAvailable = 750000;

    it('initializes the contracts with the correct values', function() {
        return DappTokenSale.deployed().then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'has contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'has contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price) {
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    });

    it('facillitates token buying', function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return DappTokenSale.deployed();
        }).then(function(instance) {
            tokenSaleInstance = instance;
            tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
        }).then(function(receipt){
            numberOfTokens = 10;
            var value = numberOfTokens * tokenPrice;
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: value})
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be the sell event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
            return tokenSaleInstance.tokenSold();
        }).then(function(amount) {
            assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 1 });
        }).then(assert.fail).catch(function(err) {
            assert(err.message.indexOf('revert') >= 0, 'err.message must contain revert');
            return tokenSaleInstance.buyTokens(800000, {from: buyer, value: numberOfTokens * tokenPrice });
        }).then(assert.fail).catch(function(err) {
            assert(err.message.indexOf('revert') >= 0, 'balace should be bigger than balance');
        });
    })
});