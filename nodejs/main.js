var express = require('express');
var app = express();
var url = require("url");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongoUrl = 'mongodb://localhost:27017/newsdb';

var findNews = function(db, query, callback) {
    var cursor = db.collection('news').find();
    var rows = [];
    cursor.each(function(err, item) {
        assert.equal(err, null);
        if (item != null) {
            console.log(item);
            rows.push(item);
        } else {
            callback(rows);
        }
    });
};

app.get('/news', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'x-application/json'
    });
    var params = url.parse(req.url, true).query;
    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        findNews(db, params, function(rows) {
            res.end(JSON.stringify(rows));
        });
    });
});

app.listen(3000, function () {
    console.log('server listening on port 3000!');
});
