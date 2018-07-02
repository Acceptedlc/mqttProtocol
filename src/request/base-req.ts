export abstract class BaseReq {
  protected status: number;
  protected cb: (err: Error, data: string) => void;
  protected timer: NodeJS.Timer;

  constructor() {
    this.status = RequestStatus.Init;
  }

  protected clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  protected onTimeout(): void {
    this.cancle();
  }

  public getStatus(): RequestStatus {
    return this.status;
  }

  public cancle(): void {
    this.clearTimer();
    this.status = RequestStatus.Fail;
  }
}


export enum RequestStatus {
  Init, Pendding, Success, Fail
}