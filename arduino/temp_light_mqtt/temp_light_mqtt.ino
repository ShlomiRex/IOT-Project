#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

#define DHTTYPE DHT11
#define DHTPin 12
#define InPin 14 // input for light sensor
int pirPin = 16; // input pin for PIR
int val; //PIR data

const char* ssid = "Kislla";
const char* password =  "";
const char* mqttServer = "farmer.cloudmqtt.com";
const int mqttPort = 18145;
const char* mqttUser = "ksjttdgx";
const char* mqttPassword = "qYSKwnCE2hVY";

// Temporary variables
//float temperature = 0;
//float fahrenheit = 0;
//float humidity = 0;
//int lightValue; // stores the light sensor input

/*
   MATRIX CONNECTIVITY:
   GND = 9
   3.3v = 11
   DHT sensor = 16
   light sensor = 17
   PIR = 22
*/


char tempString[8];
char humString[8];
char fahrString[8];


WiFiClient espClient;
PubSubClient client(espClient);


// Initialize DHT sensor.
DHT dht(DHTPin, DHTTYPE);

void setup() {

  Serial.begin(115200);
  WiFi.begin(ssid, password);

  dht.begin();


  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("Connected to the WiFi network");

  client.setServer(mqttServer, mqttPort);

  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");

    if (client.connect("ESP32Client", mqttUser, mqttPassword )) {

      Serial.println("connected");

    } else {

      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);

    }
  }

  client.publish("esp/test", "Hello from ESP32");

}

void loop() {
  delay(5000);
  // Read temperature in celsius
  float temperature = dht.readTemperature();
  // Read temperature as fahrenheit
  float fahrenheit = dht.readTemperature(true);
  // Read humidity
  float humidity = dht.readHumidity();

  //light sensor:
  int lightValue = analogRead( InPin );

  Serial.println("Light Value: " + String(lightValue));


  float hic = dht.computeHeatIndex(temperature, humidity, false);
  Serial.print("Humidity: "); Serial.print(humidity); Serial.print(" %\t"); Serial.print("Temperature: ");
  Serial.print(temperature); Serial.print(" *C \t"); Serial.print("Heat index: "); Serial.print(hic); Serial.print(" *C \n");
  if (!isnan(humidity) && !isnan(temperature) & !isnan(fahrenheit)) {
    Serial.printf("\n Humidity: %.2f , Temperature: %.2fC, %.2fF , ", humidity, temperature, fahrenheit);
    Serial.printf("\n LightSensor: %d , ", lightValue);


    // Convert the value to a char array
    //    dtostrf(temperature, 4, 2, tempString);
    //    dtostrf(fahrenheit, 4, 2, fahrString);
    //    dtostrf(humidity, 4, 2, humString);
    val = digitalRead(pirPin);
    //low = no motion, high = motion
    if (val == LOW)
    {
      Serial.println("No motion");
    }
    else
    {
      Serial.println("Motion detected  ALARM");
    }

    String json =
      "{"
      "\"celsius\": \"" + String(temperature) + "\","
      "\"fahrenheit\": \"" + String(fahrenheit) + "\","
      "\"humidity\": \"" + String(humidity) + "\","
      "\"lightSensor\": \"" + lightValue + "\"}";

    // Convert JSON string to character array
    char jsonChar [100];
    json.toCharArray(jsonChar, json.length() + 1);

    // Publish JSON character array to MQTT topic
    client.publish("esp/data/", jsonChar);
    delay(1000);

  }


}
