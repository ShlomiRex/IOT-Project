# MQTT default configurations

ESP sends data to MQTT topic of "esp/sensors"

Info:
Please note the '/' in the name of the topic. It's called Topic Seperator. Like a directory it divides topics to sub topics / cluster of topics.

# MongoDB Configurations

ESP Data is saved in "iot" database, inside "esp_sensors" collection.

# Sensors
1) Moisture, Humidity
2) Light
3) PIR (Movement sensor)

# Sensors Data Model - JSON Scheme
Database: iot
Collectiom: sensors
```
{
    timestamp : Date,
    temp: Number,
    humid: Number,
    light: Number,
    pir: Number
}
```