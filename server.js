var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url); 

require('./config/passport')(passport); 

app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(bodyParser()); 

app.set('view engine', 'ejs'); 

app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 
app.enable("trust proxy");

require('./app/routes.js')(app, passport); 
app.use(express.static('public'))

app.listen(port);
console.log('The magic happens on port ' + port);
