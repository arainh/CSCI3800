/*
Author: April Hudspeth
Class: Web API Technologies 3800
Assignment 2: create a node.js server 
File: server.js
*/

var express = require('express');
var app = express();

app.get('/gets', function(req, res){
  
  res.send(res.json(req.headers));
  
})

app.post('/posts', function (req, res){
	
	res.send(res.json(req.headers));
})

app.put('/puts', function (req, res) {
	
	res.send(res.json(req.headers));
})

app.delete('/deletes' , function (req, res) {
	
	res.send(res.json(req.headers));
})

app.listen(3000);
console.log("server running on localhost:3000");

