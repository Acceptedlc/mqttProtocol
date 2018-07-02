const net = require("net");
const mqttCon = require('mqtt-connection');

var stream = net.createConnection(5555, "localhost");
var aaaa = mqttCon(stream);