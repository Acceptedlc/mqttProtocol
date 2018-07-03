import {ServerWaitConnectPacketReq} from "../request/server-wait-connect-packet-req";
import {EventEmitter} from "events";
const mqttCon = require('mqtt-connection');


export class MqttServerSocket extends EventEmitter{
  private keepalive: number;
  private clientId: string;
  private socket_: any;
  private checkChanneltimer: NodeJS.Timer;
  private waitConnectPacket: ServerWaitConnectPacketReq;
  private communicationTimestamp: number;

  public static error: any = console.log;

  constructor() {
    super();
    this.waitConnectPacket = null;
    this.checkChanneltimer = null;
  }

  async init(socket: any): Promise<void> {
    this.socket_ = mqttCon(socket);

    this.socket_.on("connect", this.onConnect.bind(this));
    this.socket_.on("pingreq", this.onPing.bind(this));
    this.socket_.on("close", this.onClose.bind(this, new Error("MqttClientSocket close event")));
    this.socket_.on("error", this.onClose.bind(this, new Error("MqttClientSocket error event")));
    this.socket_.on("disconnect", this.onClose.bind(this, new Error("MqttClientSocket disconnect event")));

    this.waitConnectPacket = new ServerWaitConnectPacketReq(5 * 1000);
    let packet: any = await new Promise((suc, fail) => {
      this.waitConnectPacket.wait((err, packet) => {
        if(err) {
          fail(err);
        } else {
          suc(packet);
        }
      });
    });
    this.keepalive = packet.keepalive;
    this.clientId = packet.clientId;
    this.sendConnack(0);
    this.communicationTimestamp = Date.now();
    this.checkChanneltimer = setInterval(() => this.checkTimeout(), this.keepalive * 1.5);
  }

  public close(): void {
    this.socket_.destroy();
    if(this.waitConnectPacket) {
      this.waitConnectPacket.cancle();
    }
    if(this.checkChanneltimer) {
      clearInterval(this.checkChanneltimer);
    }
  }

  private onClose(e: Error) {
    this.close();
    this.emit("close", e.message);
  }

  private onConnect(packet: any): void {
    if(!this.waitConnectPacket) {
      return;
    }
    let temp: ServerWaitConnectPacketReq = this.waitConnectPacket;
    this.waitConnectPacket = null;
    temp.handleResponse(packet);
  }

  private onPing(packet: any): void {
    this.communicationTimestamp = Date.now();
    this.socket_.pingresp();
  }

  private sendConnack(returnCode: number) {
    this.socket_.connack({returnCode});
  }

  private checkTimeout() {
    console.log(Date.now() - this.communicationTimestamp , this.keepalive);
    if(Date.now() - this.communicationTimestamp > this.keepalive) {
      this.onClose(new Error("MqttServerSocket wait ping timeout"));
    }
  }

}