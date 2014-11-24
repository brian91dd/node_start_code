var mongodb = require('mongodb');
var Db = mongodb.Db;
var Server = mongodb.Server;

var dbPort = 27017;
var dbHost = 'localhost';
var dbName = 'malditoapps';

var Database = {};

//Conexion a la base de datos
Database.db = new Db(dbName,new Server(dbHost,dbPort,{autorecontect:true,safe:false},{}));

//Abrimos la conexion
Database.db.open(function(err,data) {
	if(err) {
		console.log(err);
	} else {
		console.log("Conectado a la base de datos correctamente debate");
	}
});

Database.debate = Database.db.collection('debate');

module.exports = Database;

Database.setDebate = function(pregunta,opciones,callback) {
	var debate = {};

	debate.denominacion = pregunta;
	debate.opciones = Array();
	for (var i = 0; i < opciones.length; i++) {
		debate.opciones[i] = {};
		debate.opciones[i]['opcion'] = opciones[i];
		debate.opciones[i]['votos'] = 0;
	}
	Database.debate.insert(debate,function(err,data) {
		callback(true);
	});
}

Database.votar = function(idPregunta,opcion,callback) {
	Database.debate.update({_id:new mongodb.ObjectID(idPregunta),"opciones.opcion":opcion},{$inc:{"opciones.$.votos":1}},{upsert:true,safe:false},function() {
		callback(true);
	})
}

Database.getPregunta = function(idPregunta,callback) {
	Database.debate.findOne({_id:new mongodb.ObjectID(idPregunta)},function(err,data) {
		callback(err,data);
	});
}