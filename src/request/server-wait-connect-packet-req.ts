import {BaseReq} from "./base-req";
import * as _ from "lodash";

export class ServerWaitConnectPacketReq extends BaseReq {

  constructor(timeout: number) {
    super();
    this.timeout = timeout;
  }

  wait(cb: (err: Error, data: string)=> void) {
    this.cb = cb;

    this.timer = setTimeout(this.onTimeout.bind(this), this.timeout);
  }

  handleResponse(packet: any) {
    this.clearTimer();
    let {clientId, keepalive} = packet;
    if (!_.isString(clientId)) {
      this.cb(new Error(`ServerWaitConnectPacketReq illegal client: lack clientId`), null);
      return;
    }
    if (!_.isNumber(keepalive)) {
      this.cb(new Error(`ServerWaitConnectPacketReq illegal client: lack keepalive`), null);
      return;
    }
    this.cb(null, packet);
  }

  protected onTimeout() {
    super.onTimeout();
    this.cb(new Error(`ServerWaitConnectPacketReq timeout`), null);
  }

  private timeout: number;
}