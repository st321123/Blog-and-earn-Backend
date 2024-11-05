const express = require('express');
const { Comment } = require('../../models/comment');
const { Post } = require('../../models/post'); // Import Post to verify post existence
const router = express.Router();
const {middleware} = require("../../middleware");
const { User } = require('../../models/user');

// Route to get comments for a specific post
router.get('/:postId/comments', middleware, async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ postId }).populate('userId', 'userName').exec();
       
        
        res.status(200).json({ comments });
    } catch (error) {
        // console.error("Error fetching comments:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

// Route to add a new comment
router.post('/:postId/comments',middleware, async (req, res) => {
    const { postId } = req.params;
    const id = req.id;
    const user = await User.findOne({email:id});
    const userId = user._id;
   
    

    const { content } = req.body; // Expecting userId and content in the request body
    
    try {
        // Check if the post exists
        const postExists = await Post.findById(postId);
        if (!postExists) {
            return res.status(404).json({ msg: "Post not found" });
        }

        const comment = new Comment({ postId, userId, content });
        await comment.save();
        
        res.status(201).json({ comment });
    } catch (error) {
        // console.error("Error adding comment:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

// Route to delete a comment
router.delete('/:postId/comments/:commentId', middleware, async (req, res) => {
    const { postId, commentId } = req.params;
    const userEmail = req.id; // Email from middleware

    try {
        // Fetch the post to verify if the user is the post author
        const post = await Post.findById(postId).populate('author');
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        // Fetch the comment to verify if the user is the comment author
        const comment = await Comment.findById(commentId).populate('userId');
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        // Check if the user is either the post author or the comment author
        if (post.author.email !== userEmail && comment.userId.email !== userEmail) {
            return res.status(403).json({ msg: "Unauthorized action" });
        }

        // Delete the comment if authorization is successful
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ msg: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
module.exports = router;
