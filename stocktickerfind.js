//modules
var http = require('http');
var fs = require('fs');
var qs = require('querystring');

//mongo setup
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://comp20lxu:comp20passwordheh@cluster0.3fjac.mongodb.net/comp20_stockticker?retryWrites=true&w=majority'

http.createServer(function(req, res) {
    //obtain data
    if (req.url == "/"){
      file = 'stockticker.html';
      fs.readFile(file, function(err, txt) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(txt);
          res.end();
      });
    } else if (req.url == "/stocktickerfind") {
      res.writeHead(200, {'Content-Type': 'text/html'});
      pdata = "";
      req.on('data', data => {
        pdata += data.toString();
      });

      req.on('end', () => {
        pdata = qs.parse(pdata);

        //construct query
        var dataRadio = pdata['radiobtn'];
        var dataInput = pdata['input_data'];
        var theQuery;

        if (dataRadio == "stock") {
            theQuery = {"tickerCode":dataInput};
        } else if (dataRadio == "company"){
            theQuery = {"companyName":dataInput};
        } else {
          console.log("Radio Button Error!");
        }

        //search through Mongo
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
          //check for error
            if (err){
                console.log("Connection error: " + err);
                return;
            }

            //set object
            var dbo = db.db("comp20_stockticker");
            var coll = dbo.collection("companies");

            var resultString = "";

            coll.find(theQuery).toArray(function(err, items) {
              if (err) {
                console.log("Error: " + err);
              } else if (items.length == 0){
                res.write("No results found!");
                res.end();
              } else {
                for (i = 0; i < items.length; i++) {
                  resultString += items[i].companyName + " - "
                  resultString += items[i].tickerCode;
                  resultString += "<br>";
                }

                res.write(resultString);
                res.end();
              }
              db.close();
            });
        });
      });
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write("Unknown page request");
      res.end();
    }
}).listen(3000);
