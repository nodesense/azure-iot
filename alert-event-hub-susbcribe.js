// alert-event-hub-susbcribe.js

const { EventHubClient } = require("@azure/event-hubs");

// Connection string - primary key of the Event Hubs namespace. 
// For example: Endpoint=sb://myeventhubns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// take from newly created event hub 
const connectionString = "";

// Name of the event hub. For example: eh-alerts
const eventHubsName = "eh-alerts";


async function main() {
    const client = EventHubClient.createFromConnectionString(connectionString, eventHubsName);
    const allPartitionIds = await client.getPartitionIds();
    // const firstPartitionId = allPartitionIds[0];
  
    for (const partitionId of allPartitionIds) {
                const receiveHandler = client.receive(partitionId, eventData => {
                console.log(`Received message: from partition ${partitionId}`, eventData.body);
                }, error => {
                console.log('Error when receiving message: ', error)
                });
    }
  
    // Sleep for a while before stopping the receive operation.
    await delay(1000 * 60 * 60);
    await receiveHandler.stop();
  
    await client.close();
  }
  
  main().catch(err => {
    console.log("Error occurred: ", err);
  });
