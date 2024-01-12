const express = require('express')

const router = express.Router()

const {signup,login,changepassword,resetpassword,forgotpassword,deactivateAccount} = require('../controllers/OwnerController')




// Route

router.post('/signup',signup)

router.post('/login',login)




router.post('/changepassword',changepassword)

router.post('/reset-password/:token',resetpassword)

router.post('/forgot-password',forgotpassword)

router.post('/deactivate-account',deactivateAccount)

module.exports = router