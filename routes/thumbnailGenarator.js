const { Router } = require('express');
const thumbnail = Router();
const path = require('path');
const jwt = require('jsonwebtoken')
const Jimp = require('jimp');

/**
 * Thumbnail Generator route. It accepts Authorization token, JSON Object containing image url.
 * If verified, it resizes the image, and return the thumbnail response.
 * @param req {Object} The request.
 * @param req.body.image {String} The image url.
 * @param req.body {Object} The JSON payload.
 * @return res {image.png} The image body resized to 50x50 pixels.
 */
thumbnail.route('/')
  .post((req, res) => {
    jwt.verify(req.token, process.env.SECRETKEY, async (err) => {
      if (err) {
        res.sendStatus(403);
      } else {

        try {
          const thumbnail = `image_${Date.now()}_50x50.png`;
          const image = await Jimp.read(`${req.body.image}`);
          await image.resize(50, 50);
          await image.writeAsync(thumbnail);
          res.sendFile(path.resolve(thumbnail));
        } catch (err) {
          res.json(err);
        }
      }
    })
  });

module.exports = thumbnail;