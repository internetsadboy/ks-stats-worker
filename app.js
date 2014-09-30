'use strict';

var methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    mongoose = require('mongoose'),
    express = require('express');


var app, port;

app = express();

mongoose.connect('mongodb://localhost/ksDataTotals');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/', routes.root);
app.use('/poll', routes.poll);

port = process.env.PORT || 8006;

app.listen(port, function () {
  console.log('listening on port', port);
});
