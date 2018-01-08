//PRE REQUISITES
var mongoose = require('mongoose');
var restify = require('restify');

//Database models
var Tellers = require(__dirname + "/models/teller");
var Clients = require(__dirname + "/models/client");

//connection string for hosted MongoDB
var mongoDB = 'mongodb://ironmin:ironbankdatabasetest@cluster0-shard-00-00-itnt9.mongodb.net:27017,cluster0-shard-00-01-itnt9.mongodb.net:27017,cluster0-shard-00-02-itnt9.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

//SERVER INFO CONFIG
var SERVER_NAME = 'ironbank-api';
var PORT = process.env.PORT;
var HOST = 'https://ironbank-test.herokuapp.com';

// Create the restify server
server = restify.createServer({ name: SERVER_NAME });

//Connect to Hosted DB
mongoose.connect(mongoDB, {useMongoClient: true});
var db = mongoose.connection; //store Database connection

server.listen(PORT, function () {
    console.log("Server stared at %s", server.url);
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    //IF DB Connection succesfull start server at predifined parametrs
    console.log("DB Connection established");
});

// Allow the use of POST
        server.use(restify.fullResponse());

    // Maps req.body to req.params so there is no switching between them
    server.use(restify.bodyParser());


//**************** POST METHODS ******************************

//POST add new Teller
server.post('/api/tellers', function (req, res, next) {
    var teller = new Tellers({
        firstName: req.params.firstname,
        lastName: req.params.lastname,
        login: req.params.login,
        password: req.params.password
    });

    teller.save(function (err) {
        if (err) return handleError(err);

        res.send(201, teller);
    });
    next();
});

//POST add new Client by teller
server.post('/api/tellers/:teller_id/clients', function (req, res, next) {
    Tellers.
    findOne({ _id: req.params.teller_id}).
    exec (function (err,tellers) {
        var client1 = new Clients({
            firstName: req.params.firstname,
            lastName: req.params.lastname,
            login: req.params.login,
            password: req.params.password,
            currentAddress: req.params.address,
            contactInfo: {'email': req.params.email, 'telephone': req.params.telephone},
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
    Clients.findOneAndUpdate({_id: req.params.client_id}, {$push: {"transactions":
            {"_id": new mongoose.Types.ObjectId(),
                "transactionName": req.params.transactionName,
                "transactionDate": Date.now()}}},
        {new: true},
        function(err, newTR) {
            if (err) return handleError(err);

            res.send(201, newTR);
        });
    next();
});

//POST auth, return user entity

server.post('api/auth', function (req, res, next) {
    console.log(req.params.account);
    if (req.params.account == 'teller') {
        Tellers.
        findOne({}).
        where('login').equals(req.params.login).
        where('password').equals(req.params.password).
        exec (function (err, teller) {
            res.send(200, teller);
        });
    } else if (req.params.account == 'client') {
        Clients.
        findOne({}).
        where('login').equals(req.params.login).
        where('password').equals(req.params.password).
        exec (function (err, client) {
            res.send(200, client);
        });
    } else {
        res.send(404, req.params);
    }
    next();
});

//******************* GET METHODS **********************

// GET list of Tellers, returns only first and last name
server.get('/api/tellers', function (req, res, next) {
    Tellers.
    find({}).
    select('firstName lastName').
    exec (function (err, tellers) {
        res.send(tellers);
    });
    next();
});

//GET returns teller by id
server.get('/api/tellers/:teller_id', function (req,res, next) {
    Tellers.
    findOne({ _id: req.params.teller_id }).
    select('firstName lastName').
    exec (function (err, teller) {
        res.send(teller);
    });
    next();
});

//GET returns list of clients first and last names for selected teller
server.get('/api/tellers/:teller_id/clients', function (req, res, next) {
    Clients.
    find({ teller: req.params.teller_id}).
    select('firstName lastName').
    exec (function (err, clients) {
        res.send(clients);
    });
    next();
});

//GET returns client info for selected teller
server.get('/api/tellers/:teller_id/clients/:client_id', function (req, res, next) {
    Clients.
    findOne({ _id: req.params.client_id }).
    where('teller').equals(req.params.teller_id).
    //select('firstName lastName currentAddress contactInfo accountStatus').
    exec (function (err, client) {
        res.send(client);
    });
    next();
});

//GET return list of clients that requested to be terminated
server.get('/api/tellers/:teller_id/requests', function (req, res, next) {
    Clients.
    find({}).
    where('teller').equals(req.params.teller_id).
    where('accountStatus').equals("ToBeTerminated").
    select('firstName lastName').
    exec (function (err, clients) {
        res.send(clients);
    });
    next();
});

//get list of all clients
server.get('/api/clients', function (req, res, next) {
    Clients.
    find({}).
    select('firstName lastName').
    exec (function (err, clients) {
        res.send(clients);
    });
    next();
});

//GET client info by id
server.get('/api/clients/:client_id', function (req, res, next) {
    Clients.
    find({ _id: req.params.client_id}).
    populate('teller', 'firstName lastName').
    exec (function (err, client) {
        res.send(client);
    });
    next();
});

//GET returns list of transactions for selected client
server.get('/api/clients/:client_id/transactions', function (req, res, next) {
    Clients.
    find({ _id: req.params.client_id}).
    select('transactions').
    exec (function (err, transactions) {
        res.json(transactions);
    });
    next();
});

//GET returns transaction info for selected transaction from selected client
server.get('/api/clients/:client_id/transactions/:transaction_id', function (req, res, next) {
    Clients.
    findOne({ _id: req.params.client_id}).
    where({'transactions._id': req.params.transaction_id}).
    select('transactions.$').
    exec(function (err, tr) {
        res.send(tr);
    });
    next();
});

//PUT Clients request to terminate his acc
server.put('/api/clients/:client_id', function (req, res, next) {
    Clients.
    findOneAndUpdate({_id: req.params.client_id},
        {$set: {accountStatus: "ToBeTerminated"}},
        {new: true},
        function(err, client){
            if (err) return handleError(err);
            res.send(200, client);
        })
});

//DELETE client that requested to be deleted
server.del('/api/tellers/:teller_id/clients/:client_id', function (req, res, next) {
    Clients.
    findOneAndRemove({ _id: req.params.client_id }).
    where('teller').equals(req.params.teller_id).
    where('accountStatus').equals("ToBeTerminated").
    exec (function (err, client) {
        if (client != null)
            res.send(200, client);
        else
            res.send(204);
    });
    next();
});

module.exports = server;
