require("dotenv").config();

const web3 = require("./web3");

const contractJSON = require("../../blockchain/build/contracts/PDSLedger.json");

const contract = new web3.eth.Contract(
  contractJSON.abi,
  process.env.CONTRACT_ADDRESS
);

module.exports = contract;
