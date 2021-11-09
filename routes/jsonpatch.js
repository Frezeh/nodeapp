const { Router } = require('express');
const JSONpatch = Router();
const jwt = require('jsonwebtoken')
const applyPatch = require('fast-json-patch');

/**
 * JSON Patch route. It accepts Authorization token, JSON Object and a JSON Patch Object.
 * If verified, it applies the JSON patch to the JSON object, and return the resulting JSON object.
 * @param req {Object} The request.
 * @param req.body.jsonBody {String} The jsonBody.
 * @param req.body.jsonPatch {String} The jsonPatch.
 * @param req.body {Object} The JSON payload.
 * @return res {Object} The resulting JSON object.
 */

JSONpatch.route('/')
  .post((req, res) => {
    jwt.verify(req.token, process.env.SECRETKEY, (err) => {
      if (err) {
        res.sendStatus(403);
      } else if (!req.is('application/json')) {
        res.status(422).send({
          errorMsg: 'Unable to process',
        });
      } else if ('jsonBody' in req.body && 'jsonPatch' in req.body) {
        try {
          const { jsonBody } = req.body;
          const { jsonPatch } = req.body;
          const response = applyPatch.applyPatch(jsonBody, jsonPatch).newDocument;
          res.send(response);
        } catch (error) {
          res.status(422).send({
            errorMsg: 'Invalid JSON formats',
          });
        }
      } else {
        res.status(400).send({
          errorMsg: 'Invalid input type',
        });
      }
    });
  });

module.exports = JSONpatch;