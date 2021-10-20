const { Router } = require('express');
const thumbnailRoute = Router();
const path = require('path');
const authenticate = require('../authenticate'); // used to authenticate endpoint
const Jimp = require('jimp'); // used to resize image

/** Image Thumbnail Generation */
thumbnailRoute.route('/')
  .get(authenticate.verifyUser, async (req, res) => {
    try {
      const thumbnail = `thumbnail_${Date.now()}_50x50.png`; // create image name
      const image = await Jimp.read('https://source.unsplash.com/random'); // get random image
      await image.resize(50, 50); // resize image
      await image.writeAsync(thumbnail); // save image
      res.sendFile(path.resolve(thumbnail)); // return resulting thumbnail      

    } catch (err) {
      res.json(err);
    }
  });

module.exports = thumbnailRoute;