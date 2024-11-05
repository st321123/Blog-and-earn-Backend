const express = require("express");
const { middleware } = require("../middleware");
const { User } = require("../models/user");
const { Post } = require("../models/post");
const { Follow } = require("../models/follow");
const app = express();

app.use(express.json());
const router = express.Router();
router.get('/',middleware, async (req, res) => {

    const id = req.id;
    
    try {
        const userDetails = await User.findOne({email:id}); // 'name' field from User schema
        
        
        res.status(200).json({
            msg: "Success",
            userDetails
        });

    } catch (error) {
        // console.error(error);
        res.status(400).json({
            msg: error.message
        });
    }
});

router.post('/otherUser',middleware, async (req, res) => {
    
    const id = req.id;
    const userId = req.body.userId;


    
    
    
    
    try {
        const followerId = await  User.findOne({email:id}); 
        const userDetails = await User.findOne({_id:userId}); // 'name' field from User schema
        const existingFollow = await Follow.findOne({ followerId, followingId:userId });

        const postDetails = await Post.find({author:userId});

    

    if(existingFollow)
    {
       return res.status(200).json({
            msg: "Success",
            userDetails,
            postDetails,
            followerId:followerId._id,
            follow:true
        });
    }
    else{
        return res.status(200).json({
            msg: "Success",
            userDetails,
            postDetails,
            followerId:followerId._id,
            follow:false
        });

    }
        
       

    } catch (error) {
        // console.error(error);
        res.status(400).json({
            msg: error.message
        });
    }
});
module.exports = router;
