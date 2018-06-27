import {MqttClientSocket} from "../socket/mqttclientsocket";

let client: MqttClientSocket;
const port: number = 5555;
const ip: string = "localhost";

client = new MqttClientSocket(ip, port, "sdfdsfdsf", {keepalive: 5});

async function aa() {
  await client.connect();
  client.publish("client publish info");
  client.on("close", e => console.log("on close", e.message));
}

aa().then(() => {}, err => console.log(err.stack));
