const mongoose = require("mongoose");

const AuthoritySchema = new mongoose.Schema({
    authorityId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Authority", AuthoritySchema);
