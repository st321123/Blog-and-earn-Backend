const express = require('express');
const { Like } = require('../../models/like');
const { Post } = require('../../models/post'); 
const { User } = require('../../models/user'); 
const mongoose = require('mongoose'); // Required for session handling
const router = express.Router();
const { middleware } = require('../../middleware');

// Combined like/unlike route
router.use(express.json());

router.post('/:postId/likes', middleware, async (req, res) => {
    const id = req.id; // Expecting userId in the request body
    const postId = req.params.postId; // Extract postId from the URL parameters

    // Start a session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Get the user's ID
        const existingUser = await User.findOne({ email: id }).session(session);
        const userId = existingUser._id;

        // Check if the user has already liked the post
        const existingLike = await Like.findOne({ postId, userId }).session(session);
        
        let likeCountChange;

        if (existingLike) {
            // Unlike the post: remove the like and decrease the like count
            await Like.findOneAndDelete({ postId, userId }).session(session);

            const post = await Post.findOne({ _id: postId }).session(session);
            likeCountChange = post.likeCount > 0 ? -1 : 0;
        } else {
            // Like the post: add a new like and increase the like count
            const like = new Like({ postId, userId });
            await like.save({ session });
            likeCountChange = 1;
        }

        // Update the like count in the Post model
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { likeCount: likeCountChange } },
            { new: true, session }
        );

        // Commit the transaction
        await session.commitTransaction();

        // Send back the updated like count
        return res.status(200).json({ msg: existingLike ? 'Post unliked' : 'Post liked', likeCount: post.likeCount });
    } catch (error) {
        await session.abortTransaction();
        // console.error("Error toggling like:", error);
        res.status(500).json({ msg: "Server error" });
    } finally {
        session.endSession();
    }
});

router.get('/:postId/likes', middleware, async (req, res) => {
    const postId = req.params.postId;
    const id = req.id;
  

    try {
        // Find all likes for the specified post
        const likes = await Like.find({ postId }).populate('userId', 'userName'); // Populate the userId field
        const existingUser = await User.findOne({ email: id });
        const userId = existingUser._id;
    
         // Check if the user has already liked the post
        const existingLike = await Like.findOne({ postId, userId });
        // Extract user IDs
        const userIds = likes.map(like => like.userId);
        
        
        return res.status(200).json({
            msg: "This works",
            likes: userIds,
            alreadyExist:existingLike
        });
    } catch (error) {
        // console.error("Error fetching likes:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});

module.exports = router;
