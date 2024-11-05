const express = require("express");
const { User } = require("../models/user"); // Import the User model
const router = express.Router();
const { middleware } = require('../middleware');
const { Follow } = require("../models/follow");
const mongoose = require('mongoose'); // Ensure mongoose is imported for session handling

router.post("/:userId/follow", middleware, async (req, res) => {
    const followerId = req.body.followerId; // Assuming userId is set by an authentication middleware
    const followingId = req.params.userId;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check if the follow relationship exists
        const existingFollow = await Follow.findOne({ followerId, followingId }).session(session);
        
        if (existingFollow) {
            // Unfollow: delete the relationship
            await Follow.deleteOne({ followerId, followingId }).session(session);

            // Decrement follower and following counts
            await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } }).session(session);
            await User.findByIdAndUpdate(followingId, { $inc: { followerCount: -1 } }).session(session);

            await session.commitTransaction();
            return res.status(200).json({ message: "Unfollowed successfully" });
        } else {
            // Follow: create the relationship
            const newFollow = new Follow({ followerId, followingId });
            await newFollow.save({ session });

            // Increment follower and following counts
            await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } }).session(session);
            await User.findByIdAndUpdate(followingId, { $inc: { followerCount: 1 } }).session(session);

            await session.commitTransaction();
            return res.status(201).json({ message: "Followed successfully" });
        }
    } catch (error) {
        await session.abortTransaction();
        // console.error("Error following/unfollowing user:", error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        session.endSession();
    }
});

router.get("/:id/followers", middleware, async (req, res) => {
    const id = req.params.id;

    try {
        // Find all followers of the user
        const followers = await Follow.find({ followingId: id })
            .populate('followerId', 'userName') // Populate follower details with only `userName`
            .exec();

        // Find all followings of the user
        const followings = await Follow.find({ followerId: id })
            .populate('followingId', 'userName') // Populate following details with only `userName`
            .exec();

        // Map followers and followings to extract necessary user details
        const followersList = followers.map(follow => follow.followerId);
        const followingsList = followings.map(follow => follow.followingId);

        res.status(200).json({
            followers: followersList,
            followings: followingsList,
            followerCount: followersList.length,
            followingCount: followingsList.length,
        });
    } catch (error) {
        // console.error("Error fetching followers and following:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
