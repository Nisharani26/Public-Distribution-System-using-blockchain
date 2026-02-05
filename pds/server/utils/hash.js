const crypto = require("crypto");

module.exports = function hashData(data) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
};
