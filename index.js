//PRE REQUISITES
var mongoose = require('mongoose');
var restify = require('restify');

//Database models
var Tellers = require("./models/Teller");
var Clients = require("./models/Client");

//connection string for hosted MongoDB
var mongoDB = 'mongodb://ironmin:ironbankdatabasetest@cluster0-shard-00-00-itnt9.mongodb.net:27017,cluster0-shard-00-01-itnt9.mongodb.net:27017,cluster0-shard-00-02-itnt9.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

//SERVER INFO CONFIG
var SERVER_NAME = 'ironbank-api';
var PORT = 8000;
var HOST = '127.0.0.1';

// Create the restify server
server = restify.createServer({ name: SERVER_NAME });

//Connect to Hosted DB
mongoose.connect(mongoDB, {useMongoClient: true});
var db = mongoose.connection; //store Database connection

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    //IF DB Connection succesfull start server at predifined parametrs
    server.listen(PORT, HOST, function () {
        console.log("Server stared at %s", server.url);
    });
    console.log("DB Connection established");
});

server
    // Allow the use of POST
    .use(restify.fullResponse())

    // Maps req.body to req.params so there is no switching between them
    .use(restify.bodyParser())


//POST METHODS

//POST add new Teller
server.post('/api/tellers', function (req, res, next) {
    var teller = new Tellers({
        firstName: req.params.firstname,
        lastName: req.params.lastname
    });

    teller.save(function (err) {
        if (err) return handleError(err);
        res.send(201, teller);
    });
    next();
});

//POST add new Client by teller
server.post('/api/:teller_id/clients', function (req, res, next) {
    Tellers.
        findOne({ _id: req.params.teller_id}).
        exec (function (err,tellers) {
            var client1 = new Clients({
                firstName: req.params.firstname,
                lastName: req.params.lastname,
                currentAddress: " ",
                teller: req.params.teller_id
            });

            client1.save(function (err) {
                if (err) {
                    console.log(err);
                    console.log(client1);
                    console.log(tellers);
                    return handleError(err);
                }

                res.send(201,client1);
            });
        });
    next();

});

//POST add new transaction
server.post('/api/clients/:client_id/transactions', function (req, res, next) {
    //Clients.
    //    findOne({ _id: req.params.client_id}).
    //    exec (function (err, client) {
    //        var transaction = new {
    //            _id: new mongoose.Types.ObjectId(),
    //            transactionName: req.params.transaction_name,
    //            transactionDate: Date.now()
    //        };
    //        client.transactions.push(transaction);
    //        client.save(function (err, newTransaction) {
    //            if (err) return handleError(err);
    //            res.send(201, newTransaction);
    //        });
    //    });

    Clients.findOneAndUpdate({_id: req.params.client_id}, {$push: {"transactions":
        {"_id": new mongoose.Types.ObjectId(),
            "transactionName": req.params.transaction_name,
            "transactionDate": Date.now()}}},
        {new: true},
        function(err, newTR) {
            if (err) return handleError(err);

            res.send(201, newTR);
        });
    next();
});

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