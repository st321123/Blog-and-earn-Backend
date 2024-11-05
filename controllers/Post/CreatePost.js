const express = require('express');
const {Post} = require('../../models/post');
const {User} = require('../../models/user');
const { middleware } = require('../../middleware');
const app = express();
const router = express.Router();
app.use(express.json());


router.post('/',middleware, async(req, res) => {

    const userId = req.id;
    const { description, title} = req.body;

    if (!userId || !description || !title) {
        return res.status(400).json({ msg: "Missing author ID or post content" });
    }

    try
    {
        const db = await User.findOne({email: userId});

        if (!db) {
           return  res.status(404).json({msg: "User not found "})
        }

        const dbs = await Post.create({author: db._id, description: description,title:title});
        if(!dbs)
        {
            return res.status(400),json({msg:"failed"});
            
        }
        return res.status(200).json({msg:"Post created successfully"});

    } 
    catch (error) {
       return  res.status(404).json({msg: error})
    }
})

module.exports = router;
