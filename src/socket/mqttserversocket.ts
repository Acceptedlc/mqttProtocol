import {MqttBaseSocket} from "./mqttbasesocket";
const mqttCon = require('mqtt-connection');

export class MqttServerSocket extends MqttBaseSocket{
  constructor(socket: any) {
    super();
    this.socket_ = mqttCon(socket);
  }

  init() {
    this.socket_.on("connect", this.onConnect.bind(this));
  }

  private onConnect(): void {
    this.socket_.connack({returnCode: 0});
  }

}



