import {ServerWaitConnectPacketReq} from "../request/server-wait-connect-packet-req";
import {EventEmitter} from "events";
const mqttCon = require('mqtt-connection');


export class MqttServerSocket extends EventEmitter{
  private keepalive: number;
  private clientId: string;
  private socket_: any;
  private checkChanneltimer: NodeJS.Timer;
  private waitConnectPacket: ServerWaitConnectPacketReq;

  public static error: any = console.log;

  constructor() {
    super();
    this.waitConnectPacket = null;
    this.checkChanneltimer = null;
  }

  async init(socket: any): Promise<void> {
    this.socket_ = mqttCon(socket);

    this.socket_.on("connect", this.onConnect.bind(this));
    this.socket_.on("close", this.onClose.bind(this, new Error("MqttClientSocket close event")));
    this.socket_.on("error", this.onClose.bind(this, new Error("MqttClientSocket error event")));
    this.socket_.on("disconnect", this.onClose.bind(this, new Error("MqttClientSocket disconnect event")));
    //
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
    this.emit(e.message);
    MqttServerSocket.error(e.message)
  }

  private onConnect(packet: any): void {
    if(!this.waitConnectPacket) {
      return;
    }
    let temp: ServerWaitConnectPacketReq = this.waitConnectPacket;
    this.waitConnectPacket = null;
    temp.handleResponse(packet);
  }

  private sendConnack(returnCode: number) {
    this.socket_.connack({returnCode});
  }



}