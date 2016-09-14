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

app.get('/scrape', function(req, res){
    request('http://www.gizmodo.com/', function(err, response, html){
        var $ = cheerio.load(html);

        console.log($);

        $('h1.headline').each(function(i, element){
            var title =$(element).text();

            var link = $(element).children('a').attr('href');

            var result = {};

            result.title = title;

            result.link = link;

            var articleEntry = new Article(result);

            articleEntry.save(function(err, doc){
                if(err){ 
                    throw err;
                } else {
                    console.log(doc);
                }
            });
    });
    
});
res.send('Scrapped that up');
});

app.get('/articles', function(req, res){
    Article.find({}, function(err, doc){

        if (err){
            throw err;
        } else {
            res.json(doc);
        }
    });
});

app.get('/article:id', function(req, res){
    Article.findOne({'_id': req.params.id})

    .populate('note')

    .exec(function(err, doc){
        if(err){
            throw err;
        } else {
            res.json(doc);
        }
    });
});

app.post('article/:id', function(req, res){
    var freshNote = new Note(req.body);

    freshNote.save(function(err, doc){
        if (err){
            throw err;
        } else {

            Article.findOne({'_id':req.params.id}, {'note': doc._id})

            .exec(function(err, doc){
                if(err){
                    throw err;
                } else {
                    res.send(doc);
                }
            })
        }
    })
})

app.listen(3000, function(){
    console.log("app is up and running on port 3000!");
})