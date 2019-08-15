// index.js
// load the things we need
const express = require('express');
const bodyParser  = require('body-parser');
const app = express();
const formidable = require('formidable'); //Form-base file upload handler
const fs = require('fs'); //save file to server

//For login/register
const flash    = require('connect-flash')
const morgan       = require('morgan')
const cookieParser = require('cookie-parser')
const configDB = require('./config/database.js')
const mongoose = require('mongoose')
const passport = require('passport')
var session      = require('express-session');

// ------------------ Global Variables ------------------
const PORT = 40000;


// configure body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// ------------------ MONGOOSE SETUP ------------------

mongoose.connect(configDB.url); // connect to our database

// ------------------ PASSPORT SETUP ------------------

require('./config/passport')(passport); // pass passport for configuration
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// ------------------ EXPRESS SETUP ------------------

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set the view engine to ejs
app.use(express.static(__dirname + "/public")) // public folder




// ------------------ ROUTES SETUP ------------------

require('./controllers/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// ------------------ FINAL SETUP ------------------

app.listen(PORT);
console.log('Server started on port ' + PORT);