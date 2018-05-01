/*
var express = require('express');
var router = express.Router();

/* GET users listing. *
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
//new
var express = require('express');
var router = express.Router();
*/
var express = require('express');
//Mongoose model linkage 
var chat = require('../models/chat');
var cookieparser = require ('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var router = express.Router();
var users = [];
var connections = [];
//socket code
//this is the server.js file
/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.io.emit("socketToMe", "users");
  res.send('responded with a  socekt resource');
 // console.log('printing session id on socket.io');
 // console.log(req.session.id);
  res.sendFile(__dirname + '/empindex.ejs');
  /*auth code*
  res.io.set('authorization', function (handshake, callback) {
    if (handshake.headers.cookie) {
      // pass a req, res, and next as if it were middleware
      cookieparser(handshake, null, function (err) {
      
        // or if you don't have signed cookies
        handshake.sessionID = handshake.cookie['connect.sid'];

        MongoStore.get(handshake.sessionID, function (err, session) {
          if (err || !session) {
            // if we cannot grab a session, turn down the connection
            callback('Session not found.', false);
          } else {
            // save the session data and accept the connection
            handshake.session = session;
            callback(null, true);
          }
        });
      });
    } else {
      return callback('No session.', false);
    }
    callback(null, true);
  });
  */
  res.io.sockets.on('connection', function (socket) {
    //connect function 
    var session = socket.handshake.session;
    socket.handshake.session.save();
    console.log('====================================================================');
  /*
    console.log('sessions are shared');
    console.log('session id obtained from express sessions');
   console.log(session.id);
  
    console.log('user name from express session:');
    console.log(session.passport.user);
    */
    console.log('====================================================================');
    connections.push(socket);
    console.log('Connected:%s sockets connected', connections.length);
    /*reference */
    var newItem = session.passport.user;
    /*
    console.log('checking user presence');*/
    //not printign username moe thna once
    users.indexOf(newItem) === -1 ? users.push(newItem) : console.log("This item already exists");
    /*console.log(users);*/
    //printing user array elements
   // console.log('Printing all the array elements of user array');
   /*
   for (i = 0; i < users.length; i++) {
      console.log(i + ". " + users[i]);
    }
    */
    //res.io will only work
    updateUsernames();
    



    //disconnect 
    socket.on('disconnect', function (data) {
      if(!socket.handshake.session.passport.user) return;
      //removing username if he closes tab before
      //splice removes the username
      users.splice(users.indexOf(socket.username), 1);
      
        updateUsernames();
      connections.splice(connections.indexOf(socket), 1);
      console.log('Disconnected:%s sockets connected', connections.length)
    });
  //  console.log('chat.find is called');
    chat.find({ user: session.passport.user }, function (err, data) {
      // chat.findOne({user:"sai"}).exec( function (err, data) {
      if (err) {
        throw err;
      }
      else {
        for (var x = 0; x < data.length; x++) {
          // console.log('===================================');
         /*
          console.log('data retreived from db');
          console.log(data[x]);
          console.log(data[x].msg);
          console.log(data[x].user);
          /*
           console.log('printiing usernames from socket connection');
           console.log(socket.username);
           
          console.log('x vlaue:');
          console.log(x);
          */
          res.io.emit('new message', { msg: data[x].msg, user: data[x].user }
          /*{ msg: data, user: socket.username }*/);
        }
      }
    });//end of chat find
    //Send message
    socket.on('send message', function (data) {
      //plural sockets.emit --broadcasting 
      // sending msg to all -- msg =data
      //printing sent message in terminal
      var session = socket.handshake.session;
    //  console.log('user name from express session:(send message fucntion)');
    //  console.log(session.passport.user);
    //  console.log('message typed by the user');
    //  console.log(data);
      // users.push(session.passport.user)
      //putting usernames into a users array
      //console.log('printing users array');
      //update the username
      // console.log('calling update usernames in send message function');
      /*reference */
      var newItem = session.passport.user;
    //  console.log('checking user presence');
      //not printign username moe thna once
      users.indexOf(newItem) === -1 ? users.push(newItem) : console.log("This item already exists");
    //  console.log(users);
      //printing user array elements
      /*
      console.log('Printing all the array elements of user array');
      for(i=0;i<users.length;i++){
        console.log(i + ". " + users[i]);
      }
      */
      //res.io will only work
      updateUsernames();
      
    //  console.log('chat.create is called');
      chat.create({ msg: data, user: session.passport.user  }, function () {
    // console.log('messages are inserted');
      res.io.emit('new message', { msg: data, user:session.passport.user });
      });//chat.create
    });
    //adding new user
    //New user code
    /*commented code
    socket.on('new user', function (data, callback) {
    
     // socket.handshake.session.data = data;
      var session = socket.handshake.session;
      console.log('user name from express session:(new user function)');
      console.log(session.passport.user);

      callback(true);
      //end of commented code
      //assigning the username create to var username
      //socket.username = data;
      /*push the username into users array*/
      /*
      //commented code
      users.push(socket.handshake.session.username);
      
      //push the username into users array
      //users.push(socket.username);
      users.push(session.passport.user)
      //update the usernames
      updateUsernames();
    });
    */
    function updateUsernames() {
    //  console.log('update usernames called in server')
    //  console.log(users);
      res.io.emit('get users', users);
    }


  });//end of connect function 


});

module.exports = router;

