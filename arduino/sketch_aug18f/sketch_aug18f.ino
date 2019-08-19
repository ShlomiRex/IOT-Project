#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ArduinoHttpClient.h>
#include <Arduino.h>
const char* ssid     = "wifi-ssid"; // Your WiFi ssid
const char* password = "wifi-password"; //Your Wifi password
/* Get this secret key from the wia dashboard, in the `configuration` tab
    for your device. It should start with `d_sk` */
const char* device_secret_key = "your-device-secret-key";
// Wia API parameters
char server[] = "api.wia.io";
char path[] = "/v1/events";
char statePath[] = "/v1/devices/me";
int port = 80;
WiFiClient client;
int status = WL_IDLE_STATUS;
StaticJsonDocument<200> jsonBuffer;
HttpClient httpClient = HttpClient(client, server, port);
JsonObject& root = jsonBuffer.to<JsonObject>();
String response;
int statusCode = 0;
int BUTTON = 0;
int SENSOR = 13;
boolean buttonState = HIGH;
boolean buttonDown = false;
boolean stateAlarm = LOW;
long motion = LOW;
String dataStr = "";
String stateStr = "";
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(BUTTON, INPUT);
  pinMode(SENSOR, INPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  // initialize serial communications and wait for port to open:
  Serial.begin(115200);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  WiFi.begin(ssid, password);
  Serial.print("Attempting to connect to SSID: ");
  Serial.print(ssid);
  // attempt to connect to WiFi network:
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    // Connect to WPA/WPA2 network. Change this line if using open or WEP  network:
    // wait 5 seconds for connection:
    delay(5000);
  }
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Connected");
}
// Thing function runs continiously
void loop() {
  buttonState = digitalRead(BUTTON);
  if (buttonState == LOW && stateAlarm == LOW) {
    if (buttonDown == false) {
      buttonDown = true;
      Serial.println("Alarm on!");
      stateAlarm = HIGH;
      digitalWrite(LED_BUILTIN, LOW);
      updateStateWia(stateAlarm);
      delay(750);
    }
  }
  else if (buttonState == LOW && stateAlarm == HIGH) {
    if (buttonDown == false) {
      buttonDown = true;
      stateAlarm = LOW;
      digitalWrite(LED_BUILTIN, HIGH);
      Serial.println("Alarm off!");
      updateStateWia(stateAlarm);
      delay(750);
    }
  }
  else {
    buttonDown = false;
  }
  if (stateAlarm == HIGH) {
    motion = digitalRead(SENSOR);
    //Serial.println(String(motion));
    if (motion == HIGH) {
      Serial.println("Motion Detected!");
      root["name"] = "motion";
      root["data"] = String(motion);
      sendToWia(root);
      delay(2000);
    }
  }
}
void updateStateWia(boolean& state) {
  if (state == HIGH) {
    stateStr = "{\"state\": {\"enabled\": true}}";
  }
  else {
    stateStr = "{\"state\": {\"enabled\": false}}";
  }
  Serial.println(stateStr);
  httpClient.beginRequest();
  httpClient.put(statePath);
  httpClient.sendHeader("Content-Type", "application/json");
  httpClient.sendHeader("Content-Length", stateStr.length());
  httpClient.sendHeader("Authorization", "Bearer "  + String(device_secret_key));
  httpClient.beginBody();
  httpClient.print(stateStr);
  httpClient.endRequest();
}
// Adds the correct headers for HTTP and sends Data to Wia
void sendToWia(JsonObject& data) {
  dataStr = "";
  serializeJson(data, dataStr);
  httpClient.beginRequest();
  httpClient.post(path);
  httpClient.sendHeader("Content-Type", "application/json");
  httpClient.sendHeader("Content-Length", dataStr.length());
  httpClient.sendHeader("Authorization", "Bearer "  + String(device_secret_key));
  httpClient.beginBody();
  httpClient.print(dataStr);
  httpClient.endRequest();
}#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ArduinoHttpClient.h>
#include <Arduino.h>
const char* ssid     = "wifi-ssid"; // Your WiFi ssid
const char* password = "wifi-password"; //Your Wifi password
/* Get this secret key from the wia dashboard, in the `configuration` tab
    for your device. It should start with `d_sk` */
const char* device_secret_key = "your-device-secret-key";
// Wia API parameters
char server[] = "api.wia.io";
char path[] = "/v1/events";
char statePath[] = "/v1/devices/me";
int port = 80;
WiFiClient client;
int status = WL_IDLE_STATUS;
StaticJsonDocument<200> jsonBuffer;
HttpClient httpClient = HttpClient(client, server, port);
JsonObject& root = jsonBuffer.to<JsonObject>();
String response;
int statusCode = 0;
int BUTTON = 0;
int SENSOR = 13;
boolean buttonState = HIGH;
boolean buttonDown = false;
boolean stateAlarm = LOW;
long motion = LOW;
String dataStr = "";
String stateStr = "";
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(BUTTON, INPUT);
  pinMode(SENSOR, INPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  // initialize serial communications and wait for port to open:
  Serial.begin(115200);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  WiFi.begin(ssid, password);
  Serial.print("Attempting to connect to SSID: ");
  Serial.print(ssid);
  // attempt to connect to WiFi network:
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    // Connect to WPA/WPA2 network. Change this line if using open or WEP  network:
    // wait 5 seconds for connection:
    delay(5000);
  }
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Connected");
}
// Thing function runs continiously
void loop() {
  buttonState = digitalRead(BUTTON);
  if (buttonState == LOW && stateAlarm == LOW) {
    if (buttonDown == false) {
      buttonDown = true;
      Serial.println("Alarm on!");
      stateAlarm = HIGH;
      digitalWrite(LED_BUILTIN, LOW);
      updateStateWia(stateAlarm);
      delay(750);
    }
  }
  else if (buttonState == LOW && stateAlarm == HIGH) {
    if (buttonDown == false) {
      buttonDown = true;
      stateAlarm = LOW;
      digitalWrite(LED_BUILTIN, HIGH);
      Serial.println("Alarm off!");
      updateStateWia(stateAlarm);
      delay(750);
    }
  }
  else {
    buttonDown = false;
  }
  if (stateAlarm == HIGH) {
    motion = digitalRead(SENSOR);
    //Serial.println(String(motion));
    if (motion == HIGH) {
      Serial.println("Motion Detected!");
      root["name"] = "motion";
      root["data"] = String(motion);
      sendToWia(root);
      delay(2000);
    }
  }
}
void updateStateWia(boolean& state) {
  if (state == HIGH) {
    stateStr = "{\"state\": {\"enabled\": true}}";
  }
  else {
    stateStr = "{\"state\": {\"enabled\": false}}";
  }
  Serial.println(stateStr);
  httpClient.beginRequest();
  httpClient.put(statePath);
  httpClient.sendHeader("Content-Type", "application/json");
  httpClient.sendHeader("Content-Length", stateStr.length());
  httpClient.sendHeader("Authorization", "Bearer "  + String(device_secret_key));
  httpClient.beginBody();
  httpClient.print(stateStr);
  httpClient.endRequest();
}
// Adds the correct headers for HTTP and sends Data to Wia
void sendToWia(JsonObject& data) {
  dataStr = "";
  serializeJson(data, dataStr);
  httpClient.beginRequest();
  httpClient.post(path);
  httpClient.sendHeader("Content-Type", "application/json");
  httpClient.sendHeader("Content-Length", dataStr.length());
  httpClient.sendHeader("Authorization", "Bearer "  + String(device_secret_key));
  httpClient.beginBody();
  httpClient.print(dataStr);
  httpClient.endRequest();
}
