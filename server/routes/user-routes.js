const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user-schema');
const UserCtrl = require('../controllers/user-ctrl');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.post('/register', UserCtrl.registerUser)
router.post('/login',passport.authenticate('local', { failureFlash: false}),UserCtrl.loginUser)
router.get('/logout', UserCtrl.logoutUser)
router.route('/account/:id')
    .get(UserCtrl.showCurrentUser)
    .put(UserCtrl.updateUser)
    .delete(UserCtrl.deleteUser)

module.exports = router