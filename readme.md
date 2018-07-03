## API

### MqttClientSocket

* constructor
	* ip string
	* port number
	* clientId string
	* opts MqttClientSocketOptions options
* connect 连接mqtt server
* publish 发布信息
	* payload string
	* topic string
	* qos default 0 目前只支持0
* close 关闭
* event
	* close socket关闭
	* publish payload
* static
	* error 错误输出方法，默认console.log


	
	
### MqttServerSocket

* init 	
	* socket socket或者websocket
* close 关闭socket 
* publish 发布信息
	* payload string
	* topic string
	* qos default 0 目前只支持0
* static
	* error 错误输出方法，默认console.log
* event
	* close reason string
	* publish payload