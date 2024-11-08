const express = require("express");
const {Post} = require("../../models/post")
const app = express();
app.use(express.json());
const router = express.Router();
const {middleware} = require('../../middleware');

router.delete("/:postId/delete", middleware, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.id; // Assuming this is the user's ID from middleware

  try {
      // Find the post and populate the author's email
      const post = await Post.findOne({ _id: postId }).populate('author', 'email');

      // Check if the post exists
      if (!post) {
          return res.status(404).json({
              msg: "Post not found"
          });
      }

      // Check if the user requesting deletion is the author of the post
      if (post.author.email !== userId) {
          return res.status(403).json({
              msg: "You do not have authority to delete this post"
          });
      }

      // Delete the post if authorized
      await Post.findByIdAndDelete(postId);

      // Respond with a success message
      return res.status(200).json({
          msg: "Post deleted successfully"
      });
  } catch (error) {
    //   console.error("Error deleting post:", error);
      return res.status(500).json({
          msg: "An error occurred while attempting to delete the post",
          error
      });
  }
});

module.exports = router;


router.get("/:postId",middleware, async (req,res)=>{

  const postId = req.params.postId;
  

  
  try{
  
  const db = await Post.find({_id: postId}).populate('author', 'userName').exec();
 
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
