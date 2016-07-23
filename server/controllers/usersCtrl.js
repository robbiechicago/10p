var User = require('../models/userMod');
var bodyParser = require('body-parser');
var passport = require('passport');



//USER STATUS
function getUserStatus(req, res) {
  if (req.user) {
    console.log(req.user)
    return res.status(200).json({
      logged_in: false
    })
  }
  res.status(200).json({
    logged_in: false
  })
}

//INDEX
function getAllUsers(req, res) {
  User.find(function (err, users) {
    if(err) res.json({ message: 'Could not find any users. ' + err });

    res.json({ users: users });
  })
}

// POST /login 
function loginUser(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    console.log(req.session)
    console.log(info)
    console.log(user)
    if (err) { return next(err); }
//POTENTIALLY RETURN A JWT HERE...
    if (user) { 
      return res.status(200).json({ 
        user: user, 
        logged_in: true, 
        message: 'successfully logged in'
      }); 
    } 
    return res.status(200).json({ 
        user: false, 
        logged_in: false, 
        message: info
      }); 
  })(req, res, next);
}

//NEW

// CREATE
function createUser(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    console.log(info)
    if (err) { return next(err); }
    if (user) { return res.status(200).json({ message: 'New user successfully added'}); }
  })(req, res, next);
}


//SHOW
function getUserById(req, res) {
  var id = req.params.id;
  User.findById({ _id: id }, function(err, user) {
    if(err) res.json({ message: 'Could not find user. ' + err });

    res.json({ user: user })
  })
}

//EDIT

//UPDATE
function updateUser(req, res) {
  var id = req.params.id;
  User.findById({ _id: id }, function(err, user) {
    if(err) res.json({ message: 'Could not find user. ' + err });

    if(req.body.username) user.username = req.body.username;
    if(req.body.password) user.password = req.body.password;

    user.save(function(err) {
      if(err) res.json({ message: 'Could not update user. ' + err });
      console.log(user);
      res.json({ message: 'User successfully updated' })
    })
  })
}

//DELETE
function removeUser(req, res) {
  var id = req.params.id;
  User.remove({ _id: id }, function(err) {
    if(err) res.json({ message: 'Could not delete user. ' + err });

    res.json({ message: 'User successfully deleted' })
  })
}

//EXPORT
module.exports = {
  getUserStatus: getUserStatus,
  getAllUsers: getAllUsers,
  loginUser: loginUser,
  createUser: createUser, 
  getUserById: getUserById,
  updateUser: updateUser,
  removeUser: removeUser
}