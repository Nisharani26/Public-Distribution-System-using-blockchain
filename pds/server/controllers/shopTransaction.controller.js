const ShopTransaction = require("../models/shopTransaction");
const contract = require("../blockchain/contract");
const web3 = require("../blockchain/web3");
const hashData = require("../utils/hash");

exports.createShopTransaction = async (req, res) => {
  try {
    // 1. MongoDB me save
    const tx = await ShopTransaction.create(req.body);

    // 2. Hash generate
    const hash = hashData(tx);

    // 3. Blockchain me push
    const accounts = await web3.eth.getAccounts();

    await contract.methods
      .addTransaction("SHOP", tx._id.toString(), hash)
      .send({
        from: accounts[0],
        gas: 300000,
      });

    res.status(201).json({
      message: "Shop transaction stored & block created",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Blockchain error" });
  }
};
