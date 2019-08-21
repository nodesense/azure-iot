// assembly-stream.js
// assemly-line streaming example

// Simulate an assembly line  for bulb production

// Using the Azure CLI:
// az iot hub device-identity show-connection-string --hub-name {YourIoTHubName} --device-id MyNodeDevice --output table

// create a device called "assembly-1" in the iot hub
// go to specific device, copy the primary connection string
var connectionString = '';

// npm install azure-iot-device-mqtt
var Mqtt = require('azure-iot-device-mqtt').Mqtt; // Protocol
var DeviceClient = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message;

// Client connection object, using MQTT protocol
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

var categories = ['head-light', 'rear-light', 'indoor-light'];
var rejections = ['crack', 'burn', 'touch-mark'];

// Create a message and send it to the IoT hub every 10 seconds
setInterval(function(){
  // Simulate telemetry.

  var r = Math.ceil(210 + (Math.random() * 15));

  var category = categories[Math.floor(categories.length * Math.random())]
  var rejection = ''
  
  var failure = r % 3 == 0; // if the random % 3 ==0, then failure. 33% of products may fail
     
  if (failure) {
    rejection = rejections[Math.floor(rejections.length * Math.random())]
  }

  // convert object to JSON string format
  // 1. MESSAGE [PAYLOAD]
  var message = new Message(JSON.stringify({
    category: category,
    rejection: rejection,
    success: failure == true? 0: 1,
    type: 'assembly-line'
  }));
 
  // What is inside the message
  message.contentType = "application/json";
  message.contentEncoding = "utf-8";

  console.log('Sending message: ' + message.getData());



  // Send the message to the cloud, iot hub using MQTT Protocol
  client.sendEvent(message, function (err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      console.log('message sent');
    }
  });
}, 5 * 1000);


