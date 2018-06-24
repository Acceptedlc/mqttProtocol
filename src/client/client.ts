import * as net from "net";
var mqttCon = require('mqtt-connection');

export interface ClientOptions {
  keepAlive?: number;
}


export class Client {
  ipAddr: string;
  port: number;
  clientIdentifier: string;
  keepAlive: number;
  socket: any;

  constructor(ipAddr: string, port: number, clientIdentifier: string, opts: ClientOptions = {}) {
    this.ipAddr = ipAddr;
    this.port = port;
    this.clientIdentifier = clientIdentifier;
    this.keepAlive = opts.keepAlive || 30 * 1000;
  }

  async connect(): Promise<void> {
    if(this.socket) {
      throw new Error("socket already exist");
    }
    var stream = net.createConnection(this.port, this.ipAddr);
    this.socket = mqttCon(stream);
  }
}