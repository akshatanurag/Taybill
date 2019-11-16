const mongoose = require('mongoose')
const joi = require('@hapi/joi')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config=require("config")


var restSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 100,
        required: true
    },
    profilePic: {
        type: String,
        minlength: 1,
        maxlength: 500,
    },
    email: {
        type: String,
        minlength: 1,
        trim: true,
        unique: true,
        required: true
    },
    contact: {
        type: Number,
        minlength: 1,
        maxlength: 10,
        unique: true
    },
    dateJoined: Date,
    password: {
        type: String,
        minlength: 6
    },
    seat_info: {
        total:{
            type: Number
        },
        occupied: {
            type: Number,
        }
    },
    address: {
        addressLine1: {
          type: String,
          maxlength: 100
        },
        addressLine2: {
          type: String,
          maxlength: 100
        },
        city: {
          type: String,
          maxlength: 100
        },
        state: {
          type: String,
          maxlength: 100
        },
        pincode: {
          type: Number,
          maxlength: 100
        },
        location:{
            type: {
              type: String
            },
            coordinate: [{
              type: Number
            }]
        }
    },
    dateJoined: Date,
    verify:{
        isEmailVerified: {
          default: 0,
          type: Number
        },
        emailVerifyToken: {
          type: String,
          trim: true,
          maxlength: 50
        },
        isNumberVerified: {
          default: 0,
          type: Number
        },
        otp: {
          type: Number,
          trim: true
        },
        docsVerified: {
            default: 0,
            type: Number
        }
      }
})

mongoose.Promise = global.Promise

restSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
restSchema.methods.validPassword = function(password, hashPass) {
  return bcrypt.compareSync(password, hashPass);
};

restSchema.methods.generateAuthToken = function(bodyEmail) {
  return jwt.sign(
    {
      email: bodyEmail,
      type: "Rest"
    },
    config.get("jwtPrivateKey"),
    {
      expiresIn: "30d"
    }
  );
};

const validateRestSignup = async (input)=>{
    const schema = joi.object().keys({
      name: joi.string().min(1).max(100).required(),
      email: joi.string().email().min(10).max(100).required(),
      password: joi.string().min(6).max(255).required()
    })

    return schema.validate(input)
}

const validateProfile = (input)=>{
  const schema = joi.object().keys({
    profilePic: joi.string().min(1).max(200).required(),
    addressLine1: joi.string().max(100).required(),
    addressLine2: joi.string().max(100),
    city: joi.string().max(100).required(),
    state: joi.string().max(100).required(),
    pincode: joi.number().required(),
    contact: joi.number().min(10).required(),
    lat: joi.number().required(),
    lng: joi.number().required(),
    total_seats: joi.number().required()
  })
  return schema.validate(input)
}

var Rest = mongoose.model('restaurant_user',restSchema)

module.exports = {
    Rest,
    validateRestSignup,
    validateProfile
}