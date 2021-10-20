const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); 
const indexRouter = require('./routes/index');
const loginRoute = require('./routes/loginRoute');
const jsonpatchRoute = require('./routes/jsonpatchRoute');
const thumbnailRoute = require('./routes/thumbnailRoute');
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running at: http://localhost:${PORT}`)))
  .catch((error) =>  console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

// endpoints
app.use('/', indexRouter);
app.use('/login', loginRoute);
app.use('/jsonpatch', jsonpatchRoute);
app.use('/thumbnail', thumbnailRoute);

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