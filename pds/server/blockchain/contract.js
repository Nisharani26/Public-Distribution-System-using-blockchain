const web3 = require("./web3");
const contractJSON = require("../../blockchain/build/contracts/PDSLedger.json");

// Network ID (Ganache)
const networkId = Object.keys(contractJSON.networks)[0]; 
// dynamically pick first network key, usually "5777"

// Fetch address dynamically
const contractAddress = contractJSON.networks[networkId].address;

// Create contract instance
const contract = new web3.eth.Contract(contractJSON.abi, contractAddress);

module.exports = contract;
