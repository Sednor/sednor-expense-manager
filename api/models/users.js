const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
});

userSchema.methods.setPassword = (user, password) => {
  user.salt = crypto.randomBytes(16).toString('hex');
  user.hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = (user, password) => {
  const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');

  return user.hash === hash;
};

userSchema.methods.generateJwt = (user) => {
  let expiry = new Date();

  console.log('---++++++');
  console.log(this);

  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign({
    _id: user._id,
    email: user.email,
    name: user.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, 'MY_SECRET'); // FOR TEST, DO NOT KEEP SECRET IN THE CODE
};

mongoose.model('User', userSchema);
