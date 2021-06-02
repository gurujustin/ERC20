const DappToken = artifacts.require("DappToken");

module.exports = function (deployer) {
  deployer.deploy(DappToken, 100000000);
};
