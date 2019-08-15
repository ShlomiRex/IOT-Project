//mongo.js
var url = "mongodb://localhost:27017";
var MongoClient = require('mongodb').MongoClient;

const default_db_name = "big-data";
var random = require("./random"); //For random receipt

function connect(callback) {
  MongoClient.connect(url, function(err, db) { 
    if (err) return callback(err);
    console.log("Connected to MongoDB!");
    callback(false, db.db(default_db_name));
    db.close();
  });
}



//Insert ANY document 
function insert(document) {	

  connect((err, db)=> {
    if(err) throw err;


    db.collection("receipts").insertOne(document, function(err, res) {
			if (err) throw err;
      console.log("1 document inserted");
      
    });
  });

	
}

/*
function insert_random_receipts_to_db(amount) {
  for(var i = 0; i < amount; i++) {
    var receipt = random.random_receipt();
    insert(receipt);
  }
}
*/
/*

function insert_random_receipts_to_db_shoofersal(amount) {
  var receipts = random.random_receipts_shoofersal(amount);
  console.log(receipts.length)
  console.log(receipts)
  //insert(receipt);
}

insert_random_receipts_to_db_shoofersal(2);

*/


//insert_random_receipts_to_db(100); //Use it in a function or somewhere

module.exports = {
    connect, insert
};

