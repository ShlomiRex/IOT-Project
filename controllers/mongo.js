//mongo.js
const mongoose = require('mongoose');
const conf = require('../config/database')


const sensor_data_schema = mongoose.Schema({
	sensorName: String,
	sensorTime: Date

});

//console.log(mongoose.SchemaTypes)
/*
const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));

function save_sensor_data(json) {
	mongoose.connect(conf.url, {useNewUrlParser: true});

}
*/
module.exports = {

};