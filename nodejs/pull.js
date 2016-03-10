/**
 * Created by Alex Wang on 16-3-8.
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/newsdb';
var request = require("request");
var Queue = require("bull");
var sleep = require("sleep");

var api_key = '606ef48abce1cb59a5694142d87a64df';

function saveToDatabase(objects, callback) {
    MongoClient.connect(url, function(err, db) {
        db.collection('news').insertMany(objects, function (err, result) {
            if (err == null) {
                console.log("Inserted " + objects.length + " items into the news collection.");
                db.close();
                if (callback) {
                    callback(true);
                }
            }
            else {
                console.log("Failed to insert!");
                if (callback) {
                    callback(false);
                }
            }
        });
    });
}

function queryFrom(source, queryString, callback) {
    // 这里写从真正的数据源获取数据, 并且统一成如下的数据格式
    // { "source": "sogou", "title": "xxx", "date": "20150101", "description": "xxx", "url": "http://www.baidu.com",
    // "image":"xxx"}
    switch (source) {
        /* TODO 从某个API获取数据, 转换成以上格式并且调用callback(data) */
        case '松鼠先生':
            request({
                uri: "http://apis.baidu.com/songshuxiansheng/real_time/search_news?keyword=" + escape(queryString),
                headers: { 'apikey': api_key }
            }, function(err, _, response) {
                var news = JSON.parse(response);
                var raw = news['retData']['data'];//array
                var content = [];
                for(var i = 0;i < raw.length; ++i){
                    var object = {
                        'source': '松鼠先生',
                        'title': raw[i]['title'],
                        'date': raw[i]['datetime'],
                        'description': raw[i]['abstract'],
                        'url': raw[i]['url'],
                        'image': raw[i]['img_url']
                    };
                    content.push(object);
                }
                callback(content);
            });
            break;
        case 'show':
            request({
                uri: "http://apis.baidu.com/showapi_open_bus/channel_news/search_news?title=" + queryString,
                headers: {'apikey': api_key }
            },function(err, _, data) {
                var news = JSON.parse(data);
                var raw = news['showapi_res_body']['pagebean']['contentlist'];//array
                var content = [];
                for(var i = 0;i < raw.length; ++i){
                    var object = {
                        'source': 'show',
                        'title': raw[i]['title'],
                        'date': raw[i]['pubdate'],
                        'description': raw[i]['desc'],
                        'url': raw[i]['link'],
                        'image': raw[i]['imageurls'].length > 0 ? raw[i]['imageurls'][0]['url'] : null
                    };
                    content.push(object);
                }
                callback(content);
            });
            break;
        default: // 从所有数据源获取数据
            // 这里json/news.json是模拟一个数据源
            //$.get("json/news.json", function(data, status) {
            //    // 从真正数据源获取完数据
            //    callback(data);
            //});
    }
}

function startPulling(callback) {
    var queryString = "清华";
    var sources = [/*'松鼠先生',*/ 'show'];
    for (var i = 0; i < sources.length; ++i) {
        queryFrom(sources[i], queryString, function (result) {
            saveToDatabase(result, callback);
        });
    }
}
exports.start = function() {
    var puller = Queue("puller", 6379, "127.0.0.1");
    puller.process(function(job, done) {
        startPulling(function() {
            puller.add({}, { delay: 10 * 1000 });
            done();
        });
    });
    puller.add();
    console.log("pulling started");
};
exports.start();