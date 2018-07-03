import {BaseReq, RequestStatus} from "./base-req";

export class ClientPingReq extends BaseReq {
  private timeout: number;

  constructor(timeout: number) {
    super();
    this.timeout = timeout;
  }

  ping(socket: any, cb: (err: Error, data: string)=> void) {
    this.cb = cb;
    socket.pingreq();
    this.status = RequestStatus.Pendding;
    this.timer = setTimeout(this.onTimeout.bind(this), this.timeout);
  }


  handleResponse(packet: any) {
    this.clearTimer();
    this.cb(null, null);
  }

  protected onTimeout(): void {
    super.onTimeout();
    this.cb(new Error("ClientPingReq timeout"), null);
  }

}