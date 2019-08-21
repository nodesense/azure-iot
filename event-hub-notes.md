# Event Hub
    -- To ingest the events millions per second
    -- what is an event?
            -- Edge Device Send telemetry data is an event
            -- Alert & Alarm also can be a event
            -- fact what is happend

## Storage
    -- EventHub is NOT A Database
    -- Sort of flat file, append only file
    -- We cannot delete/update the existing event stored in the event hub
    -- add the event
    -- The storage is partitioned to handle high capacity messages [volumes]

# Namespace/name/topics
    -- An Event hub can have 1 or more namespaces/topics
    -- namespace/topic is a logical separation of the messages
    -- ex:  all-alerts, all-energy-data, all-emails-sent
    -- every topic can have 1 to 32 paritions

## Partition
    -- A Subset of data stored
    -- Event hub can have 1 to 32 partitions


Ex:
Topics/namespace : messages [to store all the data send by the device]
Total Partitions: 4
  P 0 - M0, M2
  P 1 - M1, M6
  P 2 - M3, M5
  P 3 -  M4

To get all the data from the namespace/topic, collect data from P0, P1, P2, P3

Device Sent a message M0, M1, M2, M3, M4, M5, M6
