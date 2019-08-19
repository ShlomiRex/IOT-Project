void setup() {
  // put your setup code here, to run once:

#include <Wire.h>
#include "SSD1306Wire.h" // legacy include: `#include "SSD1306.h"`
#include "DHT.h"
#define DHTPIN 12 // what digital pin we're connected to
#define DHTTYPE DHT11 // DHT 11// Uncomment whatever type you're using!
//#define DHTTYPE DHT22
/// Initialize the OLED display using Wire library
SSD1306Wire display(0x3c, 5,4);
// Initialize DHT sensor.
// as the current DHT reading algorithm adjusts itself to work on faster procs.
DHT dht(DHTPIN, DHTTYPE);
void setup() {
Serial.begin(115200);
Serial.println("DHTxx test!");
dht.begin();
display.init();
display.flipScreenVertically();
display.setFont(ArialMT_Plain_16);
}
void loop() {
// Wait between measurements.
delay(1000);
// Reading temperature or humidity takes about 250 milliseconds!
// Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
float h = dht.readHumidity();
// Read temperature as Celsius (the default) and as Fahrenheit (isFahrenheit = true)
float t = dht.readTemperature();
float f = dht.readTemperature(true);
// Check if any reads failed and exit early (to try again).
if (isnan(h) || isnan(t) || isnan(f)) {
Serial.println("Failed to read from DHT sensor!"); return; }
// Compute heat index in Celsius (isFahreheit = false)
float hic = dht.computeHeatIndex(t, h, false);
Serial.print("Humidity: "); Serial.print(h); Serial.print(" %\t"); Serial.print("Temperature: ");
Serial.print(t); Serial.print(" *C \t"); Serial.print("Heat index: "); Serial.print(hic); Serial.print(" *C ");
}
