/*
Author: April Hudspeth
Class: Web API Technologies 3800
Assignment 4: create a proxy that interacts with a BaaS 
File: hw4.js
*/
var usergrid = require('usergrid');
var express = require('express');
var app = express();
var request = require("request");
var S = require('string');
var _ = require('underscore');
var async = require('async');
var count = 0;
var client = new usergrid.client({
    orgName:'arainh',
    appName:'sandbox',
  
});

/*Queries the Apigee BaaS 
* EXAMPLE QUERY: 
* if GET request is 127.0.0.1:3000/?ql=select * where name = 'Xmen'
* then simply query the movie collection. 
* if GET request is 127.0.0.1:3000/?ql=select * where name = 'Xmen'&reviews=true
* then query the movie and reviews collection and display both queries.
*/
app.get('/', function (req, res) {
  count += 1;
  if(S(req.originalUrl).contains('reviews=true'))
  {
    
    async.parallel([
    /*
     * First external endpoint
     * Make a request to the movie collection
     */

    //query the movie name
    function(callback) {
      var url = "https://api.usergrid.com/arainh/sandbox/movies" + req.originalUrl;
      request(url, function (err, response, body) {
        // JSON body
        if(err) { console.log(err); callback(true); return; }
        obj = JSON.parse(body);
        callback(false, obj);
      });
    },
    /*
     * Second external endpoint
     * Make a request to the reviews collection
     */
      //query the review with corresponding movie name
    function(callback) {
      var url = "https://api.usergrid.com/arainh/sandbox/reviews" +  req.originalUrl;
        request(url, function (err, response, body) {
        // JSON body
        if(err) { console.log(err); callback(true); return; }
        obj = JSON.parse(body);
        callback(false, obj);
      });
    },
  ],
  /*
   * Collate results
   * Attach the json body with the movie and the review json body 
   * and display them together
   */
  function(err, results) {
    if(err) { console.log(err); res.send(500,"Server Error"); return; }
    res.send({api1:results[0], api2:results[1]});
    console.log(count);
  }
  );
}
else {

  //If reviews=true is not present then just do a normal query on the movies collection
  var options = {
    url: "https://api.usergrid.com/arainh/sandbox/movies" + req.originalUrl
  };

//Query just the movie without the reviews attached
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    res.send(info);
  }
}
request(options, callback);

}
});


app.listen(3000);
console.log("server running on localhost:3000");