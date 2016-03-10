/**
 * Created by huangruihao on 16-3-7.
 */

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

$(document).ready(function(){
    var keyword = "thu";
    var media = "";
    var date = "";
    var queryString = [keyword, media, date].join(" ");
    $.ajax({
        type: "GET",
        url: "/api/news",
        crossDomain : true,
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            var content_list = $("#content_list");
            for (var i = 0; i < result.length; ++i) {
                var item = result[i];
                // TODO 这里可以修改从而美化界面, 可用的字段在server.js可以找到
                var url = item.url;
                var title = item.title;
                var image = item.image;
                var date = item.date;
                var description = item.description;
                console.log(image);
                var media = sourceAnalyzer(url);
                var source = item.source;
                if(source == '松鼠先生' || source == 'show'){
                    source = media;
                }

                var img = "<img src=\"" + image + "\"/>";
                var html = "<div style='margin-top: 100px;margin-bottom: 100px'><a href=\"" +
                    url + "\">" + title + "</a><p class='text-info'>" + source + "   " + date + "</p><p class='text-muted'>" +
                    description + "</p><img src=\""+ image + "\" onerror=\"this.onerror=null;this.src='alt.jpg'\"/></li></div>";
                content_list.append(html);
            }
        }
    });
});