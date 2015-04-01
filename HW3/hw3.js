//April Hudspeth
//CSCI 3800 Web API Technologies
//Homework Three
//This node.js file creates a server that acts as
//an API proxy between the client and Github's API.
//It has two security paths: /basic and /oauth2 for 
//basic authentication and Oauth2 authentication.
//The /token path generates an access token that the user
//can use to acces the /oauth2 path and get info from Github

var express = require('express');
var basicAuth = require('basic-auth');
var request = require("request");
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var moment = require('moment');
var app = express();
var jwt = require('jwt-simple');
var clientID = { id: 'client_id' };
var secret = 'client_secret';
var expires = moment().add(1, 'days').valueOf();
var genToken = jwt.encode(clientID, secret);

function findByToken(token, fn) {
    
    if (genToken === token) {
      return fn(null, token);
    }
     return fn(null, null);
  }

//used for Oauth2 authentication and bearer tokens being
//passed in by users, requesting authorization
passport.use(new BearerStrategy({}, function(token, done) {
    process.nextTick(function () {
    	findByToken(token, function(err, user) {
        	if (err) { return done(err); }
        	if (!user) { return done(null, false); }
        	return done(null, user);
      		})
    	});
  	}
));

//Initialize the middleware used to create
//and validate a token 
app.use(passport.initialize());


//Basic route only accepts basic authentication,
//requiring a username: "user and password: "pass"
//if the credentials are wrong it returns an unauthorized
//message
app.get('/basic', function(req, res){

  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);

  };

  if (user.name === 'user' && user.pass === 'pass') {
    
  } else {
    return unauthorized(res);
      };

//Once the basic authentication has been
//passed, the server will make a request to
//access Github's api with user info and display
//it in the response body message
var options = {
  	url: 'https://api.github.com/users/arainh',
  	headers: {
    	'User-Agent': 'arainh'
  	}
};
 
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
     res.send(info);
    
  }
}
request(options, callback);
  
})

//User navigates to the /token path which
//will generate an access token with an
//expiration time to be used to access the 
//oauth2 path in retrieving Github's api
app.get('/token', function(req, res){

  res.json({token : genToken,
  		   expires : expires});
})

//This is the /oauth2 path that checks the 
//access token passed through the header. If
//it is correct, it will access Github's api
//site and retrieve user information and display it
//in the response message body.
app.get('/oauth2',
  // Authenticate using HTTP Bearer credentials, with session support disabled.
  passport.authenticate('bearer', { session: false }),
  function(req, res){
    var options = {
    url: 'https://api.github.com/users/arainh',
    headers: {
      'User-Agent': 'arainh'
    }
};
 
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
     res.send(info);
    
  }
}
request(options, callback);
})

app.listen(3000);
console.log("server running on localhost:3000");






 











