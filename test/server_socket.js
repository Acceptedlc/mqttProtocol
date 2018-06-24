var net = require('net');
var mqttCon = require('mqtt-connection');
var server = new net.Server();

server.listen({host: 'localhost', port: 1883});


server.on('connection', function (socket) {
    console.log('服务端：收到来自客户端的请求');
    socket.on("data", function(data) {
        console.log(data.readInt8(0).toString(2));
    });

    socket.on('close', function(){
        console.log('服务端：客户端连接断开');
    });

});
