// upload-device-files.js
// upload the files from the devices which will be stored in storage account
 
var Protocol = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;

// node.js packages, already part of the standard library, no need to install
var fs = require('fs');
const path = require('path');


// device connection string
var connectionString = '';

// assuming we have error1.log and sensor.dsp files in the same directory

const FILE_NAME = "sensor.dsp" // put your file name here

var filePath = path.join(__dirname, FILE_NAME)

var client = Client.fromConnectionString(connectionString, Protocol);

// node.js to check file exist or not.
fs.stat(filePath, function (err, fileStats) {
  if (err) {
    console.error('could not read file: ' + err.toString());
    process.exit(-1);
  } else {
      // read file from disk
    var fileStream = fs.createReadStream(filePath);

    // blob name for the storage account
    const blobName = FILE_NAME
    // blob name, name used to create blob in storage, file stream
    // uploding file to the IOT Hub
    client.uploadToBlob(blobName, fileStream, fileStats.size, function (err, result) {
      fileStream.destroy();
      if (err) {
        console.error('error uploading file: ' + err.constructor.name + ': ' + err.message);
        process.exit(-1);
      } else {
        console.log('Upload successful - ' + result);
        process.exit(0);
      }
    });
  }
});
