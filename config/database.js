
const db_name = "iot";
var url = "mongodb://localhost:27017/"+db_name;
var sensors_collection= "esp_sensors";

module.exports = {
    url, sensors_collection, db_name

};