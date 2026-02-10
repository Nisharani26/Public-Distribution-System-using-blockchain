// backend/watchers/shopTransaction.watch.js
const ShopTransaction = require("../models/shopTransaction");
const hashData = require("../utils/hash");
const contract = require("../blockchain/contract");
const web3 = require("../blockchain/web3");

ShopTransaction.watch().on("change", async (change) => {
  if (change.operationType === "update") {
    const updated = await ShopTransaction.findById(
      change.documentKey._id
    );

    const hash = hashData(updated);
    const accounts = await web3.eth.getAccounts();

    await contract.methods
      .addTransaction("SHOP-UPDATE", updated._id.toString(), hash)
      .send({ from: accounts[0], gas: 300000 });

    console.log("Blockchain updated for SHOP transaction");
  }
});
