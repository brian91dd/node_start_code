var express = require('express');
var debateModel = require('../models/debateModel.js');
var router = express.Router();

router.get('/', function(req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	debateModel.getPregunta(req.query.idPregunta,function(err,data) {
		console.log(data);
		res.render("debate",{ state: 'exist',pregunta:data });
	});
});
router.post('/votar_debate',function(req,res,next) {
	if(typeof req.session.voted === 'undefined' || !req.session.voted ) {
		req.session.voted = 1;
		debateModel.votar(req.body.id,req.body.opcion,function(err,data) {
			next();
		});
	} else {
		res.json({"voted":false});
	}
});

module.exports = router;