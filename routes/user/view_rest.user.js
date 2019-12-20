/**
 * 
 * NOT IN THE FIRST VERSION OF APP
 * 
 */

const express = require('express')

const {Rest} = require('../../models/rest')
const userMiddleware = require('../../middleware/user/user.middleware')

const router = express.Router()

router.get("/view",[userMiddleware.isLoggedIn,userMiddleware.isOTPVerified],async (req,res)=>{
    try {
        let result = await Rest.find({},{verify: 0,password: 0})
        if(result)
        return res.status(200).send({
            success: true,
            message: result
        })        
        else
        return res.status(400).send({
            success: false,
            message: "Opps! Something went wrong"
        }) 
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: "Opps! Something went wrong"
        })
    }

})

router.get("/view/:id",[userMiddleware.isLoggedIn,userMiddleware.isOTPVerified,userMiddleware.isProfileComplete],async (req,res)=>{
    // console.log(req.params.id)
    try {
        let result = await Rest.findById(req.params.id,{verify: 0,password: 0})
        if(result)
        return res.status(200).send({
            success: true,
            message: result
        })
        else
        return res.status(400).send({
            success: false,
            message: "No Restaurants found!"
        })
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: "Opps! Something went wrong"
        })
    }
})

module.exports = router