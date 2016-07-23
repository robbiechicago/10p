var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var User = mongoose.Schema({
  local:{
    username: {type: String, required: true},
    password: {type: String, required: true}, 
    is_admin: {type: Number, required: true, min: 0, max: 1},
    status: {type: Number, required: true, min: 0, max: 1}
  }
})

User.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', User);