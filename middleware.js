const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const jwtPass = process.env.JWT_SECRET;

  function middleware(req,res,next){

    if(req.path == '/allPost')
       return next();

    const authHeader= req.headers.authorization;

    if(!authHeader)
    {
        res.status(404).json({
            msg:"Authentication token not found"
        })
    }
    if(!jwtPass)
    {
        res.status(404).json({
            msg:"Jwt secret password is not defined "
        })
    }
    const token = authHeader;



    try{
        const a = jwt.verify(token,jwtPass,)
        req.id = a;
   
        
        next();
    }
    catch(error)
    {
        res.status(400).json({
            msg:"Invalid token ",
            error
        })
    }
   
}
module.exports = {middleware};





