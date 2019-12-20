const express = require('express')
const sanitize = require('../../utility/santize-input')
const joi = require('@hapi/joi')


const {User} = require('../../models/user')


const router = express.Router()


router.post("/login",async (req,res)=>{
    try {
        var loginCreds ={email,password} = req.body
        const schema = joi.object().keys({
          email: joi.string().email().required(),
          password: joi.string().required()
        })
        if(a = schema.validate(loginCreds).error)
        return res.status(400).send({
          success: false,
          message: a.details[0].message
        })
        sanitize.sanitizerEscape(loginCreds)
        var findUser = await User.findOne({
            email: loginCreds.email
          });
          if (!findUser) {
            return res.status(400).send({
              success: false,
              message: 'Invalid email or password'
            });
          }
        var userLogin = User();
        if(!await userLogin.validPassword(loginCreds.password,findUser.password)){
            return res.status(400).send({
                success: false,
                message: 'Invalid email or password'
              });
        }
        const token = await userLogin.generateAuthToken(loginCreds.email);
        return res.header('x-auth-token', token).status(200).send({
          success: true,
          message: 'logged in'
        });
         
    } catch (error) {
        return res.status(400).send({
          success: false,
          message: `${error}`
        })
    }

})

router.get('/logout', async (req, res) => {
    res.header('x-auth-token', null).status(200).send({
        success: true,
        message: "Logged Out"
      });
  });

module.exports = router