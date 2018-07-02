import * as net from "net";
import {ClientConnectReq} from "../request/client-connect-req";

const mqttCon = require('mqtt-connection');

export class MqttClientSocket {
  /**
   * @param {string} ip
   * @param {number} port
   * @param {string} clientId
   * @param {MqttClientSocketOptions} opts
   *  keepalive 链接保持时间也是connect超时的时间
   */
  constructor(ip: string, port: number, clientId: string, opts: MqttClientSocketOptions = {keepalive: 30}) {
    this.ip = ip;
    this.port = port;
    this.clientId = clientId;
    this.opts = opts;
    this.opts.keepalive = this.opts.keepalive * 1000;
    this.connectReq = null;
  }

  /**
   * 与mqtt server 建立链接
   * @returns {Promise<void>}
   */
  async connect(): Promise<void> {
    let stream = net.createConnection(this.port, this.ip);
    this.socket_ = mqttCon(stream);

    this.connectReq = new ClientConnectReq(this.clientId, this.opts.keepalive, this.opts.keepalive);
    await new Promise<any>((suc, fail) => {
      this.connectReq.connect(this.socket_, (err, data) => {
        if(err) {
          fail(err)
        } else {
          suc(data);
        }
      });
    });

    this.socket_.on("connack", this.onConnack.bind(this));
  }

  private readonly ip: string;
  private readonly port: number;
  private readonly clientId: string;
  private readonly opts: MqttClientSocketOptions;
  private connectReq: ClientConnectReq;
  private socket_: any;

  private onConnack(packet: any) {
    if(!this.connectReq) {
      return;
    }
    this.connectReq.handleResponse(packet);
    this.connectReq = null;
  }

}

export interface MqttClientSocketOptions {
  keepalive: number; //default 30s
}