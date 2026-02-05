const PDSLedger = artifacts.require("PDSLedger");

module.exports = function (deployer) {
  deployer.deploy(PDSLedger);
};
