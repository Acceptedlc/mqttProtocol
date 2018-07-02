import {BaseReq, RequestStatus} from "./base-req";

export class ClientConnectReq extends BaseReq{
  constructor(clientId: string, keepalive: number, timeout: number) {
    super();
    this.clientId = clientId;
    this.keepalive = keepalive;
    this.timeout = timeout;
  }

  connect(socket: any, cb: (err: Error, data: string)=> void) {
    this.cb = cb;
    socket.connect({clientId: this.clientId, keepalive: this.keepalive});
    this.status = RequestStatus.Pendding;
    this.timer = setTimeout(this.onTimeout.bind(this), this.timeout);
  }

  handleResponse(packet: any) {
    this.clearTimer();
    if (packet.returnCode !== 0) {
      this.status = RequestStatus.Fail;
      this.cb(new Error(`ClientConnectReq server refuse, code: ${packet.returnCode}`), null);
    } else {
      this.status = RequestStatus.Success;
      this.cb(null, packet);
    }
  }

  protected onTimeout(): void {
    super.onTimeout();
    this.cb(new Error(`ClientConnectReq timeout`), null);
  }

  private clientId: string;
  private keepalive: number;
  private timeout: number;
}