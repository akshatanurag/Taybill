const express = require('express')
const {Rest,validateRestSignup} = require('../../models/rest')
const randomstring = require('randomstring')

const sanitize = require('../../utility/santize-input')


const router = express.Router()

router.post("/signup",async (req,res)=>{
    try {
    let input = {name,email,password} = req.body

    let {error} = await validateRestSignup(input)
    if (error)
    return res.status(400).send({
      success: false,
      message: error.details[0].message
    });
    
    sanitize.sanitizerEscape(input)

    if(await Rest.findOne({email: input.email}))
    return res.status(400).send({
        success: false,
        message: "Email already taken."
    })
    let rest = new Rest({
        name: input.name,
        email: input.email,
        'location.type': 'Point',
        'location.coordinates': [ 0,0 ]
    })
    rest.password = await rest.generateHash(input.password)
    const token = await rest.generateAuthToken(input.email);
    let verifyToken = await randomstring.generate({
        length: 50,
        charset: 'hex'
      });
      let verifyOTP = await randomstring.generate({
        length: 6,
        charset: 'numeric'
      });
      rest.verify.emailVerifyToken = verifyToken
      rest.verify.otp = verifyOTP
      rest.dateJoined = Date.now();
    await rest.save().then(()=>{
        return res.header('x-auth-token',token).status(200).send({
            success: true,
            message: "Signup successful."
        })
    }).catch((err)=>{
        return res.status(400).send({
            success: false,
            message: "Signup failed."
        })
    })

    } catch (error) {
        console.log("Catch " + error)
        return res.status(400).send({
            success: false,
            message: "Opps! Something went wrong"
        })
    }
    
})


module.exports = router