// call-device-method.js

// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';
 
// Using the Azure CLI:
// az iot hub show-connection-string --hub-name {YourIoTHubName} --output table
// take primary connection string from IotHubOwner policy [Shared access policy]
var connectionString = '<<>>';
 
var Client = require('azure-iothub').Client;

var deviceId = 'energy-device-1';

// Connect to the service-side endpoint on your IoT hub.
var client = Client.fromConnectionString(connectionString);

// Set the direct method name, payload, and timeout values
var methodResetEnergyTotalParams = {
  methodName: 'ResetEnergyTotal',
  payload: JSON.stringify({reset: true})  , // Number of seconds.
  responseTimeoutInSeconds: 30
};


// Call the direct method on your device using the defined parameters.
client.invokeDeviceMethod(deviceId, methodResetEnergyTotalParams, function (err, result) {
  if (err) {
      console.error('Failed to invoke method \'' + methodResetEnergyTotalParams.methodName + '\': ' + err.message);
  } else {
      console.log('Response from ' + methodResetEnergyTotalParams.methodName + ' on ' + deviceId + ':');
      console.log(JSON.stringify(result, null, 2));
  }
});

// Set the direct method name, payload, and timeout values
var methodChangeUnitParams = {
    methodName: 'ChangeVoltUnit',
    payload:  {"unit": "KiloVolt"}  , // Number of seconds.
    responseTimeoutInSeconds: 30
  };
  

// Call the direct method on your device using the defined parameters.
client.invokeDeviceMethod(deviceId, methodChangeUnitParams, function (err, result) {
    if (err) {
        console.error('Failed to invoke method \'' + methodChangeUnitParams.methodName + '\': ' + err.message);
    } else {
        console.log('Response from ' + methodChangeUnitParams.methodName + ' on ' + deviceId + ':');
        console.log(JSON.stringify(result, null, 2));
    }
  });
  
   
  
