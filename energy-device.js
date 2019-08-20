// energy-device.js
// Simulate a Energy device

// Using the Azure CLI:
// az iot hub device-identity show-connection-string --hub-name {YourIoTHubName} --device-id MyNodeDevice --output table

// go to specific device, copy the primary connection string
var connectionString = '<<>>';

// npm install azure-iot-device-mqtt
var Mqtt = require('azure-iot-device-mqtt').Mqtt; // Protocol
var DeviceClient = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message;

// Client connection object, using MQTT protocol
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

var totalEnergy = 0;
var voltageUnit = 'Volt'; // changed to KiloVolt


 // to receive messages posted/pushed from the Iot Hub to the Device
 // MQTT, subscription
 client.on('message', function (msg) {
  // console.log('msg ', msg, msg.properties.propertyList);
  console.log('msg ', msg)
  console.log('Got message from cloud:  Id: ' + msg.messageId + ' Body: ' + msg.data);
  if (msg.data.toString() === 'ResetTotal') {
    totalEnergy = 0;
  }
  // acknowledgement back to the cloud that message is processed
  // don't send the message again
  client.complete(msg, function(result) {
      console.log('ack result ' + result)
  });
});




// Iot Hub Methods
// Function within the device, it has a name
// RPC - Remote Procedure call, calling/invoking a method in another machine/device
// call a function/method, 
//      1. we can pass argument (1) as input
//      2. A function can return a value as output

// we are calling a function to reset energyTotal to 0



function resetEnergyTotal(request, response) {
  console.log('resetMeter called', request); // request is input argument
  totalEnergy = 0;
  // try enable/disable below to understand method timeout
  response.send(200, 'Reset successfully done'); // output value/result send back to Iot HUB
}


function changeVoltUnit(request, response) {
  console.log('resetMeter called', request); // request is input argument
  
  voltageUnit = request.payload.unit;
  
  // try enable/disable below to understand method timeout
  response.send(200, {'result': true}); // output value/result send back to Iot HUB
}


// register a method with IoT Hub, ResetEnergyTotal is a method name
client.onDeviceMethod('ResetEnergyTotal', resetEnergyTotal);
client.onDeviceMethod('ChangeVoltUnit', changeVoltUnit);


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


