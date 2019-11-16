const express = require('express')
const {Rest} = require('../../models/rest')
const joi = require('@hapi/joi')

const sanitize = require('../../utility/santize-input')


const router = express.Router()

router.post("/rest/login",async (req,res)=>{
    let input = {email,password} = req.body

    const schema = joi.object().keys({
      email: joi.string().email().max(255).required(),
      password: joi.string().max(255).required()
    })
    if(a = await schema.validate(input).error)
    return res.status(400).send({
      success: false,
      message: a.details[0].message
    })


    sanitize.sanitizerEscape(input)

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