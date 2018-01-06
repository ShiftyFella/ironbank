var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tellerSchema = new Schema({
    login: {type: String, unique: true, required: true},
    password: {type: String, unique: true, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    clients: [{type: Schema.ObjectId, ref: 'Client'}]
});

var Teller = mongoose.model('Teller', tellerSchema);

module.exports = Teller;