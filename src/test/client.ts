import {MqttClientSocket} from "../socket/mqtt-client-socket";

const port: number = 5555;
const ip: string = "localhost";

let client: MqttClientSocket = new MqttClientSocket(ip, port, "sdfdsfdsf", {keepalive: 5});

async function run(): Promise<void> {
  client.on("close", (msg) => console.log("test client: ", msg));
  client.on("publish", (msg) => console.log("test client", msg));
  await client.connect();
  client.publish("sdfsdf", "sddsf");
}

run().then(suc => console.log("finish"), err => console.log(err.stack));

