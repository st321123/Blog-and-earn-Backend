const express = require("express");
const {Post} = require("../../models/post")
const {middleware} = require('../../middleware');
const { User } = require("../../models/user");


const app = express();
app.use(express.json());
const router = express.Router();

router.get("/",middleware, async (req,res)=>{
    
    const id = req.id;
    // console.log("This is post of user ",id);

    try{
    const userDetails =await User.findOne({email:id});
    // console.log("this is user ",userDetails.userName);
    const userName = userDetails;
   
    
    
    const db = await Post.find({author:userDetails._id});
    


   
    
  
    
    if(!db.length)
    {
       return res.status(200).json({
        userDetails,
        db,
        msg:"No posts "
        })
    }
 
    return  res.status(200).json({
    db,
    userDetails,
    msg:"Success"
    })
  }
  catch(er)
  {
    res.status(404).json({
        msg:"Internal server error",
        userName
    })
  }
})

module.exports = router;