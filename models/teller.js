var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tellerSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    clients: [{type: Schema.ObjectId, ref: 'Client'}]
});

var Teller = mongoose.model('Teller', tellerSchema);

module.exports = Teller;