/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  http = require('http'),
  path = require('path');
var fs = require('fs');
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var mongoose = require('mongoose');
var dbPath = 'mongodb://localhost/nodebackbone';
var config = {
  mail: require('./config/mail')
};
// var Account = require('./models/Account')(config, mongoose, nodemailer);
var models = {
  Account: require('./models/Account')(config, mongoose, nodemailer)
};
var app = express();
app.sessionStore = new MemoryStore();


app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "SocialNet secret key",
    key: 'express.sid',
    store: app.sessionStore
  }));
  // mongoose.connect('mongodb://localhost/nodebackbone');
  mongoose.connect(dbPath, function onMongooseError(err) {
    if (err) throw err;
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.limit('1mb'));
});


app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  res.render('index.jade');
});
// app.get('/', routes.index);
// app.get('/users', user.list);

fs.readdirSync('routes').forEach(function(file) {
  if ( file[0] == '.' ) return;
  var routeName = file.substr(0, file.indexOf('.'));
  require('./routes/' + routeName)( app, models);
});

app.post('/contacts/find', function(req, res) {
  var searchStr = req.param('searchStr', null);
  if (null == searchStr) {
    res.send(400);
    return;
  }
  models.Account.findByString(searchStr, function onSearchDone(err, accounts) {
    if (err || accounts.length == 0) {
      res.send(404);
    } else {
      res.send(accounts);
    }
  });
});

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});