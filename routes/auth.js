var express = require('express');
var router = express.Router();
const UserModel = require("../models/Users");
const CryptoJS = require('crypto-js')
const jwt = require("jsonwebtoken")
// REGISTER
router.post("/register", async (req, res)=>{
    const newUser = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password:  CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    })
    try{
        const saveUser = await newUser.save()
        res.status(201).json(saveUser)
    }catch(err){
        res.status(500).json({"err": err})
    
    }
})


//LOGIN
router.post("/login", async(req, res)=>{
    try{
        const user = await UserModel.findOne({username: req.body.username})
        !user && res.status(401).json("Worng credentails1")

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)
        const password = hashedPassword.toString(CryptoJS.enc.Utf8)

        password !== req.body.password &&
         res.status(401).json("Worng credentails2")

         const accessToken = jwt.sign({
             id: user._id,
             isAdmin: user.isAdmin
         }, process.env.JWT_SEC,
         {expiresIn: "3d"}
         )
        //  const { password, ...others} = user._doc
        res.status(200).json({user, accessToken})

    }catch(err){
        res.status(500).json({err: err})
    }
})
module.exports = router;
