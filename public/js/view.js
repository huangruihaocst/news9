/**
 * Created by huangruihao on 16-3-7.
 */

var siteMap = [
    [/qq\.com/, "腾讯"],
    [/weixin/, "微信"],
    [/sina/, "新浪"],
    [/toutiao\.com/, "今日头条"]
];

function sourceAnalyzer(url) {
    var fragments = url.split("/");
    if (fragments.length >= 3) {
        var host = fragments[2];
        for (var i = 0; i < siteMap.length; ++i) {
            var match = host.match(siteMap[i][0]);
            if (match) {
                return siteMap[i][1];
            }
        }
    }
    return "Internet";
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
                var media = sourceAnalyzer(url);

                var img = "<img src=\"" + image + "\"/>";
                var html = "<li><div><a href=\"" +
                    url + "\">" + "(来自: " + media + ") " + title + "</a></div></li>";
                content_list.append(html);
            }
        }
    });
});