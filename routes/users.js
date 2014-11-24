var express = require('express');
var debateModel = require('../models/debateModel.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
