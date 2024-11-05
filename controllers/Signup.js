const express = require("express");
const app = express();
const zod = require("zod");
const router = express.Router();
const {User} = require('../models/user');
app.use(express.json());
const jwt = require('jsonwebtoken');
require("dotenv").config();
const jwtPass = process.env.JWT_SECRET

const userSchema = zod.object({
    userName: zod.string().min(1),  
    password: zod.string().min(8),  
    email: zod.string().email(),  
    bio: zod.string().optional().default(''),  
    createdAt: zod.date().default(() => new Date())  
});

router.post("/",async (req,res)=>{
   
    
    const {userName,password,email,bio,createdAt} = req.body;
    const response = userSchema.safeParse({userName:userName,password:password,email:email,bio:bio,createdAt:createdAt});
   
    // console.log("This is respo",response);
    
    if(!response.success)
    {
        return res.status(400).json({
            msg:"false"
        })
    }
    try{
    const db = await User.create({
        userName:userName,password:password,email:email,bio:bio,createdAt:createdAt
    })  

    const token = jwt.sign(email,jwtPass);
    res.status(200).json({
        msg:"Sucess",
        token
    });
    }
    catch(error)
    {
        // console.log(error);
        
        res.status(400).json({
            msg:error
        })
    }
    
   
    

});

module.exports = router;