var DappToken = artifacts.require("DappToken");

contract('DappToken', function(accounts) {
    it('initializes the contract with the correct values', function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name) {
            assert.equal(name, 'DApp Token', 'sets name to Dapp Token')
            return tokenInstance.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, 'DAPP', 'has the correct symbol');
            return tokenInstance.standard();
        }).then(function(standard) {
            assert.equal(standard, 'DApp Token v1.0', 'has the correct standard');
        });
    });
    it('allocates the total supply upon deployment', function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1000000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), 1000000, 'it sets balanceof to 1000000');
        });
    });

    it('transfer token ownership', function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 999999999999999);
        }).then(assert.fail).catch(function(err) {
            assert(err.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
        }).then(function(success) {
            assert.equal(success, true, 'it return true');
            return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
        }).then(function(receipt) {
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens transfered from');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
        })
    });

    it('approves tokens for delegated transfer', function(){
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100, {from: accounts[0] });
        }).then(function(success) {
            assert.equal(success, true, 'it returns true');
            return tokenInstance.approve(accounts[1], 100);
        }).then(function(receipt) {
            assert.equal(receipt.logs[0].event, "Approval", 'event is Approval');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 100, 'store the allowance for delegated transfer');
        })
    });

    it('handles delegated token transfers', function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            fromAccount  = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            //  transfer some tokens to fromAccount
            return tokenInstance.transfer(fromAccount, 100, {from: accounts[0] });
        }).then(function(receipt){
            //  Approce spedingAccount to spend 10 tokens from fromAccount
            return tokenInstance.approve(spendingAccount, 10, {from: fromAccount });
        }).then(function(receipt) {
            //  Try transferring something larger than the sender's balance
            return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount });
        }).then(assert.fail).catch(function(err) {
            assert(err.message.indexOf('revert') >= 0, 'err message must contain revert');
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount });
        }).then(assert.fail).catch(function(err) {
            assert(err.message.indexOf('revert' >= 0, 'cant transfer'));
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount });
        }).then(function(success) {
            assert.equal(success, true);
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount });
        }).then(function(receipt) {
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 90, 'deducts the amount from the spending account');
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 10, 'adds the account from the receiving account');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
        });
    });
})