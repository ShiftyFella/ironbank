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