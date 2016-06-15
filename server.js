var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var dotEnv = require('dotenv').config();
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy
var session = require('express-session');
var app = express();
var checkinRouter = require('./server/routes/api/checkins');
var usersRouter = require('./server/routes/api/users');
var indexRouter = require('./server/routes/index');

mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/gotNext");

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'client/views'));
app.use(express.static('client/'));


var passportFacebook = require('./server/lib/passportStrategy.js');

app.use(session({secret: 'tacostacos', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/checkins', checkinRouter);

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log('loaded on port '+port);
})
