import {BaseReq} from "./base-req";

export class ServerWaitConnectPacketReq extends BaseReq {

  constructor(timeout: number) {
    super();
    this.timeout = timeout;
  }

  wait(cb: (err: Error, data: string)=> void) {
    this.cb = cb;

    this.timer = setTimeout(() => {
      this.clearTimer();
      this.cb(new Error(`ServerWaitConnectPacketReq timeout`), null);
    }, this.timeout);
  }

  handleResponse(packet: any) {
    this.clearTimer();
    this.cb(null, packet);
  }

  private timeout: number;
}