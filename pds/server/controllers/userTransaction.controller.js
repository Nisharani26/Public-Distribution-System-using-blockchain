const UserTransaction = require("../models/UserTransaction");
const contract = require("../blockchain/contract");
const web3 = require("../blockchain/web3");
const hashData = require("../utils/hash");

exports.createUserTransaction = async (req, res) => {
  try {
    // 1. MongoDB me save
    const tx = await UserTransaction.create(req.body);

    // 2. Hash generate
    const hash = hashData(tx);

    // 3. Blockchain me push
    const accounts = await web3.eth.getAccounts();

    await contract.methods
      .addTransaction("USER", tx._id.toString(), hash)
      .send({
        from: accounts[0],
        gas: 300000,
      });

    res.status(201).json({
      message: "User transaction stored & block created",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Blockchain error" });
  }
};
