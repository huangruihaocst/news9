/**
 * Created by Alex Wang on 16-3-8.
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var request = require("request");
var sleep = require("sleep");

TSINGHUA = "清华";
// 假定每页20个, 一共20页
ITEMS_PER_PAGE = 200;
PAGE_COUNT = 20;
DEFAULT_DATE_OFFSET = -2;

var newsdb = 'mongodb://localhost:27017/newsdb';
var api_key_baidu = '606ef48abce1cb59a5694142d87a64df';
var api_key_juhe = '0498f03cf3883cebc38d1bb1ca2fcea3';

function isValidDate(d) {
    if ( Object.prototype.toString.call(d) !== "[object Date]" )
        return false;
    return !isNaN(d.getTime());
}

function parseDateRubust(dateString) {
    var date = new Date(dateString);
    if (isValidDate(date)) {
        return date;
    }
    else {
        date = new Date();
        date.setDate(new Date().getDate() + DEFAULT_DATE_OFFSET);
        return date;
    }
}

function saveSources(objects, callback) {
    MongoClient.connect(newsdb, function(err, db) {
        try {
            var url_sources = [];
            for (var i = 0; i < objects.length; ++i) {
                url_sources.push({
                    name: objects[i].url_source
                });
            }
            db.collection('newsSources').insertMany(url_sources, function (err, result) {
                if (callback) {
                    callback();
                }
                db.close();
            })
        }
        catch (exception) {
            if (typeof exception != 'MongoError') {
                console.log(exception);
            }
        }
    });
}

function saveToDatabase(objects, callback) {
    MongoClient.connect(newsdb, function(err, db) {
        try {
            db.collection('news').insertMany(objects, function (err, result) {
                if (err == null) {
                    console.log("Inserted " + objects.length + " items into the news collection.");
                    db.close();
                    if (callback) {
                        callback(true);
                    }
                }
                else {
                    console.log("Inserted 0 item into the news collection!");
                    if (callback) {
                        callback(false);
                    }
                }
            });
        }
        catch (exception) {
            if (typeof exception != 'MongoError') {
                //console.log(exception);
            }
        }
    });
}

var siteMap = [
    [/qq\.com/, "腾讯"],
    [/weixin/, "微信"],
    [/sina/, "新浪"],
    [/toutiao/, "今日头条"],
    [/legaldaily\.com/, "法制网"],
    [/youth/, "中国青年网"],
    [/xinhua/, "新华网"],
    [/sohu/, "搜狐网"],
    [/huanqiu/, "环球网"],
    [/huaxi100\.com/, "华西新闻"],
    [/thepaper\.cn/, "澎湃"],
    [/asiafinance\.cn/, "亚洲财经"]
];

function matchSiteMap(host){
    for (var i = 0; i < siteMap.length; ++i) {
        var match = host.match(siteMap[i][0]);
        if (match) {
            return siteMap[i][1];
        }
    }
}

function sourceAnalyzer(url) {
    if(!url) {
        return 'Internet';
    }
    var fragments = url.split("/");
    if (fragments.length >= 3) {
        var host = fragments[2];
        var source = matchSiteMap(host);
        if(source == undefined){
            host = fragments[3];
            source = matchSiteMap(host);
        }else{
            return source;
        }
        if(source == undefined)return "Internet";
        else return source;
    }
    return 'Internet';
}

function queryFrom(source, queryString, offset, count, callback) {
    // 这里写从真正的数据源获取数据, 并且统一成如下的数据格式
    // { "source": "sogou", "title": "xxx", "date": "20150101", "description": "xxx", "url": "http://www.baidu.com",
    // "image":"xxx"}
    switch (source) {
        /* TODO 从某个API获取数据, 转换成以上格式并且调用callback(data) */
        case '松鼠先生':
            request({
                uri: "http://apis.baidu.com/songshuxiansheng/real_time/search_news?page=" + offset / count + "&count=" + count + "&keyword=" + encodeURI(queryString),
                headers: { 'apikey': api_key_baidu }
            }, function(err, _, response) {
                try {
                    var news = JSON.parse(response);
                    var raw = news['retData']['data'];//array
                    var content = [];
                    if (!raw) {
                        return;
                    }
                    for(var i = 0;i < raw.length; ++i){
                        var object = { // 2016-03-13 11:49
                            'source': '松鼠先生',
                            'title': raw[i]['title'],
                            'date': parseDateRubust(raw[i]['datetime']),
                            'description': raw[i]['abstract'],
                            'url': raw[i]['url'],
                            'image': raw[i]['img_url'],
                            'url_source': sourceAnalyzer(raw[i]['url'])
                        };
                        if (object.title.indexOf(TSINGHUA) > -1 && object.description.indexOf(TSINGHUA) > -1) {
                            content.push(object);
                        }
                    }
                    callback(content);
                    }
                catch (exception) {
                    console.log(exception);
                }
            });
            break;
        case 'show':
            request({
                uri: "http://apis.baidu.com/showapi_open_bus/channel_news/search_news?title=" + encodeURI(queryString),
                headers: {'apikey': api_key_baidu }
            },function(err, _, data) {
                try {
                    var news = JSON.parse(data);
                } catch (exception) {
                    return;
                }
                var raw = news['showapi_res_body']['pagebean']['contentlist'];//array
                if (!raw) {
                    return;
                }
                var content = [];
                for(var i = 0;i < raw.length; ++i){
                    var object = {
                        'source': 'show',
                        'title': raw[i]['title'],
                        'date': parseDateRubust(raw[i]['pubdate']), // 2015-07-06 16:27:30
                        'description': raw[i]['desc'],
                        'url': raw[i]['link'],
                        'image': raw[i]['imageurls'].length > 0 ? raw[i]['imageurls'][0]['url'] : null,
                        'url_source': sourceAnalyzer(raw[i]['link'])
                    };
                    if (object.title.indexOf(TSINGHUA) > -1 && object.description.indexOf(TSINGHUA) > -1) {
                        content.push(object);
                    }
                }
                callback(content);
            });
            break;
        case '聚合':
            request({
                uri: "http://op.juhe.cn/onebox/news/query?q=" + encodeURI(queryString) +
                '&key=' + api_key_juhe
                //headers: { 'apikey': api_key_baidu }
            }, function(err, _, response) {
                try {
                    var news = JSON.parse(response);

                    var raw = news['result'];//array
                    if (!raw) {
                        return;
                    }
                    var content = [];
                    for(var i = 0;i < raw.length; ++i) {
                        var object = { // 2016-03-14 08:07:00
                            'source': raw[i]['src'],
                            'title': raw[i]['title'],
                            'date': parseDateRubust(raw[i]['pdate_src']),
                            'description': raw[i]['content'],
                            'url': raw[i]['url'],
                            'image': raw[i]['img'],
                            'url_source': sourceAnalyzer(raw[i]['url'])
                        };

                        if (object.title.indexOf(TSINGHUA) > -1 && object.description.indexOf(TSINGHUA) > -1) {
                            content.push(object);
                        }
                    }
                } catch(exception) {
                    console.error(exception);
                    return;
                }
                callback(content);
            });
            break;
        default: // 从所有数据源获取数据
    }
}

function startPulling(callback) {
    var queryString = "清华大学";
    var sources = ['松鼠先生', 'show', '聚合'];
    for (var i = 0; i < sources.length; ++i) {
        for (var j = 0; j < PAGE_COUNT; ++j) {
            queryFrom(sources[i], queryString, ITEMS_PER_PAGE * j, ITEMS_PER_PAGE, function (result) {
                saveSources(result, function() {
                    saveToDatabase(result, callback);
                });
            });
        }
    }
}

var interval = 30 * 1000; // 2 minutes
setInterval(function() {
    startPulling();
}, interval);
startPulling();
