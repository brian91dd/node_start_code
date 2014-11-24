var debateSocket = {};

module.exports = function(io,app) {
	function listenVotos(socket) {
		socket.on('votar_debate',function(data) {
			console.log("La accion se ha realizado con exito");
			//console.log(socket.request.session);
		})
	}
	return listenVotos;
}