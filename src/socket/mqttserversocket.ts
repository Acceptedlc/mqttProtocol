import {MqttBaseSocket} from "./mqttbasesocket";
import * as _ from "lodash";
const mqttCon = require('mqtt-connection');

export class MqttServerSocket extends MqttBaseSocket{
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

    this.addTimer(5, () => {
      this.disConnect();
      connectFail(new Error('MqttServerSocket wait connect package timeout'))
    });

    this.socket_.on("connect", packet => {
      this.clearTimers();
      let {clientId, keepalive} = packet;
      if(!_.isString(clientId)) {
        this.socket_.connack({returnCode: 1});
        connectFail(new Error(`MqttServerSocket init fail: lack clientId`));
        this.disConnect();
        return;
      }
      if(!_.isNumber(keepalive)) {
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
    await waiter;
  }

  public clientId: string;


  private keepalive: number;

}



