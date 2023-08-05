const User = require("../../models/user.model");
const { body } = require('express-validator');

const isFieldValueUnique = async (value, field) => {
    const existingUser = await User.findOne({ [field]: value });
    if (existingUser) {
      return Promise.reject(`${field} already exists`);
    }
    return Promise.resolve();
};

// Middleware Express Validator
const validateUserData = [
    body('userName')
      .notEmpty()
      .withMessage('userName is required')
      .custom((value) => isFieldValueUnique(value, 'userName')),
    body('accountNumber')
      .notEmpty()
      .withMessage('accountName is required')
      .custom((value) => isFieldValueUnique(value, 'accountName')),
    body('emailAddress')
      .notEmpty()
      .withMessage('emailAddress is required')
      .isEmail()
      .withMessage('Invalid email address')
      .custom((value) => isFieldValueUnique(value, 'emailAddress')),
    body('identityNumber')
      .notEmpty()
      .withMessage('identityNumber is required')
      .custom((value) => isFieldValueUnique(value, 'identityNumber')),
    body('password').notEmpty().withMessage('password is required'),
];

module.exports = {
    validateUserData
}
