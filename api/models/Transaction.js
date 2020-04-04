const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: [ true, 'Missing text field, please add some text']
    },
    amount: {
        type: Number,
        required: [ true, 'Missing amount field, please add a positive o negative number']
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction',TransactionSchema);
