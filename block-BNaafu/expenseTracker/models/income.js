var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var incomeSchema = new Schema({
    source: String,
    amount: Number,
    date: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true});

module.exports = mongoose.model('Income', incomeSchema);