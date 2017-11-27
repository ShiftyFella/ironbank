//test DB Connection

// var mongoose = require('mongoose');

// var mongoDB = 'mongodb://localhost/test'; //connection string for hosted MongoDB

// mongoose.connect(mongoDB, {useMongoClient: true});

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log("DB Connection established");
// });

var SERVER_NAME = 'ironbank-api';
var PORT = 8000;
var HOST = '127.0.0.1';

//request counters
var getCounter = 0;
var postCounter = 0;

var restify = require('restify')

    // Create the restify server
    , server = restify.createServer({ name: SERVER_NAME })

    // Get a persistence engine for the clients
    , clientsSave = require('save')('clients')



server.listen(PORT, HOST, function () {
    console.log('Server %s listening at %s', server.name, server.url)
    console.log('Endpoints:')
    console.log(server.url + '/clients')
    console.log(server.url + '/clients/:id')
})

server
    // Allow the use of POST
    .use(restify.fullResponse())

    // Maps req.body to req.params so there is no switching between them
    .use(restify.bodyParser())

// Get all clients in the system
server.get('/clients', function (req, res, next) {
    console.log('>>>' + server.url + '/clients: recieved GET request')

    // Find every entity within the given collection
    clientsSave.find({}, function (error, clients) {

        // Return all of the clients in the system
        console.log('<<<' + server.url + '/clients: sending response')
        res.send(clients)
        getCounter++;
        console.log('Processed request count --> sendGet: ' + getCounter + ', sendPost: ' + postCounter)
    })
})

// Get a particular client by their clients id
server.get('/clients/:id', function (req, res, next) {
    console.log('>>>' + server.url + '/clients:id: recieved GET request')

    // Find a single client by their id within save
    clientsSave.findOne({ _id: req.params.id }, function (error, client) {

        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        if (client) {
            // Send the client if no issues
            console.log('<<<' + server.url + '/clients:id: sending response')
            res.send(client)
            getCounter++;
            console.log('Processed request count --> sendGet: ' + getCounter + ', sendPost: ' + postCounter)
        } else {
            // Send 404 header if the client doesn't exist
            res.send(404)
        }
    })
})

// Create a new client
server.post('/clients', function (req, res, next) {
    console.log('>>>' + server.url + '/clients: recieved POST request')
    // Make sure name is defined
    if (req.params.name === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('name must be supplied'))
    }
    if (req.params.price === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('price must be supplied'))
    }
    var newClient = {
        name: req.params.name,
        price: req.params.price
    }

    // Create the client using the persistence engine
    clientsSave.create(newClient, function (error, client) {

        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send the client if no issues
        console.log('<<<' + server.url + '/clients: sending response')
        res.send(201, client)
        postCounter++;
        console.log('Processed request count --> sendGet: ' + getCounter + ', sendPost: ' + postCounter)
    })
})