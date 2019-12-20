const express = require('express')
const middleware = require('../../middleware/rest/rest.middleware')
const sanitize = require('../../utility/santize-input')

const {Rest,validateProfile} = require('../../models/rest')

const router = express.Router()

router.get("/profile",[middleware.isRestLoggedIn,middleware.isDocsVerified,middleware.isOTPVerified,middleware.isProfileComplete],(req,res)=>{

    res.status(200).send({
        success: true,
        message: {
            restInfo: req.currentRest
        }
    })
})

router.post("/profile",[middleware.isRestLoggedIn,middleware.isDocsVerified,middleware.isOTPVerified],async (req,res)=>{
    try {
        let input = {profilePic,contact,total_seats,addressLine1,addressLine2,city,state,pincode,lat,lng} = req.body

        const {error} = validateProfile(input)
        if(error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        })
    
        sanitize.sanitizerEscape(input)
        let result = await Rest.updateOne({email: req.rest.email},{$set: {
            profilePic: input.profilePic,
            contact: input.contact,
            "seat_info.total": input.total_seats,
            'address.addressLine1': input.addressLine1,
            'address.addressLine2':input.addressLine2,
            'address.city': input.city,
            'address.state': input.state,
            'address.pincode': input.pincode,
            'location.type': "Point",
            'location.coordinates':[input.lng,input.lat]
        }})
        if(result.ok){
            let res1 = await Rest.updateOne({email: req.rest.email},{$set: {isProfileComplete: true}})
            if(res1.ok)
            return res.status(200).send({
                success: true,
                message: "Profile updated."
            })
        } else{
          return res.status(400).send({
              success: false,
              message: "Profile not updated. Something went wrong"
          })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success: false,
            message: "Opps! Something went wrong..."
        })
    }

    
})

module.exports = router