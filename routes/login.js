var express = require('express');
var debateModel = require('../models/debateModel.js');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var userDB = require('../models/userModel.js');
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
passport.serializeUser(function(user, done) {
 	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

router.get("/",function(req,res) {
	res.render("login",{ title:'Login' });
});

router.get("/loged",function(req,res) {
	res.render("loged",{ title:'Loged' });
});

router.post('/auth',
	passport.authenticate('local', { 	successRedirect: '/login/loged',
	                              		failureRedirect: '/login/',
	                                })//failureFlash: true ver para q sirve
);

module.exports = router;