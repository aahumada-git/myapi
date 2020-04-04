const express = require('express');
const bodyParser = require('body-parser')

const colors = require('colors');
const morgan = require('morgan');

// dotenv.config({path: './config/config.env'});

const connectDB = require('./db');

const app = express();

connectDB();

app.use(bodyParser.json());

const auth = require('./routes/auth');
const transactions = require('./routes/transactions');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get('/api/v1/test', (req, res) => {res.send('API is Alive!!!')}); // TEST Tx

app.use('/api/v1/auth', auth);
app.use('/api/v1/transactions', transactions);

console.log(`Server running in ${process.env.NODE_ENV} mode`.yellow.bold)

// NOW Serverless Function
module.exports = app

// NODE.JS API
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));