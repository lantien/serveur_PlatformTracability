const express = require('express');
const bodyParser = require('body-parser');
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var helmet = require('helmet');
var https = require('https');
var fs = require('fs');
var privateKey  = fs.readFileSync('certifssl.key', 'utf8');
var certificate = fs.readFileSync('certifssl.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};


// create express app
const app = express();

//set helmet security
app.use(helmet());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.Promise = global.Promise;

var options = {
		keepAlive: 120
		};

// Connecting to the database
mongoose.connect(dbConfig.url, options)
.then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});


// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to plateform facility application."});
});


var apiRoutes = express.Router();
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'shhhhh', function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});
// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);


//ADMIN PART API
	var adminRoutes = express.Router();

	adminRoutes.use(function(req, res, next) {
		// check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, 'shhhhh', function(err, decoded) {
	      if (err) {
	        return res.json({ success: false, message: 'Failed to authenticate token.' });
	      } else if(decoded.admin == 'true'){
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;
	        next();
	      } else if(decoded.admin == 'false') {

					return res.json({ success: false, message: 'You need an admin token.' });
				} else {

					return res.json({ success: false, message: 'Unknown authentification error' });
				}
	    });

	  } else {

	    // if there is no token
	    // return an error
	    return res.status(403).send({
	        success: false,
	        message: 'No token provided.'
	    });

	  }
	});

	app.use('/api/admin', adminRoutes);
//////////////////////////
require('./app/routes/appareils.route.js')(app);
require('./app/routes/user.route.js')(app);
require('./app/routes/emprunt.route.js')(app);
require('./app/routes/projets.route.js')(app);
require('./app/routes/laboratoire.route.js')(app);
require('./app/routes/groupe.route.js')(app);

var httpsServer = https.createServer(credentials, app);

// listen for requests
// httpsServer.listen(8080, "0.0.0.0", () => {
//     console.log("Server is listening on port 8080");
// });

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
