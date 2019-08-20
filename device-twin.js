// device-twin.js
'use strict';

var Client = require('azure-iot-device').Client;
var Protocol = require('azure-iot-device-mqtt').Mqtt;

var connectionString = ''; 

// create the IoTHub client
var client = Client.fromConnectionString(connectionString, Protocol);
console.log('got client');

// connect to the hub
client.open(function(err) {
  if (err) {
    console.error('could not open IotHub client');
    process.exit(-1);
  } else {
    console.log('client opened');

    // Get device Twin
    client.getTwin(function(err, twin) {
      if (err) {
        console.error('could not get twin');
        // process.exit(-1);
      } else {
        console.log('twin obtained/created', twin.properties);


        // subscribing for twin desired properties update
        twin.on('properties.desired', function(delta) {
            console.log('new desired properties received:');
            console.log(JSON.stringify(delta));
        });

        // // for a particular properties
        twin.on('properties.desired.dianosticData', function(delta) {
            console.log('dianosticData Changed received:');
            console.log(JSON.stringify(delta));
        });


            // // update begin
            // // create a patch to send to the hub
            var patch = {
                firmwareVersion:'V1.2',
                metrics: {
                    flow: 1000,
                    valve_status: true,
                    valve_position: 60
                }
            };

            // // send the patch
            twin.properties.reported.update(patch, function(err) {
            if (err) {
                console.error('unable to update twin: ' + err.toString());
                
            } else {
                console.log('twin state reported');
            
            }
            });


    // update end



      }
    });
 

  }
});
