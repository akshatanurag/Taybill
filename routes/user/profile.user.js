const express = require('express')
const authMiddleware = require('../../middleware/user/user.middleware')
const {User, validate,validateProfile} = require('../../models/user')
const sanitize = require('../../utility/santize-input')

const router = express.Router()

router.get("/profile",[authMiddleware.isLoggedIn,authMiddleware.isOTPVerified,authMiddleware.isProfileComplete],(req,res)=>{

    res.send({
        success: true,
        message: {
            userInfo: req.currentUser
        }
    })
})

router.post("/profile",[authMiddleware.isLoggedIn,authMiddleware.isOTPVerified],async (req,res)=>{

    try {
        let userProfile = {gender,dob,addressLine1,addressLine2,city,state,pincode} = req.body

        const { error } = await validateProfile(userProfile);
        if (error)
          return res.status(400).send({
            success: false,
            message: error.details[0].message
          });
    
        sanitize.sanitizerEscape(userProfile)
    

          result = await User.updateOne({email: req.user.email},{$set: {
            'profile.gender': userProfile.gender,
            'profile.dob': userProfile.dob,
            'profile.address.addressLine1': userProfile.addressLine1,
            'profile.address.addressLine2': userProfile.addressLine2,
            'profile.address.city': userProfile.city,
            'profile.address.state': userProfile.state,
            'profile.address.pincode': userProfile.pincode
          }})
          if(result.ok){
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
            message: error
        })
    }



      
    
        
})


module.exports = router