var express = require('express');
var userController = require('../controllers/user.js');
var aqiController = require('../controllers/aqi.js');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({isSuccess:true,message:'Hi! Welcome to Environment-Health APIs, Start with POST /user, GET /user/:username, POST /updateUser'});
});

router.route('/user')
  .post(userController.postUser);

router.route('/updateUser')
  .post(userController.updateUser);

router.route('/user/:username')
  .get(userController.getUser);


router.route('/getAQI/:username')
  .get(aqiController.getAQI);


module.exports = router;
