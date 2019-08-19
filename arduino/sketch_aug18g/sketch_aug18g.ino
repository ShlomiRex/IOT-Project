//#include <Wire.h>
//#include "SSD1306Wire.h"
//// Initialize the OLED display using Wire library
//SSD1306Wire display(0x3c, 5,4);
//int oldValue = 0;
//void setup() {
//pinMode(16, INPUT_PULLUP);
//Serial.begin(115200);
//
//display.init(); // Initialising the UI will init the display too
//display.flipScreenVertically();
//display.setFont(ArialMT_Plain_16);
//}
//// REMEMBER there is 2 Sec Delay for state change
//void loop() {
//int value = digitalRead(16);
//if (value != oldValue) {
//display.clear();
//display.setTextAlignment(TEXT_ALIGN_LEFT);
//Serial.println("New Value: " + String(value));
//oldValue = value;
//if (value == 1)
//Serial.println( "Motion Detected" );
//else
//Serial.println( "No Motion" );
//}
//delay(100);
//}
int pirPin = 16;
int val;
 
void setup()
{
Serial.begin(9600);
}
 
void loop()
{
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
 
delay(2000);
}
