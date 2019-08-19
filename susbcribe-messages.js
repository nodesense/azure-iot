// susbcribe-messages.js
// susbcribe any messages posted by any device here.

// read from event hub

 // Using the Azure CLI:
// az iot hub show-connection-string --hub-name {YourIoTHubName} --output table
var connectionString = '';

// npm install @azure/event-hubs
var { EventHubClient, EventPosition } = require('@azure/event-hubs');

var printError = function (err) {
  console.log(err.message);
};

// Display the message content - telemetry and properties.
// - Telemetry is sent in the message body
// - The device can add arbitrary application properties to the message
// - IoT Hub adds system properties, such as Device Id, to the message.
var printMessage = function (message) {
  // console.log('Partition ', message.partitionId);
  console.log('Telemetry received: ');
  console.log(JSON.stringify(message.body)); // send by the device {temperature, humidity..}
  console.log('Application properties (set by device): ')
  console.log(JSON.stringify(message.applicationProperties)); // temperatureAlert: true/false value
  console.log('System properties (set by IoT Hub): ')
  console.log(JSON.stringify(message.annotations)); 
  console.log('');
};

// Connect to the partitions on the IoT Hub's Event Hubs-compatible endpoint.
// This example only reads messages sent after this application started.
var ehClient;
EventHubClient.createFromIotHubConnectionString(connectionString)
                .then(function (client) {
                    console.log("Successully created the EventHub Client from iothub connection string.");
                    ehClient = client;
                    return ehClient.getPartitionIds();
                }).then(function (ids) {
                    console.log("The partition ids are: ", ids);
                
                        return ids.map(function (partitionId) {
                            return ehClient.receive(partitionId, 
                                                    printMessage, 
                                                    printError, 
                                                    { eventPosition: EventPosition.fromEnqueuedTime(Date.now()) });
                        });
                }).catch(printError);
