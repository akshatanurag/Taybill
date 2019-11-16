const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: vaule => {
        return validator.isEmail(vaule);
      },
      message: "{value} is not a email"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  mob_no: {
    type: Number,
    required: true,
    maxlength: 10,
    unique: true
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
    }
  },
  profile: {
    gender:{
      type: String,
      maxlength: 1,
    },
    dob: {
      type: String,
      maxlength: 11
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
      }
    }
  }

});
mongoose.Promise = global.Promise;
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password, hashPass) {
  return bcrypt.compareSync(password, hashPass);
};

userSchema.methods.generateAuthToken = function(bodyEmail) {
  return jwt.sign(
    {
      email: bodyEmail,
      type: "User"
    },
    config.get("jwtPrivateKey"),
    {
      expiresIn: "30d"
    }
  );
};

function validateSchema(user) {
  const schema = joi.object().keys({
    name: joi
      .string()
      .min(1)
      .max(50)
      .required(),
    email: joi
      .string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: joi
      .string()
      .min(5)
      .max(255)
      .required(),
    mob_no: joi.number().min(10).required(),
  });
  return schema.validate(user);
}

let validateProfile = (profile)=>{
  const schema = joi.object().keys({
    gender: joi.string().required(),
    dob: joi.string().max(11).required(),
    addressLine1: joi.string().max(100).required(),
    addressLine2: joi.string().max(100),
    city: joi.string().max(100).required(),
    state: joi.string().max(100).required(),
    pincode: joi.number().required()
  })
  return schema.validate(profile)
}

var User = mongoose.model("user", userSchema);

module.exports = {
  User,
  validate: validateSchema,
  validateProfile
};
