// temp-device.js
// Simulate a Temp device, temperature, 
// if temp > 40, move the messsage to event hub, using routes

// Using the Azure CLI:
// az iot hub device-identity show-connection-string --hub-name {YourIoTHubName} --device-id MyNodeDevice --output table

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
  // Simulate telemetry.
  var temperature = Math.ceil(20 + (Math.random() * 30)); // 20 to 50
  var humidity =  60 + (Math.random() * 20) // 60 to 79

  // convert object to JSON string format
  // 1. MESSAGE [PAYLOAD]
  var message = new Message(JSON.stringify({
    temperature: temperature,
    humidity: humidity
  }));

  // Add a custom application property to the message.
  // An IoT hub can filter on these properties without access to the message body.
  // Attached to rule alert = true
  message.properties.add('alert', (temperature > 40) ? 'true' : 'false');
  
  // What is inside the message
  message.contentType = "application/json";
  message.contentEncoding = "utf-8";

  console.log('Sending message: ' + message.getData());


 // to receive messages posted/pushed from the Iot Hub to the Device
 // MQTT, subscription
 client.on('message', function (msg) {
    // console.log('msg ', msg, msg.properties.propertyList);
    console.log('msg ', msg)
    console.log('Got message from cloud:  Id: ' + msg.messageId + ' Body: ' + msg.data);
    // acknowledgement back to the cloud that message is processed
    // don't send the message again
    client.complete(msg, function(result) {
        console.log('ack result ' + result)
    });
  });


  // Send the message to the cloud, iot hub using MQTT Protocol
  // telemetric data
  client.sendEvent(message, function (err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      console.log('message sent');
    }
  });
}, 10 * 1000);


