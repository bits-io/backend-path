const { signinController } = require('../controllers/auth.controller');

const router = require('express').Router();


router.post('/register', signinController)


module.exports = router