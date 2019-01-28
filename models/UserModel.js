const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
  const User = this;
  return _.pick(User, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function() {
  const User = this;
  const access = 'auth';
  const token = jwt.sign(
    { _id: User._id.toHexString(), access },
    process.env.SECRET_KEY,
  );
  User.tokens = User.tokens.concat([{ access, token }]);

  return User.save().then(() => {
    return token;
  });
};

userSchema.statics.removeToken = function(token) {
  const User = this;
  return User.findOneAndUp
  date({}, { $pull: { tokens: { token: token } } });
};

userSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': decoded.access,
  });
};

userSchema.statics.findByCredentials = function(email, password) {
  const User = this;
  return User.findOne({ email: email }).then(user => {
    return bcrypt.compare(password, user.password).then(result => {
      if (!result) {
        return Promise.reject();
      }
      return Promise.resolve(user);
    });
  });
};

userSchema.pre('save', function(next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.hash(user.password, 10).then(hashedPassword => {
      user.password = hashedPassword;
      next();
    });
  } else {
    next();
  }
});

const userModel = mongoose.model('loginInfo', userSchema);

module.exports = userModel;
