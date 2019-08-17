# MQTT default configurations

ESP sends data to MQTT topic of "esp/sensors"

Info:
Please note the '/' in the name of the topic. It's called Topic Seperator. Like a directory it divides topics to sub topics / cluster of topics.

# MongoDB Configurations

ESP Data is saved in "iot" database, inside "esp_sensors" collection.

# Sensors
1) Moisture
2) 

# Sensors Data Model - JSON Scheme
```
For each sensor, it will generate this json:
{
    timestamp: Date,
    sensor: String,
    value: Number
}

```