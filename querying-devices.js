// querying-devices.js

var iothub = require('azure-iothub');
// IOT Hub Owner connection string from the shared access polices
var connectionString = '<<>>';
var registry = iothub.Registry.fromConnectionString(connectionString);

function queryDevices(queryString) {
    var query = registry.createQuery(queryString, 100);

    query.nextAsTwin(function(err, results) {
        if (err) {
            console.error('Failed to fetch the results: ' + err.message);
        } else {
            console.log("Query Results : " + results.map(function(twin) {return twin.deviceId}).join(','));
        }
    });
}

// query based on tags

//queryDevices("SELECT * FROM devices WHERE tags.location.plant = 'Bangalore'"); 
// queryDevices("SELECT * FROM devices WHERE tags.type = 'temperature'");

// reported": {
//     "firmwareVersion": "V1.2",
//     "metrics": {
//       "flow": 1000,
//       "valve_status": true,


// query based on reported
// queryDevices("SELECT * FROM devices WHERE properties.reported.metrics.valve_status = true");
// queryDevices("SELECT * FROM devices WHERE properties.reported.metrics.flow > 800");

// query based on desired
queryDevices("SELECT * FROM devices WHERE properties.desired.dianosticData = true");


