const express = require('express')
const sanitizer = require('sanitizer')

const {User} = require('../../models/user')


const router = express.Router()


router.post("/login",async (req,res)=>{
    try {
        var loginCreds ={email,password} = req.body
        if(loginCreds.email == null || loginCreds.password == null)
        throw 'Email or Password is required'
        Object.keys(loginCreds).forEach((props)=>{
            if(loginCreds[props]!== null)
                loginCreds[props] = sanitizer.escape(loginCreds[props])
            else
            throw 'Email or Password is required'
        })
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