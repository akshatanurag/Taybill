const jwt = require('jsonwebtoken')
const CryptoJS = require('crypto-js')
const { User } = require('../../models/user');
const {Table} = require('../../models/table.rest')
const {Rest} = require('../../models/rest')
const config = require('config')
const snatize = require('../../utility/santize-input')
const {Order,orderJoi} = require('../../models/order')


const fetchUser = async email => {
    var findUser = await User.findOne({
      email: email
    }).select("-password")
    if (!findUser) return 0;
    return findUser;
  };

module.exports = {
    isLoggedIn: async(req,res,next)=>{
        try {
            const token = req.header('x-auth-token');
            if (!token)
              return res.status(401).send({
                success: false,
                message: 'Access denied'
              });
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            req.user = decoded;
            req.currentUser = await fetchUser(decoded.email)
            if(req.currentUser!== 0 && req.user.type === "User")
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
      if(req.currentUser.verify.isNumberVerified)
      next()
      else
      return res.status(401).send({
        success: false,
        message: 'Verify OTP first'
      });
    },
    isProfileComplete: (req,res,next)=>{
      if(Object.keys(req.currentUser.profile).length == 3+1 && Object.keys(req.currentUser.profile.address).length == 5+1)
      next()
      else
      return res.status(401).send({
        success: false,
        message: 'Profile Not Complete.'
      });
    },
    hasScannedCorrectQR: async (req,res,next)=>{
      snatize.sanitizerEscape(req.body.qr)
      let result = await Table.find(
        {"tableInfo.qrcode": req.body.qr}, 
        {_id: 0, tableInfo: {$elemMatch: {qrcode: req.body.qr}}});
        if(result.length == 1)
          next()
        else  
        return res.status(400).send({
          success: false,
          message: "Invalid QR Code"
        })
    },
    isNearRest: async (req,res,next)=>{
      snatize.sanitizerEscape(req.body.qr)
      snatize.sanitizerEscape(req.body.lng)
      snatize.sanitizerEscape(req.body.lat)
      var bytes  = CryptoJS.AES.decrypt(req.body.qr.toString(), 'taybillSecret123@akshat');
      var decryptedTableData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      /**
       * 
       * FOR POINT DISTANCE
       *
       */

      /*let rest = await Rest.findOne({_id: decryptedTableData.rest_id,location:{$near: {$geometry: {
          type: "Point",
          coordinates: [req.body.lng, req.body.lat],
          },$maxDistance : 200
      }}}).select("-password").select("-verify") */

      /**
       * 
       * FOR RADIUS
       * 
       */
      let rest = await Rest.findOne({_id: decryptedTableData.rest_id,location:{$geoWithin: {$centerSphere: [
        [req.body.lng,req.body.lat], 1/6378.1] // 1 km radius
      }}}).select("-password").select("-verify")
      // console.log(rest)
      if(rest)
      next()
      else
      return res.status(400).send({
        success: false,
        message: "Too far away from restuarant"
      })
    }
}