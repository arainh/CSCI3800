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
var client = new usergrid.client({
    orgName:'arainh',
    appName:'sandbox',
  
});

//QUERY ENTITIES IN THE COLLECTION
//This will output any query on the movie collection
//usage is passed through as a part of the url.
//Example: Enter 127.0.0.1:3000/movies?ql=select * where name = 'XMen' as a 
//GET request and the results of that query will be returned. 
app.get('/movies', function(req, res){
  
	var options = {
  		url: "https://api.usergrid.com/arainh/sandbox/" + req.originalUrl
  	};

	//Make a get request with the specific query parameters to the
	//Apigee BaaS database and pull up the results as the response.
	function callback(error, response, body) {
  		if (!error && response.statusCode == 200) {
    		var info = JSON.parse(body);
    		res.send(info);
		}
	}
	request(options, callback);
  
})

//CREATE A NEW ENTITY
//creates an new movie entity by passing the parameters through
//the url. Example: 
//127.0.0.1:3000/create?name=Bridesmaids&debut=2011&actors=Kristen Wig, Mya Rudolf, Melissa McCarthy
app.post('/create', function (req, res){
	if(!req.query.name || !req.query.debut || !req.query.actors) {
    	res.send('There was an error in creating the entity.');
  	} else {
  		var options = {
   	 		type: 'movies',
   	 		name: req.query.name,
   	 		debut: req.query.debut,
   	 		actors: req.query.actors,
   	 		getOnExist: true
		};
  	client.createEntity(options, function (err, data) {
    	if (err) {
        	//There was an error in creating the entity
        	res.send('There was an error in creating the entity.')
    	} else {
        	//data will contain raw results from API call
        	//New entity has been added to the collection
        	var options = {
          		url: "https://api.usergrid.com/arainh/sandbox/movies"
        	};

        	//Make a get request with the specific query parameters to the
        	//Apigee BaaS database and pull up the results as the response.
        	function callback(error, response, body) {
          		if (!error && response.statusCode == 200) {
            		var info = JSON.parse(body);
        			res.send(info);
          		}
        	}
        	request(options, callback);
    	}
  	});	
 	}
})

//DELETE AN EXISTING ENTITY
//This will retrieve the entity listed by name and, at which 
//point will delete it from the collection.
app.delete('/delete', function (req, res) {
	var options = {
    	type:'movies',
    	name: req.query.name
   	}
   client.getEntity(options, function(err, movie){
      if (err){
        //error in retrieving entity
        res.send("Could not identify entity");
      } else {
          //Success in retrieving entity
          movie.destroy(function(err){
    	  	if (err){
              	//the entity could not be deleted
        		res.send('There was an error trying to delete entity.');
    		} else {
        		//The entity has been deleted
        		movie = null;
        		var options = {
                	url: "https://api.usergrid.com/arainh/sandbox/movies"
              	};

              	//Make a get request with the specific query parameters to the
              	//Apigee BaaS database and pull up the results as the response.
              	function callback(error, response, body) {
                	if (!error && response.statusCode == 200) {
                  		var info = JSON.parse(body);
                  		res.send(info);
                	}
              	}
              	request(options, callback);
    		}
			});
    	}
	});
})

app.listen(3000);
console.log("server running on localhost:3000");
