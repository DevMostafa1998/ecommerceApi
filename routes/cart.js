var express = require('express');
const { verify } = require('jsonwebtoken');
const Cart = require('../models/Cart');
const { verfyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
var router = express.Router();

//CREAE

router.post("/", verfyToken, async (req, res)=>{
    const newCart = new Cart(req.body)
    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    }catch(err){
        res.status(500).json(err)
    }
})

//UPDATE
router.put("/:id",verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const updateCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new: true})
        res.status(200).json(updateCart)
    }catch(err){
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async(req, res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted...")
    }catch(err){
        res.json(500).json(err)
    }
})


//GET USER CART 
router.get("/find/:userId", verifyTokenAndAuthorization, async(req, res)=>{
    try{
        const cart = await Cart.findOne({userId: req.params.userId})

        res.status(200).json({cart})
    }catch(err){
        res.json(500).json(err)
    }
})

//GET ALL 
router.get('/', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const carts = await Cart.find()
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;
