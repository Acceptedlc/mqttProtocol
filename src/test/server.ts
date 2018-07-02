const net = require('net');
const port: number = 5555;
const ip: string = "localhost";

let server = new net.Server();

server.on('connection', async function (stream) {
  stream.on('data', (data) => console.log(data));
});

server.listen(port);
console.log("start at", port);

// import {MqttServerSocket} from "../socket/mqttserversocket";
//
// const net = require('net');
// const port: number = 5555;
// const ip: string = "localhost";
//
// let server = new net.Server();
// server.on('connection', async function (stream) {
//
//
//
//   let temp: MqttServerSocket = new MqttServerSocket();
//   await temp.init(stream);
//   temp.on("publish",(topic: string, payload: string) => {
//     console.log(payload);
//   });
//   temp.on("close", e => console.log("on close", e.message));
// });
// server.listen(port);
// console.log("start at", port);