import {MqttBaseSocket} from "./mqttbasesocket";
import * as _ from "lodash";

const mqttCon = require('mqtt-connection');

export class MqttServerSocket extends MqttBaseSocket {
  constructor() {
    super();

  }

  async init(socket: any): Promise<void> {

    this.socket_ = mqttCon(socket);

    let connectSuc: any;
    let connectFail: any;
    let waiter: Promise<void> = new Promise((suc, fail) => {
      connectSuc = suc;
      connectFail = fail;
    });


    this.addTimer(TimerName.WaitConnect, 5, () => {
      this.disConnect();
      connectFail(new Error('MqttServerSocket wait connect package timeout'))
    });

    this.socket_.on("connect", packet => {
      this.clearTimers();
      let {clientId, keepalive} = packet;
      if (!_.isString(clientId)) {
        this.socket_.connack({returnCode: 1});
        connectFail(new Error(`MqttServerSocket init fail: lack clientId`));
        this.disConnect();
        return;
      }
      if (!_.isNumber(keepalive)) {
        this.socket_.connack({returnCode: 2});
        connectFail(new Error(`MqttServerSocket init fail: lack keepalive`));
        this.disConnect();
        return;
      }

      this.clientId = clientId;
      this.keepalive = keepalive;
      this.socket_.connack({returnCode: 0});
      connectSuc();
    });

    this.socket_.on("publish", this.onPublish.bind(this));
    this.socket_.on("disconnect", this.disConnect.bind(this));
    this.socket_.on("pingreq", this.onPingreq.bind(this));
    this.addTimer(
      TimerName.WaitPingreq,
      this.keepalive * 1.5,
      () => this.disConnect(new Error("MqttServerSocket pingresp timeout"))
    );
    await waiter;
  }

  public clientId: string;

  private keepalive: number;

  private onPingreq() {
    this.clearTimerByName(TimerName.WaitPingreq);
    this.pingresp();
  }

  private pingresp() {
    this.socket_.pingresp();
    this.addTimer(
      TimerName.WaitPingreq,
      this.keepalive * 1.5,
      () => this.disConnect(new Error("MqttServerSocket pingresp timeout"))
    );
  }

}

enum TimerName {
  WaitConnect =  "WaitConnect",
  WaitPingreq = "WaitPingreq"
}



