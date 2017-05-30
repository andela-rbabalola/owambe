import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { isEmail } from 'validator';

/* eslint func-names: 0*/

const Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');

const authTypes = ['twitter', 'facebook', 'google'];

// create a Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    validate: [{ validator: value => isEmail(value), msg: 'Invalid email.' }],
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    enum: ['twitter', 'facebook', 'google', 'local']
  },
  isAdmin: Boolean,
  twitter: {},
  facebook: {},
  google: {},
  createdAt: Date,
  updatedAt: Date
});

// add date and perform validation on name and password

// I am using ES5 because of the lexical this
// check this out for more info
// https://stackoverflow.com/questions/37365038/this-is-undefined-in-a-mongoose-pre-save-hook
UserSchema.pre('save', function (next) {
  // add the date field before saving
  // gives us the current time in Nigeria
  const currentDate = new Date().toLocaleString();

  // change the updated_at field to current date
  this.updatedAt = currentDate;

  // if createdAt doesn't exist, add to that field
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }

  // hash password
  this.password = this.encryptPassword(this.password);

  next();
});

// the below 4 validations only apply if you are signing up traditionally
UserSchema.path('username').validate(function (username) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return username.length;
}, 'Username cannot be blank');

UserSchema.path('email').validate(function (email) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('username').validate(function (username) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return username.length;
}, 'Username cannot be blank');

UserSchema.path('password').validate(function (password) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return password.length;
}, 'Password cannot be blank');


/**
 * Methods
 */
UserSchema.methods = {
  /**
   * authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean} boolean
   * @api public
   */
  authenticate(plainText) {
    if (!plainText || !this.password) {
      return false;
    }
    return bcrypt.compareSync(plainText, this.password);
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String} encrypted
   * @api public
   */
  encryptPassword(password) {
    if (!password) {
      return '';
    }
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }
};

const User = mongoose.model('User', UserSchema);

export default User;
