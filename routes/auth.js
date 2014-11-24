var express = require('express');
var debateModel = require('../models/debateModel.js');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var userDB = require('../models/userModel.js');

//LOCAL STRATEGY
passport.use(new LocalStrategy(
	function(username, password, done) {
		userDB.findUser({ username: username,password:password }, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			return done(null, user);
		});
	}
));
//END LOCAL STRATEGY
passport.serializeUser(function(user, done) {
 	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

router.get("/",function(req,res) {
	if(req.session.isUserLoggedIn()) {
		res.redirect("/auth/loged");
	} else {
		res.render("login",{ title:'Login' });
	}
	console.log(req.session);
	console.log(req.user);
});
router.post('/',
	passport.authenticate('local', { 	successRedirect: '/auth/loged',
	                              		failureRedirect: '/auth/',
	                                })//failureFlash: true ver para q sirve
);

router.get("/loged",function(req,res) {
	if(!req.session.isUserLoggedIn()) {
		res.redirect("/auth");
	} else {
		res.render("loged",{ title:'Loged' });
	}
});


module.exports = router;