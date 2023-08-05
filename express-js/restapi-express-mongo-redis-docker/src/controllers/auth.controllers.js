const fs = require('fs');
const crypto = require('crypto');
const appRoot = require('app-root-path');
const User = require('../models/user.model');
const logger = require('../middleware/winston.logger');
const { errorResponse, successResponse } = require('../configs/app.response');
const loginResponse = require('../configs/login.response');
const { validationResult } = require('express-validator');

// TODO: Controller for registration new user
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(
        'FAILED',
        'Validation',
        errors.array()
      ));
    }

    const {
      userName, accountNumber, emailAddress, identityNumber, password
    } = req.body;

    // create new user and store in database
    const user = await User.create({
      userName,
      accountNumber,
      emailAddress,
      identityNumber,
      password
    });

    // success response with register new user
    res.status(201).json(successResponse(
      'SUCCESS',
      'User registered successful',
      {
        userName: user.userName,
      }
    ));
  } catch (error) {
    console.log(error);
    res.status(500).json(errorResponse(
      'SERVER SIDE ERROR',
      error
    ));
  }
};

// TODO: Controller for login existing user
exports.loginUser = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;
    const { loginType } = req.query;

    // check if email or password is empty
    if (!emailAddress || !password) {
      return res.status(400).json(errorResponse(
        'FAILED',
        'Please enter email and password'
      ));
    }

    // check user already exists
    const user = await User.findOne({ emailAddress }).select('+password');

    if (!user) {
      return res.status(404).json(errorResponse(
        'UNKNOWN ACCESS',
        'User does not exist'
      ));
    }

    // if query loginType is "admin"
    if (loginType === 'admin') {
      if (user.role !== 'admin') {
        return res.status(406).json(errorResponse(
          'UNABLE TO ACCESS',
          'Accessing the page or resource you were trying to reach is forbidden'
        ));
      }
    }

    // check if user is "blocked"
    if (user.status === 'blocked') {
      return res.status(406).json(errorResponse(
        'UNABLE TO ACCESS',
        'Accessing the page or resource you were trying to reach is forbidden'
      ));
    }

    // check password matched
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json(errorResponse(
        'FAILED',
        'User credentials are incorrect'
      ));
    }

    // update user status & updateAt time
    const logUser = await User.findByIdAndUpdate(
      user._id,
      { status: 'login', updatedAt: Date.now() },
      { new: true }
    );

    // response user with JWT access token token
    loginResponse(res, logUser);
  } catch (error) {
    res.status(500).json(errorResponse(
      'FAILED',
      error
    ));
  }
};

// TODO: Controller for logout user
exports.logoutUser = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json(errorResponse(
        'UNKNOWN ACCESS',
        'Unauthorized access. Please login to continue'
      ));
    }

    // update user status & updateAt time
    await User.findByIdAndUpdate(
      user._id,
      { status: 'logout', updatedAt: Date.now() },
      { new: true }
    );

    // remove cookie
    res.clearCookie('AccessToken');

    // response user
    res.status(200).json(successResponse(
      'SUCCESS',
      'User logged out successful'
    ));
  } catch (error) {
    res.status(500).json(errorResponse(
      'SERVER SIDE ERROR',
      error
    ));
  }
};

// TODO: Controller for user refresh-token
exports.refreshToken = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json(errorResponse(
        'UNKNOWN ACCESS',
        'User does not exist'
      ));
    }

    const accessToken = user.getJWTToken();
    const refreshToken = user.getJWTRefreshToken();

    // options for cookie
    const options = {
      expires: new Date(Date.now() + process.env.JWT_TOKEN_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true
    };

    res
      .status(200)
      .cookie('AccessToken', accessToken, options)
      .json(successResponse(
        'SUCCESS',
        'JWT refreshToken generate successful',
        { accessToken, refreshToken }
      ));
  } catch (error) {
    res.status(500).json(errorResponse(
      'SERVER SIDE ERROR',
      error
    ));
  }
};
