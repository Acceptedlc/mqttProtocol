import {MqttClientSocket} from "../socket/mqttclientsocket";

let client: MqttClientSocket;
const port: number = 5555;
const ip: string = "localhost";

client = new MqttClientSocket(ip, port, "sdfdsfdsf", {keepalive: 5});

async function aa() {
  await client.connect();
  console.log("sdfdssdf")
  client.publish("client publish info");
  client.on("close", e => console.log("on close", e.message));
}

aa().then(() => {console.log("finish")}, err => console.log(err.stack));

setImmediate(function() {
  console.log(Object.keys(client.timers));
}, 10000);


process.on('uncaughtException', function(err) {
  console.error('Error caught in uncaughtException event:', err);
});