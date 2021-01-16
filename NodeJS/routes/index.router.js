const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

router.post('/register', userController.register);
router.post('/authenticate', userController.authenticate); //local 
router.post('/authenticate', userController.googleAuthenticate); //sign up using google 
router.get('/userProfile',jwtHelper.verifyJwtToken, userController.userProfile); //private router to prevent jwt

module.exports = router;



