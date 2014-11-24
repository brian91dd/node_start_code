var mongoose = require('mongoose');

var dbPort = 27017;
var dbHost = 'localhost';
var dbName = 'malditoapps';

mongoose.connect('mongodb://' + dbHost + '/' + dbName);

var Database = {};
var userSchema = mongoose.Schema({
	username : String,
	password : String
});
//Conexion a la base de datos
Database.db = mongoose.connection;

//Abrimos la conexion
Database.db.on('error', console.error.bind(console, 'connection error:'));
Database.db.once('open', function callback () {
	console.log("Database opened");
});

Database.user = Database.db.collection('user');

module.exports = Database;
//Inserto usuario de prueba
Database.user.findOne({username:'brian'},function(err,data) {
	if(!err && data) {
		console.log("Ya esta creado");
	} else {
		if(!err) {
			Database.user.insert({username:"brian",password:'123456'},function(err,data) {
			});
		}
	}
})


Database.findUser = function(data,callback) {
	Database.user.findOne({username:data.username},function(err,dataUser){
		callback(err,data);
	})
}
