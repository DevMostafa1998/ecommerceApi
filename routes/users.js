var express = require('express');
const { verify } = require('jsonwebtoken');
const Users = require('../models/Users');
const { verfyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
var router = express.Router();

/* GET users listing. */

//UPDATE
router.put("/:id",verifyTokenAndAuthorization, async (req, res)=>{
    if(req.body.password){
        req.body.password=  CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

    try{
        const updateUser = await Users.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new: true})
        res.status(200).json(updateUser)
    }catch(err){
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async(req, res)=>{
    try{
        await Users.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted...")
    }catch(err){
        res.json(500).json(err)
    }
})


//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        const user = await Users.findByIdAndDelete(req.params.id)
        res.status(200).json({user})
    }catch(err){
        res.json(500).json(err)
    }
})

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async(req, res)=>{
    const query =  req.query.new;
    try{
        const users = query
            ? await Users.find().sort({_id:-1}).limit(5)
            : await user.find()
        res.status(200).json(users)
    }catch(err){
        res.json(500).json(err)
    }
})


//GET USERS STATS
router.get("/stats", verifyTokenAndAdmin, async(req, res)=>{
    const date = new Date();
    const lastyear = new Date(date.setFullYear(date.getFullYear() - 1));
    try{

        const data = await Users.aggregate([
            {$macth:{createdAt: {$gte: lastyear}}},
            {
                $project:{
                    month: {$month: "$createdAt"}
                }
            },
            {
                $group:{
                    _id: "$month",
                    total:{$sun: 1}
                }
            }
        ])

        res.status(200).json(data)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;
