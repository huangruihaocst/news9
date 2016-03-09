var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/newsdb';
var request = require("request");

/**
 * Created by Alex Wang on 16-3-8.
 */

/* 这些函数是应该写在服务端的 */
var keyword = '清华';
var api_key = '606ef48abce1cb59a5694142d87a64df';

var insertDocument = function(db, object, callback) {

};

function saveToDatabase(objects) {
    MongoClient.connect(url, function(err, db) {
        db.collection('news').insertMany(objects, function (err, result) {
            assert.equal(err, null);
            console.log("Inserted a document into the news collection.");
            db.close();
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
                uri: "http://apis.baidu.com/songshuxiansheng/real_time/search_news?keyword=" + keyword,
                method: "test",
                headers: { 'apikey': api_key }
            }, function(err, _, response) {
                var news = JSON.parse(response);
                var raw = news['retData']['data'];//array
                var content = [];
                for(var i = 0;i < raw.length; ++i){
                    var map = {//new Map();
                        'source': '松鼠先生',
                        'title': raw[i]['title'],
                        'date': raw[i]['datetime'],
                        'description': raw[i]['abstract'],
                        'url': raw[i]['url'],
                        'image': raw[i]['image_url']
                    };
                    content.push(map);
                }
                callback(content);
            });
            break;
        case 'show':
            $.ajax({
                url: "http://apis.baidu.com/showapi_open_bus/channel_news/search_news?title=" + keyword,
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('apikey', api_key);},
                success: function(data) {
                    var news = JSON.parse(data);
                    var raw = news['showapi_res_body']['pagebean']['contentlist'];//array
                    var content = [];
                    for(var i = 0;i < raw.length; ++i){
                        var map = new Map();
                        map.set('source', 'show');
                        map.set('title', raw[i]['title']);
                        map.set('date', raw[i]['pubdate']);
                        map.set('description', raw[i]['desc']);
                        map.set('url', raw[i]['link']);
                        map.set('image', raw[i]['imageurls']['url']);
                        content.push(map);
                    }
                    callback(content);
                }
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
var queryString = "清华";
var sources = ['松鼠先生'/*, 'show'*/];
for(var i = 0; i < sources.length; ++i){
    queryFrom(sources[i], queryString, function(result) {
        saveToDatabase(result);
    });
}