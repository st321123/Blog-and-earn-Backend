const express = require("express");
const {Post} = require("../../models/post")
const app = express();
app.use(express.json());
const router = express.Router();
const {middleware} = require('../../middleware');

router.get("/:postId",middleware, async (req,res)=>{

    const postId = req.params.postId;
    

    
    try{
    
    const db = await Post.find({_id: postId}).populate('author', 'author').exec();
   
    if(!db.length)
    {
       return  res.status(400).json({
            msg:"No posts "
        })
    }
 
    return res.status(200).json({
        db,msg:"Success"
    })
  }catch(er)
  {
    res.status(404).json({
        er
    })
  }
})

module.exports = router;
