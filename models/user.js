const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default: '' 
    },
    coins: { // New field for coins
        type: Number,
        default: 1000 // Initial amount assigned to each user
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    followerCount: {
        type: Number,
        default: 0 // Default follower count
    },
    followingCount: {
        type: Number,
        default: 0 // Default following count
    }
});

const User = mongoose.model("User", userSchema);
module.exports = {User};