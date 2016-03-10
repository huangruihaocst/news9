var express = require('express');
var app = express();
var url = require("url");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongoUrl = 'mongodb://localhost:27017/newsdb';
//var Puller = require('./pull.js');

var findNews = function(db, params, callback) {
    var query = {};
    if (params['keywords']) {
        try {
            var keywords = JSON.parse(unescape(params['keywords']));
            var str = keywords.map(function (x) {
                return "(" + x.replace(/\.|\*|\$|\(|\)/, "") + ")"
            }).join("|");
            query['title'] = new RegExp(str);
        }
        catch (exception) {
            console.log(exception);
        }
    }

    var cursor = db.collection('news').find(query);
    var rows = [];
    cursor.each(function(err, item) {
        assert.equal(err, null);
        if (item != null) {
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
