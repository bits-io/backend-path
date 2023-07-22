const express = require('express');
const { signup, signin, decodeToken } = require('../controllers/userController');
const userRouter = express.Router();

userRouter.post('/signup', signup);

userRouter.post('/signin', signin);
userRouter.post('/decode', decodeToken);

module.exports = userRouter;