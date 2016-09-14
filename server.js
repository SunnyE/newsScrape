var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('public'));

mongoose.connect('mongodb://localhost/newsScrape');

var db = mongoose.connection;

db.on('error', function(err){
    console.log('there was an error: ', err);
});

db.once('open', function(){

    console.log('connection was successful to mongoDB')
});

var Note = require('./models/Note.js');

var Article = require('./models/Article.js');


app.get('/', function(req, res){
    res.send(index.html);
});

