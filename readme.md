## API

### MqttClientSocket

* constructor
	* ip string
	* port number
	* clientId string
	* opts MqttClientSocketOptions options
* connect 连接mqtt server
* close 关闭
* event
	* close socket关闭
* static
	* error 错误输出方法，默认console.log


	
	
### MqttServerSocket

* init 	
	* socket socket或者websocket
* close 关闭socket 
* static
	* error 错误输出方法，默认console.log