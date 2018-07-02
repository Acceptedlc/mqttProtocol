import * as net from "net";


const port: number = 5555;
const ip: string = "localhost";

let stream = net.createConnection(port, ip);
