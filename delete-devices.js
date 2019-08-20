// delete-devices.js
 
'use strict';

var iothub = require('azure-iothub');
var uuid = require('uuid');


// take this from sas shared polices
var connectionString = '';

var registry = iothub.Registry.fromConnectionString(connectionString);


var deviceDeleteArray = [
    {
      deviceId: 'device-1'
    },
    {
        deviceId: 'device-2'
      },
];

// FIXME: how to delete all devices. 
registry.removeDevices(deviceDeleteArray, true, printAndContinue('deleting', function () {
        console.log('delete done');
}))


function printAndContinue(op, next) {
    return function printResult(err, resultData) {
      if (err) console.log(op + ' error: ' + err.toString());
      if (resultData) {
        var arrayString = resultData.errors.length === 0 ? 'no errors' : JSON.stringify(resultData.errors);
        console.log(op + ' isSuccessful: ' + resultData.isSuccessful + ', errors returned: ' + arrayString);
      }
      if (next) next();
    };
  }
