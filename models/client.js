var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var clientSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    currentAddress: {type: String, required: true},
    contactInfo: {email: String, telephone: Number},
    tellerInfo: {type: Schema.ObjectId, ref: 'Teller', required: true},
    accountStatus: {type: String, requred: true, enum: ['Active', 'Suspended', 'Pending', 'ToBeTerminated'], default: "Pending"},
    transactions: [{transactionName: String, transactionDate: Date}]
});

var Client = mongoose.model('Client', clientSchema);

module.exports = Client;