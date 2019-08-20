// update-device-twin-tags.js
// update the desired properties
// update the tags
// service/mobile app

var iothub = require('azure-iothub');
// IOT Hub Owner connection string from the shared access polices
var connectionString = 'HostName=krishiothub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=TZijQeHBCyk7rb7ipBHUXsxhJPqSGSnknYYWYjIrMQg=';
var registry = iothub.Registry.fromConnectionString(connectionString);

var queryTwins = function() {
    var query = registry.createQuery("SELECT * FROM devices WHERE tags.location.plant = 'Bangalore'", 100);
    query.nextAsTwin(function(err, results) {
        if (err) {
            console.error('Failed to fetch the results: ' + err.message);
        } else {
            console.log("Devices in Bangalore: " + results.map(function(twin) {return twin.deviceId}).join(','));
        }
    });

    query = registry.createQuery("SELECT * FROM devices WHERE tags.location.plant = 'Bangalore' AND properties.reported.connectivity.type = 'cellular'", 100);
    query.nextAsTwin(function(err, results) {
        if (err) {
            console.error('Failed to fetch the results: ' + err.message);
        } else {
            console.log("Devices in Bangalore using cellular network: " + results.map(function(twin) {return twin.deviceId}).join(','));
        }
    });
};

const deviceId = 'water-control-meter-1'
registry.getTwin(deviceId, function(err, twin){
    if (err) {
        console.error(err.constructor.name + ': ' + err.message);
    } else {
        var patch = {
            tags: {
             location: {
                    region: 'KA',
                    plant: 'Bangalore'
              },
              type: 'flow-valve'
            }
        };
 

        twin.update(patch, function(err) {
          if (err) {
            console.error('Could not update twin: ' + err.constructor.name + ': ' + err.message);
          } else {
            console.log(twin.deviceId + ' twin updated successfully');
           // queryTwins();
          }
        });

        // updating desired properties
        var twinPatchFanOn = {
            properties: {
              desired: {
                dianosticData: true,
                valve_status: false
              }
            }
          };

          twin.update(twinPatchFanOn, (err, twin) => {
            if (err) {
              console.error(err.message);
            } else {
              console.log("\nSent", twin.properties.desired.patchId, " patch:");
              console.log(JSON.stringify(twinPatchFanOn, null, 2));
            }
          });
    }
});
