import {BaseReq} from "./base-req";

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

    this.timer = setTimeout(() => {
      this.clearTimer();
      this.cb(new Error(`ClientConnectReq timeout`), null);
    }, this.timeout);
  }

  handleResponse(packet: any) {
    this.clearTimer();
    if (packet.returnCode !== 0) {
      this.cb(new Error(`ClientConnectReq server refuse, code: ${packet.returnCode}`), null);
    } else {
      this.cb(null, packet);
    }
  }

  private clientId: string;
  private keepalive: number;
  private timeout: number;
}