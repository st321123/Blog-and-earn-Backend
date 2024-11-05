const express = require("express");
const mongoose = require("mongoose");
const { Superchat } = require("../../models/superChat");
const { User } = require("../../models/user"); // User model for balance updates
const { middleware } = require('../../middleware'); // Middleware for authentication
const router = express.Router();
const { v4: uuidv4 } = require("uuid"); // For generating unique transaction IDs
const { Post } = require("../../models/post");

// Transfer Superchat coins
router.post("/:postId/transfer", middleware, async (req, res) => {
    const senderId = req.id; // Assuming userId is set by middleware after authentication
    const postId = req.params.postId;
    const { recipientId, amount } = req.body; // recipientId of post author and transfer amount
    
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Get sender and recipient details
        const sender = await User.findOne({email:senderId}).session(session);
    
        const exist = await Post.find({_id:postId ,author:recipientId}).populate("author");
       
        
        if(!exist.length)
        {
            return res.status(404).json({
                msg:"Post not found "
            })
        }
       
        if (String(sender._id) === String(exist[0].author._id)) {
      
            return res.status(400).json({
                msg: "Cannot send to itself"
            });
        }
        const recipient = await User.findById(recipientId).session(session);

        // Check if sender has enough balance
        if (sender.coins < amount) {
            return res.status(400).json({ msg: "Insufficient balance" });
        }

        // Calculate balances before and after the transaction
        const balanceBefore = sender.coins;
        const balanceAfter = balanceBefore - amount;

        // Update sender and recipient balances
        sender.coins -= amount;
        recipient.coins += amount;

        await sender.save({ session });
        await recipient.save({ session });

        // Create a new transaction record
        const transaction = new Superchat({
            postId,
            userId: sender._id,
            recieverId:recipient._id,
            amount,
            balanceBefore,
            balanceAfter,
            status: "completed",
            transactionId: uuidv4()
        });
        await transaction.save({ session });

        await session.commitTransaction();
        res.status(201).json({ message: "Superchat sent successfully", transaction });
    } catch (error) {
        await session.abortTransaction();
        // console.error("Error processing transaction:", error);
        res.status(500).json({ message: "Transaction failed" });
    } finally {
        session.endSession();
    }
});

// Fetch all transactions made by the user
router.get("/:senderID/transactions", middleware, async (req, res) => {

   
    const userId = req.params.senderID; // Assume userId is set by the middleware
  
    try {
        // Retrieve all transactions where the user is the sender
        const transactionsSend = await Superchat.find( { userId:userId} )
            .populate("userId","coins , userName")
            .populate("recieverId", "userName")
            .populate("postId", "title") 
            .sort({ createdAt: -1 }); 
        const transactionsRecieved = await Superchat.find( {recieverId:userId} )
            .populate("userId","coins, userName")
            .populate("postId", "title") 
            .sort({ createdAt: -1 }); 
          
            

        if(!transactionsSend.length && !transactionsRecieved.length)
        {
            return res.status(200).json({
                msg:"No transactions found ",
                transactionsSend,
                transactionsRecieved
            })
        }
         
      
            
            
            
        res.status(200).json({ transactionsSend, transactionsRecieved });
    } catch (error) {
        // console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Failed to retrieve transactions" });
    }
});

module.exports = router;
