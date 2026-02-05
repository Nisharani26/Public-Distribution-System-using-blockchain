const UserTransaction = require("../models/UserTransaction");
const hashData = require("../utils/hash");
const contract = require("../blockchain/contract");
const web3 = require("../blockchain/web3");

UserTransaction.watch().on("change", async (change) => {
  if (change.operationType === "update") {
    const updated = await UserTransaction.findById(
      change.documentKey._id
    );

    const hash = hashData(updated);
    const accounts = await web3.eth.getAccounts();

    await contract.methods
      .addTransaction("USER-UPDATE", updated._id.toString(), hash)
      .send({ from: accounts[0], gas: 300000 });

    console.log("Blockchain updated for MongoDB change");
  }
});
