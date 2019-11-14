const express = require('express')
const authMiddleware = require('../../middleware/auth.middleware')
const {User, validate,validateProfile} = require('../../models/user')
const santizer = require('sanitizer')

const router = express.Router()

router.get("/profile",authMiddleware.isLoggedIn,(req,res)=>{

    res.send({
        success: true,
        message: {
            userInfo: req.currentUser
        }
    })
})

router.post("/profile",authMiddleware.isLoggedIn,async (req,res)=>{

    try {
        let userProfile = {gender,dob,addressLine1,addressLine2,city,state,pincode} = req.body
        if(!userProfile.gender || !userProfile.dob || !userProfile.addressLine1 || !userProfile.city || !userProfile.state || !userProfile.pincode){
            return res.status(400).send({
                success: false,
                message: "All fields are required"
            })
        }
        Object.keys(userProfile).forEach((props)=>{
            if(userProfile[props]!=null){
                userProfile[props]=santizer.escape(userProfile[props])
            }
        })
    
        const { error } = await validateProfile(userProfile);
        if (error)
          return res.status(400).send({
            success: false,
            message: error.details[0].message
          });
    
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