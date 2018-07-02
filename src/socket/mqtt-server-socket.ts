import {ServerWaitConnectPacketReq} from "../request/server-wait-connect-packet-req";

const mqttCon = require('mqtt-connection');


export class MqttServerSocket {
  private readonly keepalive: number;
  private socket_: any;
  private timer: NodeJS.Timer;
  private waitConnectPacket: ServerWaitConnectPacketReq;

  constructor() {
    this.waitConnectPacket = null;
    this.timer = null;
  }

  async init(socket: any): Promise<void> {
    this.socket_ = mqttCon(socket);
    this.waitConnectPacket = new ServerWaitConnectPacketReq(5 * 1000);
    await new Promise((suc, fail) => {
      this.waitConnectPacket.wait((err, __) => {
        if(err) {
          fail(err);
        } else {
          suc();
        }
      });
    });


  }

  private onConnect(packet: any): void {
    if(!this.waitConnectPacket) {
      return;
    }
    this.waitConnectPacket.handleResponse(packet);
  }

}