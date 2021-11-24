var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var hbs=require('express-handlebars')
var fileupload=require('express-fileupload')
var bodyParser=require('body-parser')
var session=require('express-session')

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var db=require('./config/connection')


var app = express();


db.connect((err)=>{
  if(err) console.log('Error'+err)
  else console.log('Server Connected')

})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileupload())
app.use(session({secret:'key',cookie:{maxAge:600000}}))

app.use('/', userRouter);
app.use('/admin', adminRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
