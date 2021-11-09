const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const index = require('./routes/index');
const login = require('./routes/login');
const jsonpatch = require('./routes/jsonpatch');
const thumbnail = require('./routes/thumbnailGenarator');
const verifyToken = require('./verifyToken');
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.listen(PORT, () => console.log(`Server Running at: http://localhost:${PORT}`));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* Homepage of API */
app.use('/api', index);

/* Public login endpoint  */
app.use('/api/login', login);

/* Protected JSONpatch endpoint  */
app.use('/api/jsonpatch', verifyToken, jsonpatch);

/* Protected Thumbnail Generator endpoint  */
app.use('/api/thumbnail', verifyToken, thumbnail);

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