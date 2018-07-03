import * as net from "net";
import {ClientConnectReq} from "../request/client-connect-req";
import {EventEmitter} from "events";
import {ClientPingReq} from "../request/client-ping-req";

const mqttCon = require('mqtt-connection');

export class MqttClientSocket extends EventEmitter {
  private readonly ip: string;
  private readonly port: number;
  private readonly clientId: string;
  private readonly opts: MqttClientSocketOptions;
  private connectReq: ClientConnectReq;
  private pingReq: ClientPingReq;
  private socket_: any;
  private pingTimmer: NodeJS.Timer;

  public static error: any = console.log;

  /**
   * @param {string} ip
   * @param {number} port
   * @param {string} clientId
   * @param {MqttClientSocketOptions} opts
   *  keepalive 链接保持时间也是connect超时的时间
   */
  constructor(ip: string, port: number, clientId: string, opts: MqttClientSocketOptions = {keepalive: 30}) {
    super();
    this.ip = ip;
    this.port = port;
    this.clientId = clientId;
    this.opts = opts;
    this.opts.keepalive = this.opts.keepalive * 1000;
    this.connectReq = null;
    this.pingReq = null;
  }

  /**
   * 与mqtt server 建立链接
   * @returns {Promise<void>}
   */
  async connect(): Promise<void> {
    let stream = net.createConnection(this.port, this.ip);
    this.socket_ = mqttCon(stream);
    // 监听各种事件
    this.socket_.on("connack", this.onConnack.bind(this));
    this.socket_.on("pingresp", this.onPingresp.bind(this));
    this.socket_.on("close", this.onClose.bind(this, new Error("MqttClientSocket close event")));
    this.socket_.on("error", this.onClose.bind(this, new Error("MqttClientSocket error event")));
    this.socket_.on("disconnect", this.onClose.bind(this, new Error("MqttClientSocket disconnect event")));

    try {
      //向broker发送connect包
      this.connectReq = new ClientConnectReq(this.clientId, this.opts.keepalive, this.opts.keepalive);
      await new Promise<any>((suc, fail) => {
        this.connectReq.connect(this.socket_, (err, data) => {
          if (err) {
            fail(err)
          } else {
            suc(data);
          }
        });
      });
    } catch (e) {
      this.close();
      throw e;
    }

    //开始心跳
    this.startHeartbeat();
  }


  public close(): void {
    this.socket_.destroy();
    if (this.connectReq) {
      this.connectReq.cancle();
    }
    if(this.pingReq) {
      this.pingReq.cancle();
    }
  }

  private onClose(e: Error): void {
    this.emit("close", e.message);
    this.close();
  }


  private onConnack(packet: any) {
    if (!this.connectReq) {
      return;
    }
    this.connectReq.handleResponse(packet);
    this.connectReq = null;
  }

  private onPingresp(packet: any) {
    if(!this.pingReq) {
      return;
    }
    this.connectReq = null;
    this.pingReq.handleResponse(packet);
  }

  private startHeartbeat(): void {
    setTimeout(() => {
      this.ping().then(() => {
        this.startHeartbeat();
      }, err => {
        this.onClose(err);
      })
    }, this.opts.keepalive);
  }

  private ping(): Promise<void> {
    this.pingReq = new ClientPingReq(this.opts.keepalive);
    return new Promise<void>((suc, fail) => {
        this.pingReq.ping(this.socket_, (err: Error, data: string) => {
          if(err) {
            fail(err);
          } else {
            suc();
          }
        })
    });
  }

}

export interface MqttClientSocketOptions {
  keepalive: number; //default 30s
}