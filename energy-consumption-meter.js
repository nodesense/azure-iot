// energy-consumption-meter.js
// Simulate a Energy consumption, that should be later processed by service bus queue


// Using the Azure CLI:
// az iot hub device-identity show-connection-string --hub-name {YourIoTHubName} --device-id MyNodeDevice --output table

// go to specific device, copy the primary connection string
// create or use existing energy-device-1 id
var connectionString = '';

// npm install azure-iot-device-mqtt
var Mqtt = require('azure-iot-device-mqtt').Mqtt; // Protocol
var DeviceClient = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message;

// Client connection object, using MQTT protocol
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

var totalEnergy = 0;
var voltageUnit = 'Volt'; // changed to KiloVolt

    
// Create a message and send it to the IoT hub every 10 seconds
setInterval(function(){
  // Simulate telemetry.

  var voltage = Math.ceil(210 + (Math.random() * 15)); // 210 to 225 in volt
  var current =  Math.ceil(4 + (Math.random() * 2)) // 4 to 5
  var energy = voltage * current;

  totalEnergy += energy; //0, 1000, 2000, 300........

  if (voltageUnit === 'KiloVolt') {
    voltage = voltage / 1000.0;
  }

  // convert object to JSON string format
  // 1. MESSAGE [PAYLOAD]
  var message = new Message(JSON.stringify({
    voltage: voltage,
    current: current,
    energy: energy,
    totalEnergy: totalEnergy
  }));
 
  // What is inside the message
  message.contentType = "application/json";
  message.contentEncoding = "utf-8";

  // add a route in iot hub, if meter_type == 'energy-meter' move to service bus queue
  message.properties.add('meter_type', 'energy-meter');


  console.log('Sending message: ' + message.getData());

  // Send the message to the cloud, iot hub using MQTT Protocol
  client.sendEvent(message, function (err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      console.log('message sent');
    }
  });
}, 10 * 1000);


