var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
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

/***********************************
* CONFIGURACION DEL STORE DE SESSION
************************************/
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

/**************
* LISTEN SERVER
***************/
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


/***************
* LISTEN SOCKETS
****************/
io = io.listen(server);
io.use(function(socket, next) {
	sessionMiddleware(socket.request, socket.request.res, next);
});



/********************
* ROUTERS CON SOCKETS
*********************/
require('./socketsApp/connectionSock.js')(io,app);
/********************
* ROUTERS SIN SOCKETS
*********************/
require('./routes.js')(app);


