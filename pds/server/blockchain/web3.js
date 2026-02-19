const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const provider = new HDWalletProvider({
  privateKeys: [process.env.PRIVATE_KEY],
  providerOrUrl: process.env.ALCHEMY_URL,
});

const web3 = new Web3(provider);

module.exports = web3;
