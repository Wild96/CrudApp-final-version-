var express = require('express');
var router = express.Router();
var auth = require("../controllers/AuthController.js");

// restrict index for logged in user only
//router.get('/', auth.home);
router.get('/', ensureAuthenticated, auth.home);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('request is authenticated');
        return next();
    } else {
        console.log('req is not authenticated');
        res.render('../views/new');
    }
}
// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

module.exports = router;
