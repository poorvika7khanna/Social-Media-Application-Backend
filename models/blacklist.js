const mongoose = require("mongoose");
const BlacklistSchema = mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("blacklist", BlacklistSchema);