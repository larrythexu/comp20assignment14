//modules
var fs = require('fs');
var readline = require('readline');

//set mongoclient
const MongoClient = require('mongodb').MongoClient;

//set connection string
const url = 'mongodb+srv://comp20lxu:comp20passwordheh@cluster0.3fjac.mongodb.net/comp20_stockticker?retryWrites=true&w=majority'

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
  //check for error
    if (err){
        console.log("Connection error: " + err);
        return;
    }

    //set object
    var dbo = db.db("comp20_stockticker");
    var coll = dbo.collection("companies");

    //read file
    var myFile = readline.createInterface({
      input: fs.createReadStream('companies.csv')
    });

    //loops through each line
    myFile.on('line', function(line) {
      var splitArray = line.split(",");

      var companyName = splitArray[0];
      var tickerCode = splitArray[1];

      var newData = {"companyName": companyName, "tickerCode": tickerCode};

      coll.insertOne(newData, function(err, res) {
          if (err) {
            console.log("Insert error: " + err);
            return;
          }

          console.log("inserted!");
      });
    });
});
