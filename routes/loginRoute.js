const { Router } = require('express');
const loginRoute = Router();
const authenticate = require('../authenticate');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const passport = require('passport'); //used to authenticate users

/** Login User */
loginRoute.route('/')
  .post((req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findOne({ username })
      .then(user => {
        if (!user) { // user does not exist
          const newUser = new User({ username: username, password }); //create user

          // Create salt and hash
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  passport.authenticate('local', (req, res) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                  });
                  req.logIn(user, (err) => {
                    if (err) {
                      res.statusCode = 401;
                      res.setHeader('Content-Type', 'application/json');
                      res.json({ success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!' });
                    }

                    const token = authenticate.getToken({ _id: req.user._id });
                    const userId = req.user._id;
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, status: 'Login Successful!', token: token, id: userId });
                  });
                });
            });
          });
        } 
        else if (user) { // user exist
          // Validate password
          bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

              passport.authenticate('local', (req, res) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
              });
              req.logIn(user, (err) => {
                if (err) {
                  res.statusCode = 401;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!' });
                }

                const token = authenticate.getToken({ _id: req.user._id });
                const userId = req.user._id;
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, status: 'Login Successful!', token: token, id: userId });
              });
            });
        }
      });
  });

module.exports = loginRoute;