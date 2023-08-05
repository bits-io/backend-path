const appRoot = require('app-root-path');
const { errorResponse, successResponse } = require('../configs/app.response');
const User = require('../models/user.model');
const logger = require('../middleware/winston.logger');
const MyQueryHelper = require('../configs/api.feature');
const { getDataFromRedis, setDataInRedis } = require('../configs/cache.config');
const { validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');


// TODO: Controller for get user info using id by admin
// exports.getUserByAccountNumber = async (req, res) => {
//   try {
//     const cachedData = await getDataFromRedis(`user_detail:${req.params.id}`);

//     if (cachedData) {
//       return res.status(200).json(successResponse(
//         'SUCCESS',
//         'User information retrieved from cache',
//         cachedData
//       ));
//     }

//     const user = await User.findOne({accountNumber: req.params.number});

//     if (!user) {
//       return res.status(404).json(errorResponse(
//         'UNKNOWN ACCESS',
//         'User does not exist'
//       ));
//     }

//     setDataInRedis(`user_detail:${req.params.number}`, {
//       id: user._id,
//       userName: user.userName,
//       accountNumber: user.accountNumber,
//       emailAddress: user.emailAddress,
//       identityNumber: user.identityNumber,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt
//     }, 3600); // Cache for 1 hour

//     res.status(200).json(successResponse(
//       'SUCCESS',
//       'User information retrieved successful',
//       {
//         id: user._id,
//         userName: user.userName,
//         accountNumber: user.accountNumber,
//         emailAddress: user.emailAddress,
//         identityNumber: user.identityNumber,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt
//       }
//     ));
//   } catch (error) {
//     res.status(500).json(errorResponse(
//       'SERVER SIDE ERROR',
//       error
//     ));
//   }
// };
exports.getUserByAccountNumber = async (req, res) => {
  try {
    const cachedData = await getDataFromRedis(`user_detail:${req.params.id}`);

    if (cachedData) {
      return res.status(200).json(successResponse(
        'SUCCESS',
        'User information retrieved from cache',
        cachedData
      ));
    }

    const user = await User.findOne({accountNumber: req.params.number});

    if (!user) {
      return res.status(404).json(errorResponse(
        'UNKNOWN ACCESS',
        'User does not exist'
      ));
    }

    setDataInRedis(`user_detail:${req.params.number}`, {
      id: user._id,
      userName: user.userName,
      accountNumber: user.accountNumber,
      emailAddress: user.emailAddress,
      identityNumber: user.identityNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }, 3600); // Cache for 1 hour

    res.status(200).json(successResponse(
      'SUCCESS',
      'User information retrieved successfully',
      {
        id: user._id,
        userName: user.userName,
        accountNumber: user.accountNumber,
        emailAddress: user.emailAddress,
        identityNumber: user.identityNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    ));
  } catch (error) {
    res.status(500).json(errorResponse(
      'SERVER SIDE ERROR',
      error
    ));
  }
};

// exports.getUserByIdentityNumber = async (req, res) => {
//   try {
//     const cachedData = await getDataFromRedis(`user_detail:${req.params.id}`);

//     if (cachedData) {
//       return res.status(200).json(successResponse(
//         'SUCCESS',
//         'User information retrieved from cache',
//         cachedData
//       ));
//     }

//     const user = await User.findOne({identityNumber: req.params.number});

//     if (!user) {
//       return res.status(404).json(errorResponse(
//         'UNKNOWN ACCESS',
//         'User does not exist'
//       ));
//     }

//     setDataInRedis(`user_detail:${req.params.number}`, {
//       id: user._id,
//       userName: user.userName,
//       accountNumber: user.accountNumber,
//       emailAddress: user.emailAddress,
//       identityNumber: user.identityNumber,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt
//     }, 3600); // Cache for 1 hour

//     res.status(200).json(successResponse(
//       'SUCCESS',
//       'User information retrieved successful',
//       {
//         id: user._id,
//         userName: user.userName,
//         accountNumber: user.accountNumber,
//         emailAddress: user.emailAddress,
//         identityNumber: user.identityNumber,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt
//       }
//     ));
//   } catch (error) {
//     res.status(500).json(errorResponse(
//       'SERVER SIDE ERROR',
//       error
//     ));
//   }
// };
exports.getUserByIdentityNumber = async (req, res) => {
  try {
    const cachedData = await getDataFromRedis(`user_detail:${req.params.id}`);

    if (cachedData) {
      return res.status(200).json(successResponse(
        'SUCCESS',
        'User information retrieved from cache',
        cachedData
      ));
    }

    const user = await User.findOne({ identityNumber: req.params.number });

    if (!user) {
      return res.status(404).json(errorResponse(
        'UNKNOWN ACCESS',
        'User does not exist'
      ));
    }

    setDataInRedis(`user_detail:${req.params.number}`, {
      id: user._id,
      userName: user.userName,
      accountNumber: user.accountNumber,
      emailAddress: user.emailAddress,
      identityNumber: user.identityNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }, 3600); // Cache for 1 hour

    res.status(200).json(successResponse(
      'SUCCESS',
      'User information retrieved successfully',
      {
        id: user._id,
        userName: user.userName,
        accountNumber: user.accountNumber,
        emailAddress: user.emailAddress,
        identityNumber: user.identityNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    ));
  } catch (error) {
    res.status(500).json(errorResponse(
      'SERVER SIDE ERROR',
      error
    ));
  }
};

// TODO: Controller for update user info
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { user } = req;
    const {
      userName, accountNumber, emailAddress, identityNumber, password
    } = req.body;

    if (!user) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'User does not exist'
      ));
    }

    // update user info & save database
    const updatedUser = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      {
        userName, accountNumber, emailAddress, identityNumber, password
      },
      { runValidators: true, new: true }
    );

    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'User info updated successful',
      {
        userName: updatedUser.userName,
        accountNumber: updatedUser.accountNumber,
        emailAddress: updatedUser.emailAddress,
        identityNumber: updatedUser.identityNumber,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    ));
  } catch (error) {
    res.status(500).json(errorResponse(
      'SERVER SIDE ERROR',
      error.message
    ));
  }
};

