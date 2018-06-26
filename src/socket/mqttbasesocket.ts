import {EventEmitter} from "events";

const mqttCon = require('mqtt-connection');

export class MqttBaseSocket extends EventEmitter {
  protected socket_: any;
}
