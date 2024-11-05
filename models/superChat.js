// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    balanceBefore: {
        type: Number,
        required: true
    },
    balanceAfter: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "completed"
    },
    transactionId: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true // Make creation date immutable
    }
}, { timestamps: true });

const Superchat = mongoose.model("Superchat", transactionSchema);
module.exports = { Superchat };
