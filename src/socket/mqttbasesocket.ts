import {EventEmitter} from "events";
import * as _ from "lodash";
const mqttCon = require('mqtt-connection');

export class MqttBaseSocket extends EventEmitter {
  constructor() {
    super();
    this.timers = [];
  }

  protected socket_: any;


  protected timers: NodeJS.Timer[];

  protected clearTimers(): void {
    for(let timer of this.timers) {
      clearTimeout(timer);
    }
  }

  protected addTimer(second: number, timeoutFunction: any): void {
    this.timers.push(setTimeout(timeoutFunction, second * 1000));
  }

  protected disConnect(): void {
    if(_.isObject(this.socket_)) {
      this.clearTimers();
      this.socket_.destroy();
      this.socket_ = null;
      this.emit("close");
    }
  }
}
