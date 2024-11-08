const express = require("express");
const { Post } = require("../../models/post");
const app = express();
app.use(express.json());

const router = express.Router();


// allPost.js
router.get('/', async (req, res) => {
    const { page = 1, limit = 6 } = req.query;

    try {
        const posts = await Post.find()
            .populate('author', 'userName bio')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .exec();
        
        const totalPosts = await Post.countDocuments(); // Total number of posts

        return res.status(200).json({
            msg: "Success",
            posts: posts,
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit), // Total pages
            currentPage: Number(page),
        });
    } catch (error) {
        // console.error("Error fetching posts:", error);
        res.status(400).json({
            msg: error.message
        });
    }
});

module.exports = router;
