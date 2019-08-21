// assembly-service-bus.js

// npm install @azure/service-bus
// node assembly-service-bus.js

// query 
`

SELECT
    category,
    COUNT(*) as "total"
INTO
    [AssemblyServiceBusReport]
FROM
    [IoTHubInput]
WHERE
        type = 'assembly-line'
GROUP BY
        category,
        TumblingWindow(second, 60)

`

const { ServiceBusClient, ReceiveMode } = require("@azure/service-bus");

// Define connection string and related Service Bus entity names here
// take connection string from service bus shared access policy
const connectionString = "";

//queue name
const queueName = "assembly-report";

async function main() {
  const sbClient = ServiceBusClient.createFromConnectionString(connectionString);

  // If receiving from a Subscription, use `createSubscriptionClient` instead of `createQueueClient`
  const queueClient = sbClient.createQueueClient(queueName);

  // To receive messages from sessions, use getSessionReceiver instead of getReceiver or look at
  // the sample in sessions.js file
  const receiver = queueClient.createReceiver(ReceiveMode.peekLock);

  try {
    for (let i = 0; i < 10000; i++) {
      const messages = await receiver.receiveMessages(1, 5);
      if (!messages.length) {
        console.log("No more messages to receive");
        continue;
      }
      console.log(`Received message #${i}: `, messages[0].body);
      for (const msg of messages) {
          // send acknowlege to the queue so that the queue can remove the message 
        await msg.complete();
      }
    }
    await queueClient.close();
  } finally {
    await sbClient.close();
  }
}

main().catch((err) => {
  console.log("Error occurred: ", err);
});
