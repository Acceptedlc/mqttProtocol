import {MqttBaseSocket} from "./mqttbasesocket";
import * as net from "net";

const mqttCon = require('mqtt-connection');

export class MqttClientSocket extends MqttBaseSocket {
  constructor(ip: string, port: number, clientId: string, opts: MqttClientSocketOptions = {keepalive: 30}) {
    super();
    this.ip = ip;
    this.port = port;
    this.clientId = clientId;
    this.opts = opts;
    this.timers = [];
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


    this.addTimer(TimerName.WaitConnect, this.opts.keepalive, () => {
      this.disConnect();
      connectFail(new Error(`mqttClientSocket connect timeout: ip=${this.ip}, port=${this.port}`));
    });

    this.socket_.on("connack", (packet: any) => {
      if (packet.returnCode !== 0) {
        connectFail(new Error(`mqttClientSocket connect refuse: returnCode=${packet.returnCode}`));
        this.disConnect();
        this.clearTimers();
        return;
      }
      this.clearTimerByName(TimerName.WaitConnect);
      connectSuc();
    });

    this.socket_.on("publish", this.onPublish.bind(this));
    this.socket_.on("pingresp", this.onPingresp.bind(this));
    this.socket_.on("disconnect", this.disConnect.bind(this, new Error("MqttClientSocket disconnect")));
    this.socket_.on('close', this.disConnect.bind(this, new Error("MqttClientSocket close")));
    this.socket_.on('error', this.disConnect.bind(this, new Error("MqttClientSocket error")));
    this.pingreq();
    await waiter;
    console.log("sdfdsfsdf")
  }

  private readonly ip: string;
  private readonly port: number;
  private readonly opts: MqttClientSocketOptions;
  private readonly clientId: string;

  private pingreq() {
    this.socket_.pingreq();
    this.addTimer(
      TimerName.WaitPingresp,
      this.opts.keepalive,
      () => this.disConnect(new Error("MqttClientSocket pinresp timeout"))
    )
  }

  private onPingresp() {
    this.clearTimerByName(TimerName.WaitPingresp);
    this.addTimer(TimerName.NextPing, this.opts.keepalive, this.pingreq.bind(this));
  }
}

export interface MqttClientSocketOptions {
  keepalive: number; //default 30s
}

enum TimerName {
  WaitConnect = "WaitConnect",
  WaitPingresp = "WaitPingresp",
  NextPing = "NextPing"
}
