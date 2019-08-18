const mongoose = require('mongoose');

const Sensor_Schema = mongoose.Schema({
    timestamp : Date,
    temp: Number,
    humid: Number,
    light: Number,
    pir: Number
});

var Sensor = mongoose.model('Sensor', Sensor_Schema);

module.exports = {
    Sensor

}