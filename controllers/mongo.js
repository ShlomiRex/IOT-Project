//mongo.js
const mongoose = require('mongoose');
const conf = require('../config/database')
const sensor = require("./models/sensor")
const mongo = require('mongodb')
const MongoClient = require('mongodb').MongoClient;

mongoose.connect(conf.url, {useNewUrlParser: true});


function random_sensor_data() {
	var timestamp = randomDate(10, 20);
	//console.log(timestamp)
	var temp = 20 + Math.floor(Math.random()*(45-20));
	var humid = 0 + Math.floor(Math.random()*(100-0));
	var light = 20 + Math.floor(Math.random()*(100-20));
	var pir = 0 + Math.random()*(1-0);

	var sensor_data = new sensor.Sensor({
		timestamp: timestamp,
		temp: temp,
		humid: humid,
		light: light,
		pir: pir
	});

	console.log(sensor_data)
	return sensor_data;

	
}


function insert_random_data() {
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	

	var jsons = []
	for(var i = 0; i < 100; i++) {
		jsons.push(random_sensor_data());
	}

	db.once('open', function() {
		sensor.Sensor.collection.insert(jsons, (err, res)=> {
			if(err) throw err;
			else console.log("Successful")
		});
	});
}

function random_floor_number(start, end) {
	if(start > end) throw "ERR: end is less than start";
	return Math.floor(start+Math.random()*(end-start))
}

/**
 * Get random date between start and end
 * @param {number} start 
 * @param {number} end 
 */
function randomDate(start, end) {
	var date = new Date();
	date.setDate(start + Math.random() * (end - start))
	return date;
}


/*
const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));

function save_sensor_data(json) {
	mongoose.connect(conf.url, {useNewUrlParser: true});

}
*/
module.exports = {
	mongoose, MongoClient
};

//insert_random_data();