var express = require('express');
var app = express();
var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
// var flash = require('connect-flash');
var session = require('express-session')

var usersCtrl = require('./controllers/usersCtrl');
var gamesCtrl = require('./controllers/gamesCtrl');
var seasonsCtrl = require('./controllers/seasonsCtrl');
var predictionsCtrl = require('./controllers/predictionsCtrl');

var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'whereweregoingwedontneedroads',
  resave: true,
  saveUninitialized: true
}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());

mongoose.connect('mongodb://localhost/tPs');
require('./config/passport')(passport);
var routes = require('./config/routes')
app.use(routes);

app.listen(port, function() {
  console.log('server listening on port %s', port)
});