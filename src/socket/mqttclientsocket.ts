import {MqttBaseSocket} from "./mqttbasesocket";
import * as net from "net";

const mqttCon = require('mqtt-connection');

export class MqttClientSocket extends MqttBaseSocket{
  constructor(ip: string, port: number, clientId: string, opts: MqttClientSocketOptions = {keepalive: 30}) {
    super();
    this.ip = ip;
    this.port = port;
    this.clientId = clientId;
    this.opts = opts;
  }

  async connect(): Promise<void> {
    let stream = net.createConnection(this.port, this.ip);
    this.socket_ = mqttCon(stream);
    this.socket_.connect({
      clientId: this.clientId,
      keepalive: this.opts.keepalive
    });
    let connectSuc: any;
    let connectFail: any;
    let waiter: Promise<void> = new Promise((suc, fail) => {
      connectSuc = suc;
      connectFail = fail;
    });

    let timeoutId: NodeJS.Timer = setTimeout(
      () => connectFail(new Error(`mqttClientSocket connect timeout: ip=${this.ip}, port=${this.port}`)),
      this.opts.keepalive
    );

    this.socket_.on("connack", function(packet: any) {
      clearTimeout(timeoutId);
      connectSuc();
    });

    await waiter;
  }

  private readonly ip: string;
  private readonly port: number;
  private readonly opts: MqttClientSocketOptions;
  private readonly clientId: string;
}

export interface MqttClientSocketOptions {
  keepalive: number; //default 30s
}