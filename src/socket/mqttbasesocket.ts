import {EventEmitter} from "events";
import * as _ from "lodash";

export class MqttBaseSocket extends EventEmitter {
  constructor() {
    super();
    this.timers = {};
    this.messageId = 1;
  }

  protected socket_: any;
  private messageId: number;


  protected timers: any;

  protected clearTimers(): void {
    for(let timer of this.timers) {
      clearTimeout(timer);
    }
  }

  protected clearTimerByName(name: string): void {
    clearTimeout(this.timers[name]);
  }

  protected addTimer(name: string, second: number, timeoutFunction: any): void {
    if(this.timers[name]) {
      clearTimeout(this.timers[name]);
    }this.timers[name] = setTimeout(timeoutFunction, second * 1000);
  }

  protected disConnect(e?: Error): void {
    if(_.isObject(this.socket_)) {
      this.clearTimers();
      this.socket_.destroy();
      this.socket_ = null;
      this.emit("close", e);
    }
  }

  protected onPublish(packet: any) {
    this.emit("publish", packet.topic, packet.payload.toString(), packet);
  }


  public publish(payload: string, topic: string = "", qos: number = 1) {
    let messageId: number = this.messageId;
    this.socket_.publish({messageId, payload, topic, qos});
  }
}
