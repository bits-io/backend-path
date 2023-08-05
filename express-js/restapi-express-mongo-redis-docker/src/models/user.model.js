const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: [true, 'User name filed is required']
  },
  accountNumber: {
    type: String,
    unique: true,
    required: [true, 'Full name filed is required']
  },
  emailAddress: {
    type: String,
    unique: true,
    required: [true, 'Email filed is required'],
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  identityNumber: {
    type: String,
    unique: true,
    required: [true, 'Identity number filed is required']
  },
  password: {
    type: String,
    required: [true, 'Password filed is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// after save, hash password
usersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 8);
});

// JWT Access Token
usersSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES
  });
};

// JWT Refresh Token
usersSchema.methods.getJWTRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES
  });
};

// compare password
usersSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Users', usersSchema);
