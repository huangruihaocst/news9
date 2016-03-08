var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/newsdb';

var insertDocument = function(db, callback) {
    var title = "title";
    var source = "source";
    var description = "description";
    var date = "date";
    var url = "http://www.baidu.com";
    db.collection('news').insertOne({
        "title": title,
        "source": source,
        "description": description,
        "date": date,
        "url": url
    }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the restaurants collection.");
        callback();
    });
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertDocument(db, function() {
        db.close();
    });
});