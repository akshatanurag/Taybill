const jwt = require('jsonwebtoken')
const { User } = require('../models/user');
const config = require('config')

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
            if(req.currentUser!== 0)
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
    }
}