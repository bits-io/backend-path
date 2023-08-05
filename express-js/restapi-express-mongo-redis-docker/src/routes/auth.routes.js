const router = require('express').Router();
const logLimiter = require('../middleware/log.limiter');
const { isAuthenticatedUser, isRefreshTokenValid, isBlocked } = require('../middleware/app.authentication');
const {
  register, loginUser, logoutUser, refreshToken
} = require('../controllers/auth.controllers');
const { validateUserData } = require('../middleware/valdation/user.validation');

// routes for register, login and logout user
router.route('/auth/registration').post(validateUserData,register);
router.route('/auth/login').post(logLimiter, loginUser);
router.route('/auth/logout').post(isAuthenticatedUser, isBlocked, logoutUser);

// route for get user refresh JWT Token
router.route('/auth/refresh-token').get(isRefreshTokenValid, refreshToken);

module.exports = router;
