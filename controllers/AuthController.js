var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  user = req.body.username;
  password = req.body.password;

  req.session.nome = "Username";
  res.render('index', { user : req.user });
};

// Go to registration page
userController.register = function(req, res) {
  res.render('register');
};

// Post registration
userController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register', { user : user });
    }

    passport.authenticate('local')(req, res, function () {
     /*
      console.log('====================================================================');
      console.log('username of the current user');
      console.log(user);
   
      console.log("User id:");
      console.log(req.session.id);
      
      console.log('====================================================================');
      */
      res.redirect('/login');
    });
  });
};

// Go to login page
userController.login = function(req, res) {
  res.render('login');
};

// Post login
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    user = req.body.username;
    password = req.body.password;
    sess =req.session
  /*
    console.log('username of the current user');
    console.log(user);
    console.log('Session id post login:');
    console.log(req.session.id);
    console.log(req.session);
    */
    //if(user){
   // res.render("../views/check");
    res.render("../views/reference");
   // }
    //if(!user){
   // res.render("../views/test");

    //}
  });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;
