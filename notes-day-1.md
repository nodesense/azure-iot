
HTTP Protocol
   Client -> Server 
   Web Client -> Web Server [HTTP/HTTPS]

   If server down?
    messages cannot be delivered

   Load Balancer/HA

   Web Client --> Web Server --> Web Client - NOT POSSIBLE, not a BROKER model

MQTT
    Broker model
        Publisher
        Susbcriber [consumer]
        Broker

        N x M communication, without direct interfacing

        Publisher 1 ----> Broker   --> Susbcriber  1
        Publisher 2 ----> Broker   --> Susbcriber  2
        Publisher 1 ----> Broker   --> Susbcriber  2
        Publisher 2 ----> Broker   --> Susbcriber  1



        QOS-0
          10:01 AM  Publisher 1 [Online] ----> Broker   --> Susbcriber  1 [Online] -- GOOD
          10:02 AM  Publisher 1 [Online] ----> Broker   --> Susbcriber  1 [Offline] -- Message is lost

        QOS-1

           10:01 AM   Publisher 1 [Online] ----> Broker   --> Susbcriber  1 [Online] -- GOOD
           10:02 AM   Publisher 1 [Online] ----> Broker   --> Susbcriber  1 [Offline]  
                                                 [store messages]
           10:03 AM                        ----> Broker   --> Susbcriber  1 [online]   - message is delivered
                                          [stored messages are deleted]

           10:05 AM                        ----> Broker   --> Susbcriber  2 [online] 
                                                               wants all the data posted so far - it won't
                                                               only new messages are delivered
 
            more than once deliver possible

        QOS-2
            Ack pattern, only once delivery

        TOPIC
            an aggreement between publisher(s) and subscriber(s) to exchange information

            temperature device publish messsage on a topic called /temperature
            subscriber subscribe messages from topic /temperature


Temp Device [device-to-cloud.js]
            publish the message MQTT protocol
                    who is broker? krishiothub.azure-devices.net has mqtt end point, act as broker

        Cons
            MQTT Broker cannot store messages for long time
            Quality of Service [QoS]
                QOS - 0
                QOS - 1
                QoS - 2




EventHubClient [inside MS-Azure]
        It susbcribe messages from krishiothub.azure-devices.net MQTT Broker

        Messages are stored into Event Hub
