module.exports = function (app) {
	/***********************************************
	* CREACION DE FUNCIONES UTILIZADAS EN EL REQUEST
	* Login por ejemplo
	***********************************************/
	app.use(function(req, res, next) {
		req.session.isUserLoggedIn = function() {
			if(typeof req.user !== 'undefined') {
				return true;
			} else {
				return false;
			}
		}
		next();
	});

	//ROUTES
	var routes = require('./routes/index');
	var users = require('./routes/users');
	var debate = require('./routes/debate');
	var auth = require('./routes/auth');
	//END ROUTES

	app.use('/', routes);
	app.use('/users', users);
	app.use('/debate', debate);
	app.use('/auth', auth); // handlers para passport, pantalla de login

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
}