var createError = require('http-errors');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const port = 8080;

MongoClient.connect("mongodb://root:root@ds221339.mlab.com:21339/nodeapi", (err, database) => {
    if (err) return console.log(err)

    require('./app/routes')(app, database)
    app.listen(port, () => {
        console.log('Running live on port ' + port);
    });

});