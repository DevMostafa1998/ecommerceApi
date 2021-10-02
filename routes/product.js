var express = require('express');
const { verify } = require('jsonwebtoken');
const Product = require('../models/Product');
const { verfyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
var router = express.Router();

//CREAE

router.post("/", async (req, res)=>{
    const newProduct = new Product(req.body)
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct)
    }catch(err){
        res.status(500).json(err)
    }
})

//UPDATE
router.put("/:id",verifyTokenAndAdmin, async (req, res)=>{
    try{
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new: true})
        res.status(200).json(updateProduct)
    }catch(err){
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted...")
    }catch(err){
        res.json(500).json(err)
    }
})


//GET Product
router.get("/find/:id", verifyTokenAndAuthorization, async(req, res)=>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({user})
    }catch(err){
        res.json(500).json(err)
    }
})

//GET ALL Product
router.get("/", verifyTokenAndAuthorization, async(req, res)=>{
    const qNew =  req.query.new;
    const qcategory =  req.query.category;
    // res.status(200).json(await Product.find())
    try{
        let products;
        if (qNew && qcategory) {

            //    http://localhost:3200/api/products?category=man&new=true
            products = await Product.find({
                categoryes: {
                    $in: [qcategory]
                }
            }).sort({ createdAt: -1 }).limit(5)

        } else if (qcategory) {

            //    http://localhost:3200/api/products?category=name_category
            products = await Product.find({
                categoryes: {
                    $in: [qcategory]
                }
            })

        } else if (qNew) {

            //    http://localhost:3200/api/products?new=true
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
            
        } else {
            products = await Product.find()
        }
        res.status(200).json(products)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;
