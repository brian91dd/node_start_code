module.exports = function(io,app) {

	var debateSock = require("./debateSock.js")(io,app);

	io.on("connection", function(socket) {
		//console.log("nuevo usuario");
		//console.log(socket.request.session);
		socket.on("getModule",function(data) {
			if(data.module.indexOf('tweet') >= 0) {
				socket.emit('tweet',lastTweet);
				socket.join('tweet');
			}
			if(data.module.indexOf('debate') >= 0) {
				socket.join('debate' + data.idDebate);
				listenVotos(socket);
			}
		});
	});
}
