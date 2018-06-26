import {MqttClientSocket} from "../socket/mqttclientsocket";
import {MqttServerSocket} from "../socket/mqttserversocket";

const net = require('net');

let server: any;
let client: MqttClientSocket;
const port: number = 5555;
const ip: string = "localhost";
describe("ClientSocket", async function() {
  this.timeout(1000 * 100);
  before(async function() {
     server = new net.Server();
     server.on('connection', function (stream) {
       let temp: MqttServerSocket = new MqttServerSocket(stream);
       temp.init();
     });
    server.listen(port)
  });


  it("connect", async function() {
    client = new MqttClientSocket(ip, port, "sdfdsfdsf");
    await client.connect();
  });
});