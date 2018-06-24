var net = require('net')
var mqttCon = require('mqtt-connection')
var server = new net.Server()

server.on('connection', function (stream) {
    var client = mqttCon(stream)

    // client connected
    client.on('connect', function (packet) {
        // acknowledge the connect packet
        console.log(JSON.stringify(packet, null, 2));
        client.connack({ returnCode: 0 });
    })

    // client published
    client.on('publish', function (packet) {
        // send a puback with messageId (for QoS > 0)
        client.puback({ messageId: packet.messageId })
    })

    // client pinged
    client.on('pingreq', function () {
        // send a pingresp
        client.pingresp()
    });

    // client subscribed
    client.on('subscribe', function (packet) {
        // send a suback with messageId and granted QoS level
        client.suback({ granted: [packet.qos], messageId: packet.messageId })
    });

    // timeout idle streams after 5 minutes
    stream.setTimeout(1000 * 60 * 5);

    // connection error handling
    client.on('close', function () { client.destroy() })
    client.on('error', function () { client.destroy() })
    client.on('disconnect', function () { client.destroy() })

    // stream timeout
    stream.on('timeout', function () { client.destroy(); })
})

// listen on port 1883
server.listen(1883)