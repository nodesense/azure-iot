// device-route-example.js

// create a custom route, that contains below conditions
// $contentType = 'application/logs'
// then move to a blog storage for learning


// go to specific device, copy the primary connection string
var connectionString = '';

// npm install azure-iot-device-mqtt
var Mqtt = require('azure-iot-device-mqtt').Mqtt; // Protocol
var DeviceClient = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message;

// Client connection object, using MQTT protocol
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

// Create a message and send it to the IoT hub every 10 seconds
setInterval(function(){
 
  // convert object to JSON string format
  // 1. MESSAGE [PAYLOAD]
  var logMessage = new Message(JSON.stringify({
    error: "Low Memory " + Math.ceil (Math.random() * 1000) + " KB",
    warning: "Low Disk space "  + Math.ceil (Math.random() * 1000) + " KB",
  }));
 
  // What is inside the message
  logMessage.contentType = "application/logs"; //route condition $contentType = 'application/logs'
  logMessage.contentEncoding = "utf-8";

  console.log('Sending message: ' + logMessage.getData());

  // Send the message to the cloud, iot hub using MQTT Protocol
  // telemetric data
  client.sendEvent(logMessage, function (err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      console.log('message sent');
    }
  });
}, 5 * 1000);

