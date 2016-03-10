var express = require('express');
var app = express();
var url = require("url");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongoUrl = 'mongodb://localhost:27017/newsdb';
//var Puller = require('./pull.js');

var findNews = function(db, params, callback) {
    if (params['keywords']) {
        var keywords = JSON.parse(unescape(params['keywords']));
        console.log(keywords);
    }

    var cursor = db.collection('news').find();
    var rows = [];
    cursor.each(function(err, item) {
        assert.equal(err, null);
        if (item != null) {
            //console.log(item);
            rows.push(item);
        } else {
            callback(rows);
        }
    });
};

app.get('/api/news', function (request, respond) {
    respond.writeHead(200, {
        'Content-Type': 'x-application/json'
    });
    var params = url.parse(request.url, true).query;
    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        findNews(db, params, function(rows) {
            respond.end(JSON.stringify(rows));
        });
    });
});

//Puller.start();

app.listen(3000, function () {
    console.log('server listening on port 3000!');
});
