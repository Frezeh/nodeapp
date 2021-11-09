const { Router } = require('express');
const login = Router();
const User = require('../models/users');
const jwt = require('jsonwebtoken')

/**
 * Login route. It authenticates the user and returns a signed jwt token
 * @param req {Object} The request.
 * @param req.body.userName {String} The username.
 * @param req.body.password {String} The Password.
 * @param req.body {Object} The JSON payload.
 * @return res {Object} The response containing JWT.
 */

login.route('/')
  .post((req, res, next) => {
    if (!req.is('application/json')) {
      res.status(422).send({
        errorMsg: 'Unprocessable entity',
      });
    } else if ('username' in req.body && 'password' in req.body) {
      const user = User.find(
        (el) => (el.userName === req.body.userName && el.password === req.body.password),
      );
      if (user === undefined) {
        res.status(404).send({
          errorMsg: 'User not found.',
        });
      } else {
        jwt.sign({ user }, process.env.SECRETKEY, { expiresIn: 3600 }, (err, token) => {
          let userId = user._id;
          res.json({
            token: token, id: userId,
          });
        });
      }
    } else {
      res.status(400).send({
        errorMsg: 'Invalid input type',
      });
    }
  });

module.exports = login;