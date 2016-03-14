/**
 * Created by huangruihao on 16-3-7.
 */
var $ = require('jquery');
var API_HOST = 'localhost';//'news.net9.org';
var HTTP_SCHEME = 'http://';
var MAX_SIZE = 128;
var dateFormat = require('dateformat');

var siteMap = [
    [/qq\.com/, "腾讯"],
    [/weixin/, "微信"],
    [/sina/, "新浪"],
    [/toutiao/, "今日头条"],
    [/legaldaily\.com/, "法制网"],
    [/youth/, "中国青年网"],
    [/xinhua/, "新华网"],
    [/sohu/, "搜狐网"],
    [/huanqiu/, "环球网"]
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

function isValid(item){
    var url = item.url;
    var title = item.title;
    var date = item.date;
    var source = item.source;
    return url != null && title != null && date != null && source != null;
}
function initPage() {
    var keyword = "thu";
    var media = "";
    var date = "";
    var queryString = [keyword, media, date].join(" ");
    $.ajax({
        type: "GET",
        url: HTTP_SCHEME + API_HOST + "/api/news",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            var list = $("#list");
            for (var i = 0; i < result.length; ++i) {
                var item = result[i];
                // TODO 这里可以修改从而美化界面, 可用的字段在server.js可以找到
                if (isValid(item)) {
                    var url = item.url;
                    var title = item.title;
                    var image = item.image;
                    var date = item.date;
                    var content = item.description;
                    var media = sourceAnalyzer(url);
                    var source = item.source;
                    if (source == '松鼠先生' || source == 'show') {
                        source = media;
                    }
                    var description = source + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + dateFormat(date, "yyyy-mm-dd, hh:MM:ss");
                    if (source == '松鼠先生' || source == 'show') {
                        source = media;
                    }

                    var html = "<li>" +
                        "<div class='row'>" + "<div class='col-md-9'><a href=\"" + url + "\" target='_blank'><p>" +
                        title + "</p></a><p class='text-info'>" + description + "</p><p class='text-muted'>" +
                        content + "</p></div><div class='col-md-3'>" +
                        "<img class='scaled' onerror='src=\"alt.jpg\";onerror=null;' src='" + image +
                        "'/></div></li>";
                    list.append(html);

                    var scaled = document.getElementsByClassName('scaled');
                    console.log(scaled.length);
                    for (var j = 0; j < scaled.length; ++j) {
                        scaled[j].onload = function () {
                            var width = this.width;
                            var height = this.height;
                            if (width > height) {
                                this.width = MAX_SIZE;
                                this.height = MAX_SIZE * height / width;
                            } else {
                                this.height = MAX_SIZE;
                                this.width = MAX_SIZE * width / height;
                            }
                        }
                    }
                }
            }
        }
    });
}
$(document).ready(function() {
    initPage();
});