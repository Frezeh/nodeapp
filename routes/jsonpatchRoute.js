const { Router } = require('express');
const jsonpatch = require('jsonpatch');
const jsonpatchRoute = Router();
const authenticate = require('../authenticate'); // used to authenticate endpoint

/** JSON Patching */
jsonpatchRoute.route('/')
  .post(authenticate.verifyUser, (req, res) => {
    const { user, gender, nationality, age} = req.body;
    try {
      if (!user || !gender || !nationality || !age) {
        res.status(400).json({ msg: 'Please enter all fields' });
      }

      // JSON object
      const JsonObject = {
        'User': `${user}`,
        'Gender': `${gender}`,
        'Nationality': `${nationality}`,
        'Age': `${age}`
      };

      // JSON patch object
      const patch = [
        { 'op': 'add', 'path': '/Religion', 'value': 'Christianity' },
        { 'op': 'remove', 'path': '/Age' },
        { 'op': 'replace', 'path': '/User', 'value': 'John Walker' },
        { 'op': 'test', 'path': '/User', 'value': 'John Walker' }
      ];

      // JSON patch
      const Jsonpatch = jsonpatch.apply_patch(JsonObject, patch);

      res.json({ status: 'Successful', result: Jsonpatch });

    } catch (err) {
      res.json(err);
    }
  });

module.exports = jsonpatchRoute;