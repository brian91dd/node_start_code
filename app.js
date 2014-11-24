var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport')

//ROUTES
var routes = require('./routes/index');
var users = require('./routes/users');
var debate = require('./routes/debate');
var auth = require('./routes/auth');
//END ROUTES




var app = express();
// CONFIGURACION
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//CONFIGURACION DE SESSION
var sessionMiddleware = session({
	store: new MongoStore({
		url: 'mongodb://root@localhost:27017/sess'
	}),
	secret: '1234567890QWERTY',
	resave: true,
	saveUninitialized: true
});
app.use(sessionMiddleware);

app.use(passport.initialize()); // Estos dos deben estar luego de setear el middleware de session sino no lo carga en req.session.passport
app.use(passport.session());
app.use(function(req, res, next) {
	console.log("acaa");
	req.session.isUserLoggedIn = function() {
		if(typeof req.user !== 'undefined') {
			return true;
		} else {
			return false;
		}
	}
	next();
});
//END CONFIGURACION DE SESSION
// END CONFIGURACION

//ROUTES WITHOUT IO
app.use('/', routes);
app.use('/users', users);
app.use('/debate', debate);
app.use('/auth', auth); // handlers para passport, pantalla de login
//END ROUTES WITHOUT IO

//START SERVER
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

io = io.listen(server);
io.use(function(socket, next) {
	sessionMiddleware(socket.request, socket.request.res, next);
});
//END START SERVER
/*Despues de hacer el startserver puedo manejar el envio con sockets, hay peticiones por get o post que necesitan envio a travez de sockets*/

require('./socketsApp/connectionSock.js')(io,app);

// CATCH DE 404
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// ERROR HANDLERS
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});
// END ERROR HANDLERS
