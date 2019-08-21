// ESP32-Azure.uno

// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. 

#include <WiFi.h>
// #include <math.h>

#include "AzureIotHub.h"
#include "Esp32MQTTClient.h"

#include "DHTesp.h"

#define DHTpin 15    //D15 of ESP32 DevKit

DHTesp dht;

#define INTERVAL 10000
#define DEVICE_ID "temp-device-1"
#define MESSAGE_MAX_LEN 256

// Please input the SSID and password of WiFi
const char* ssid     = "";
const char* password = "";

/*String containing Hostname, Device Id & Device Key in the format:                         */
/*  "HostName=<host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"                */
/*  "HostName=<host_name>;DeviceId=<device_id>;SharedAccessSignature=<device_sas_token>"    */
// connection string from a device primary
static const char* connectionString = "";

const char *messageData = "{\"deviceId\":\"%s\", \"messageId\":%d, \"temperature\":%f, \"humidity\":%f}";

int messageCount = 1;
static bool hasWifi = false;
static bool messageSending = true;
static uint64_t send_interval_ms;

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utilities
static void InitWifi()
{
  Serial.println("Connecting...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  hasWifi = true;
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

static void SendConfirmationCallback(IOTHUB_CLIENT_CONFIRMATION_RESULT result)
{
  if (result == IOTHUB_CLIENT_CONFIRMATION_OK)
  {
    Serial.println("Send Confirmation Callback finished.");
  }
}

static void MessageCallback(const char* payLoad, int size)
{
  Serial.println("Message callback:");
  Serial.println(payLoad);
}

static void DeviceTwinCallback(DEVICE_TWIN_UPDATE_STATE updateState, const unsigned char *payLoad, int size)
{
  char *temp = (char *)malloc(size + 1);
  if (temp == NULL)
  {
    return;
  }
  memcpy(temp, payLoad, size);
  temp[size] = '\0';
  // Display Twin message.
  Serial.println(temp);
  free(temp);
}

static int  DeviceMethodCallback(const char *methodName, const unsigned char *payload, int size, unsigned char **response, int *response_size)
{
  LogInfo("Try to invoke method %s", methodName);
  const char *responseMessage = "\"Successfully invoke device method\"";
  int result = 200;

  if (strcmp(methodName, "start") == 0)
  {
    LogInfo("Start sending temperature and humidity data");
    messageSending = true;
  }
  else if (strcmp(methodName, "stop") == 0)
  {
    LogInfo("Stop sending temperature and humidity data");
    messageSending = false;
  }
  else
  {
    LogInfo("No method %s found", methodName);
    responseMessage = "\"No method found\"";
    result = 404;
  }

  *response_size = strlen(responseMessage) + 1;
  *response = (unsigned char *)strdup(responseMessage);

  return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Arduino sketch
void setup()
{
  Serial.begin(115200);
  Serial.println("ESP32 Device");
  Serial.println("Initializing...");

  // Initialize the WiFi module
  Serial.println(" > WiFi");
  hasWifi = false;
  InitWifi();
  if (!hasWifi)
  {
    return;
  }
  randomSeed(analogRead(0));

  Serial.println(" > IoT Hub");
  Esp32MQTTClient_SetOption(OPTION_MINI_SOLUTION_NAME, "GetStarted");
  Esp32MQTTClient_Init((const uint8_t*)connectionString, true);

  // confirmation messages from cloud to device
  Esp32MQTTClient_SetSendConfirmationCallback(SendConfirmationCallback);
  // cloud to device messagaes
  Esp32MQTTClient_SetMessageCallback(MessageCallback);
  // device twin update callback
  Esp32MQTTClient_SetDeviceTwinCallback(DeviceTwinCallback);
  // Azure method
  Esp32MQTTClient_SetDeviceMethodCallback(DeviceMethodCallback);

  send_interval_ms = millis();

    dht.setup(DHTpin, DHTesp::DHT11); //for DHT11 Connect DHT sensor to GPIO 17

}

void loop()
{
  if (hasWifi)
  {
    if (messageSending && 
        (int)(millis() - send_interval_ms) >= INTERVAL)
    {
      // Send teperature data
      char messagePayload[MESSAGE_MAX_LEN];
      // float temperature = (float)random(0,50);
      // float humidity = (float)random(0, 1000)/10;
      delay(dht.getMinimumSamplingPeriod());

      float humidity = dht.getHumidity();
      float temperature = dht.getTemperature();
     
      
      snprintf(messagePayload,MESSAGE_MAX_LEN, messageData, DEVICE_ID, messageCount++, temperature,humidity);
      Serial.println(messagePayload);
      EVENT_INSTANCE* message = Esp32MQTTClient_Event_Generate(messagePayload, MESSAGE);
      Esp32MQTTClient_Event_AddProp(message, "temperatureAlert", "true");
      Esp32MQTTClient_SendEventInstance(message);
      
      send_interval_ms = millis();
    }
    else
    {
      Esp32MQTTClient_Check();
    }
  }
  delay(2000);
}
