const jwt = require('jsonwebtoken')
const { Rest } = require('../../models/rest');
const config = require('config')

const fetchUser = async email => {
    var findUser = await Rest.findOne({
      email: email
    }).select("-password")
    if (!findUser) return 0;
    return findUser;
  };

module.exports = {
    isRestLoggedIn: async (req,res,next)=>{
        try {
            const token = req.header('x-auth-token');
            if (!token)
              return res.status(401).send({
                success: false,
                message: 'Access denied'
              });
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            req.rest = decoded;
            req.currentRest = await fetchUser(decoded.email)
            if(req.currentRest!== 0 && req.rest.type === "Rest")
              next();
            else
              return res.status(401).send({
                success: false,
                message: 'Invalid Session or token'
              });
          } catch (e) {
            console.log('Generated from isLoggedIn Middileware' + e);
            return res.status(401).send({
              success: false,
              message: 'Access denied'
            });
          }
    },
    isOTPVerified: (req,res,next)=>{
      if(req.currentRest.verify.isNumberVerified)
      next()
      else
      return res.status(401).send({
        success: false,
        message: 'Verify OTP first'
      });
    },
    isProfileComplete: (req,res,next)=>{
      if(req.currentRest.isProfileComplete)
      next()
      else
      return res.status(401).send({
        success: false,
        message: 'Profile Not Complete.'
      });
    },
    isDocsVerified: (req,res,next)=>{ 
      if(req.currentRest.verify.docsVerified)
      next()
      else
      return res.status(401).send({
        success: false,
        message: 'Not verified by Taybill.'
      });
    }
}