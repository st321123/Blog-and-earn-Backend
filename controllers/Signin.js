const express = require("express");
const app = express();
const router = express.Router();
const zod = require('zod');
const { User } = require("../models/user");
app.use(express.json());
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtPass = process.env.JWT_SECRET;
const signinSchema = zod.object({
    email:zod.string().email(),
    password:zod.string().min(8)
})
router.post("/",async (req,res)=>{
    const {email, password} = req.body;
    const response = signinSchema.safeParse({email:email, password:password});
    // console.log(response);
    
    if(!response.success)
    {
    return  res.status(400).json({ msg:"False"});  
    }
   
    try{
    
        const db = await User.findOne({email});
        // console.log("Thi is db ",db);
        
        if(!db)
        {
            return res.status(401).json({ msg:"email not found"  })
        }

        if(db.password != password)
        {
            // console.log("Invalid pass");
            
            return res.status(400).json({ msg:"Invalid password"  })
        }

        const token = jwt.sign(email,jwtPass);


        
        res.status(200).json({_id: db._id,user:db.author,msg:"Success", token }) 

        }
    
    catch(error)
    {
        return res.status(400).json({
            msg:error
        })
    }
    
})


module.exports = router;