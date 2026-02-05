const web3 = require("./web3");
const contractJSON = require("../../blockchain/build/contracts/PDSLedger.json");

const networkId = "5777"; // Ganache
const contractAddress = contractJSON.networks[networkId].address;

const contract = new web3.eth.Contract(
  contractJSON.abi,
  contractAddress
);

module.exports = contract;
