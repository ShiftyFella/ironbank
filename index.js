//test DB Connection

var mongoose = require('mongoose');

var mongoDB = 'YOUR-CONN-STRING'; //connection string for hosted MongoDB

mongoose.connect(mongoDB, {useMongoClient: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("DB Connection established");
});