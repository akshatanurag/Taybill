const express = require('express')
const santizer = require('sanitizer')
const {Rest} = require('../../models/rest')

const router = express.Router()

router.post("/rest/login",async (req,res)=>{
    let input = {email,password} = req.body
    if(!input.email || !input.password)
    return res.status(400).send({
        success: false,
        message: "All fields are required"
    })
    Object.keys(input).forEach((props)=>{
        if(input[props]!== null)
        input[props] = santizer.escape(input[props])
    })
    var findRest = await Rest.findOne({
        email: input.email
      });
      if (!findRest) {
        return res.status(400).send({
          success: false,
          message: 'Invalid email or password'
        });
      }
    var restLogin = Rest();
    if(!await restLogin.validPassword(input.password,findRest.password)){
        return res.status(400).send({
            success: false,
            message: 'Invalid email or password'
          });
    }
    const token = await restLogin.generateAuthToken(findRest.email);
    return res.header('x-auth-token', token).status(200).send({
      success: true,
      message: 'logged in'
    });

})


module.exports = router