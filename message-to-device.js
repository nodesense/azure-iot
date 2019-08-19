// message-to-device.js

//sending a message from backend code such as web service/mobile app etc

// Using the Azure CLI:
// az iot hub show-connection-string --hub-name {YourIoTHubName} --output table
var connectionString = '<<<>>>';

// npm install azure-iothub

var Client = require('azure-iothub').Client;

var deviceId = '<<<>>>';

// Connect to the service-side endpoint on your IoT hub.
var client = Client.fromConnectionString(connectionString);
 

client.send(deviceId, "Message 2 coming from App", function callback() {
    console.log('message sent ');
})
