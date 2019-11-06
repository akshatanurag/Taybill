const express= require('express')
const sanitizer = require('sanitizer');
var owasp = require('owasp-password-strength-test');
const randomstring = require('randomstring')

const {  User, validate} = require('../models/user')

owasp.config({
    allowPassphrases: true,
    maxLength: 128,
    minLength: 5,
    minPhraseLength: 20,
    minOptionalTestsToPass: 4
  });

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.mob_no) throw 'error';
    var passStrength = owasp.test(req.body.password);
    if (passStrength.errors.length > 0)
      return res.status(400).send({
        errors: passStrength.errors
      });
      const submittedUser = {name,email,password,mob_no} = req.body

      Object.keys(submittedUser).forEach(props => {
        if (submittedUser[props] !== null) {
          submittedUser[props] = sanitizer.escape(submittedUser[props]);
        }
      });

    if (await User.findOne({email: submittedUser.email})) {
      return res.status(400).send({
        success: false,
        message: 'Email taken'
      });
    }
    if (await User.findOne({mob_no: submittedUser.mob_no})) {
      return res.status(400).send({
        success: false,
        message: 'Mobile No. taken'
      });
    }

    const { error } = await validate(submittedUser);
    if (error)
      return res.status(400).send({
        success: false,
        message: error.details[0].message
      });

    var user = new User({
      name: submittedUser.name,
      email: submittedUser.email,
      mob_no: submittedUser.mob_no
    });

    user.password = await user.generateHash(submittedUser.password);
    const token = user.generateAuthToken(submittedUser.email);
    let verifyToken = await randomstring.generate({
      length: 50,
      charset: 'hex'
    });
    let verifyOTP = await randomstring.generate({
      length: 6,
      charset: 'numeric'
    });
    user.verify.emailVerifyToken = verifyToken
    user.verify.otp = verifyOTP
    user.dateJoined = Date.now();
      
    await user.save();
    res.header('x-auth-token', token).send({
        success: true,
        message: 'Sign up successful'
    });

  } catch (error) {
    console.log(error)
    return res.status(400).send({
      success: false,
      message: 'Uable to sign you up'
    });
  }
});


module.exports = router