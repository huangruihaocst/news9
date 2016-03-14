var express = require('express');
var app = express();
var url = require("url");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongoUrl = 'mongodb://localhost:27017/newsdb';

API_SERVER_PORT = 3000;
DEFAULT_ITEMS_PER_PAGE = 20;

function isValidDate(d) {
    if ( Object.prototype.toString.call(d) !== "[object Date]" )
        return false;
    return !isNaN(d.getTime());
}
var findNews = function(db, params, callback) {
    var query = {};
    if (params['keywords']) {
        try {
            var keywords = JSON.parse(decodeURI(params['keywords']));
            var str = keywords.map(function (x) {
                return "(" + x.replace(/\.|\*|\$|\(|\)/, "") + ")"
            }).join("|");
            query['title'] = new RegExp(str);
        }
        catch (exception) {
            console.log(exception);
        }
    }

    query['date'] = {};
    if (params['startDate']) {
        var startDate = new Date(decodeURI(params['startDate']));
        if (isValidDate(startDate)) {
            query['date']['$gt'] = startDate;
        }
    }
    if (params['endDate']) {
        var endDate = new Date(decodeURI(params['endDate']));
        if (isValidDate(endDate)) {
            query['date']['$lt'] = endDate;
        }
    }
    if (!params['startDate'] && !params['endDate']) {
        delete query['date'];
    }

    var pager = {};
    if (params['offset']) {
        pager['skip'] = parseInt(params['offset']);
        if (isNaN(pager['skip'])) pager['skip'] =  0;
    }
    if (params['count']) {
        pager['limit'] = parseInt(params['count']);
        if (isNaN(pager['limit'])) pager['limit'] =  DEFAULT_ITEMS_PER_PAGE;
    }


    var cursor = db.collection('news').find(query, pager).sort({ date: -1 });
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

app.listen(API_SERVER_PORT, function () {
    console.log('server listening on port 3000!');
});
