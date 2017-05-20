const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const _ = require('underscore');

const authTypes = ['twitter', 'facebook', 'google'];

// create a Schema
const UserSchema = new Schema({
  name: String,
  email: String,
  username: String,
  hashed_password: String,
  provider: String,
  admin: Boolean,
  twitter: {},
  facebook: {},
  google: {},
  createdAt: Date,
  updatedAt: Date
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set((password) => {
  this._password = password;
  this.hashed_password = this.encryptPassword(password);
}).get(() => {
  return this._password;
});

// the below 4 validations only apply if you are signing up traditionally
UserSchema.path('name').validate((name) => {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) { return true; }
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate((email) => {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) { return true; }
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('username').validate((username) => {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) { return true; }
  return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate((hashed_password) => {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) { return true; }
  return hashed_password.length;
}, 'Password cannot be blank');

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    if (!plainText || !this.hashed_password) {
      return false;
    }
    return bcrypt.compareSync(plainText, this.hashed_password);
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password) { return ''; }
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }
};

const User = mongoose.model('User', userSchema);

module.exports(User);
