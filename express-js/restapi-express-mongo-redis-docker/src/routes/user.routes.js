const router = require('express').Router();
const {
  getUser, updateUser, getUsersList, deleteUserById, addUser, getUserByAccountNumber, getUserByIdentityNumber
} = require('../controllers/user.controllers');
const { isAuthenticatedUser, isAdmin, isBlocked } = require('../middleware/app.authentication');
const { validateUserData } = require('../middleware/valdation/user.validation');

// get user info route
router.route('/user/account/:number').get(isAuthenticatedUser, isBlocked, getUserByAccountNumber);
router.route('/user/identity/:number').get(isAuthenticatedUser, isBlocked, getUserByIdentityNumber);

// update user info route
router.route('/user/:id').put(isAuthenticatedUser, isBlocked, updateUser);

// add user info route
router.route('/user').post(isAuthenticatedUser, isBlocked, validateUserData, addUser);

// delete user route
router.route('/user/:id').delete(isAuthenticatedUser, isBlocked, deleteUserById);

// get all users list for admin
router.route('/user').get(isAuthenticatedUser, isBlocked, getUsersList);

module.exports = router;