// TODO: Controller for delete user using id by admin
exports.deleteUserById = async (req, res) => {
  try {
    // check if user exists
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json(errorResponse(
        'UNKNOWN ACCESS',
        'User does not exist'
      ));
    }

    res.status(200).json(successResponse(
      'SUCCESS',
      'User delete form database successful'
    ));
  } catch (error) {
    res.status(500).json(errorResponse(
      'SERVER SIDE ERROR',
      error
    ));
  }
};

// TODO: Controller for get users list for admin
// exports.getUsersList = async (req, res) => {
//   try {
//     const { user } = req;

//     if (!user) {
//       return res.status(404).json(errorResponse(
//         'UNKNOWN ACCESS',
//         'User does not exist'
//       ));
//     }

//     // finding all users data from database
//     const users = await User.find();

//     if (!users) {
//       return res.status(404).json(errorResponse(
//         'UNKNOWN ACCESS',
//         'Sorry! Any user does not found'
//       ));
//     }

//     // filtering users based on different types query
//     const userQuery = new MyQueryHelper(User.find(), req.query).search('fullName').sort().paginate();
//     const findUsers = await userQuery.query;

//     res.status(200).json(successResponse(
//       'SUCCESS',
//       'Users list data found successful',
//       {
//         rows: [
//           ...findUsers?.map((findUser) => ({
//             id: findUser._id,
//             userName: findUser.userName,
//             accountNumber: findUser.accountNumber,
//             emailAddress: findUser.emailAddress,
//             identityNumber: findUser.identityNumber,
//             createdAt: findUser.createdAt,
//             updatedAt: findUser.updatedAt
//           }))
//         ],
//         total_rows: users.length,
//         response_rows: findUsers.length,
//         total_page: req?.query?.keyword ? Math.ceil(findUsers.length / req.query.limit) : Math.ceil(users.length / req.query.limit),
//         current_page: req?.query?.page ? parseInt(req.query.page, 10) : 1
//       }
//     ));
//   } catch (error) {
//     res.status(500).json(errorResponse(
//       'SERVER SIDE ERROR',
//       error
//     ));
//   }
// };
exports.getUsersList = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json(errorResponse(
        'UNKNOWN ACCESS',
        'User does not exist'
      ));
    }

    const cachedData = await getDataFromRedis('users_list');

    if (cachedData) {
      return res.status(200).json(successResponse(
        'SUCCESS',
        'Users list data retrieved from cache',
        cachedData
      ));
    }

    // finding all users data from database
    const users = await User.find();

    if (!users) {
      return res.status(404).json(errorResponse(
        'UNKNOWN ACCESS',
        'Sorry! Any user does not found'
      ));
    }

    // filtering users based on different types query
    const userQuery = new MyQueryHelper(User.find(), req.query).search('userName').sort().paginate();
    const findUsers = await userQuery.query;

    const responseData = {
      rows: findUsers?.map((findUser) => ({
        id: findUser._id,
        userName: findUser.userName,
        accountNumber: findUser.accountNumber,
        emailAddress: findUser.emailAddress,
        identityNumber: findUser.identityNumber,
        createdAt: findUser.createdAt,
        updatedAt: findUser.updatedAt
      })),
      total_rows: users.length,
      response_rows: findUsers.length,
      total_page: req?.query?.keyword ? Math.ceil(findUsers.length / req.query.limit) : Math.ceil(users.length / req.query.limit),
      current_page: req?.query?.page ? parseInt(req.query.page, 10) : 1
    };

    setDataInRedis('users_list', responseData, 3600); // Cache for 1 hour

    res.status(200).json(successResponse(
      'SUCCESS',
      'Users list data retrieved successful',
      responseData
    ));
  } catch (error) {
    res.status(500).json(errorResponse(
      'SERVER SIDE ERROR',
      error.message
    ));
  }
};

exports.addUser = async (req, res) => {
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

    // Set the new user data in Redis with a specific key and expiration
    setDataInRedis(`user:${user._id}`, user, 3600); // 1 hour expiration

    // success response with register new user
    res.status(201).json(successResponse(
      'SUCCESS',
      'User created successful',
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