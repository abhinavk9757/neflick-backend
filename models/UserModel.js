const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: email => validator.isEmail(email),
      message: email => `${email.value} is not an E-mail!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.toJSON = function() {
  const user = this;
  // const userObject = user.toObject();
  return _.pick(user, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign(
    { _id: user._id.toHexString(), access },
    process.env.SECRET_KEY,
  );
  user.tokens = user.tokens.concat([{ access, token }]);

  return user.save().then(() => {
    return token;
  });
};

userSchema.statics.findByToken = function(token) {
  const user = this;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch (e) {
    return Promise.reject();
  }

  return user.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': decoded.access,
  });
};

const userModel = mongoose.model('loginInfo', userSchema);

module.exports = userModel;
