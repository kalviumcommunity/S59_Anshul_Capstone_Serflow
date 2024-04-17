const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
      password: {
      hash: String,
      salt: String,
    },
  }, { timestamps: true });


userSchema.methods.setPassword = function (password) {
  this.password.salt = crypto.randomBytes(16).toString('hex');
  this.password.hash = crypto
    .pbkdf2Sync(password, this.password.salt, 1000, 64, 'sha512')
    .toString('hex');
};

userSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.password.salt, 1000, 64, 'sha512')
    .toString('hex');
  return this.password.hash === hash;
};

const User = mongoose.model('users', userSchema);

module.exports = User;

      