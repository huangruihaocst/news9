/**
 * Created by huangruihao on 16-3-7.
 */

$(document).ready(function(){
    var keyword = "thu";
    var media = "";
    var date = "";
    var queryString = [keyword, media, date].join(" ");
    // post /query?str=keyword, 得到一个json即result
    // 正常应该是post, 服务端会调用queryFromXXX, 然后返回一个json, 这里直接调用queryFromXXX了
    var sources = ['松鼠先生', 'show'];
    for(var i = 0;i < sources.length; ++i){
        queryFrom(sources[i], queryString, function(result) {
            var content_list = $("#content_list");
            for (var i = 0; i < result.length; ++i) {
                var item = result[i];
                // TODO 这里可以修改从而美化界面, 可用的字段在server.js可以找到
                var url = item.get('url');
                var source = item.get('source');
                var title = item.get('title');
                content_list.append("<li><a href=\"" +
                    url + "\">(From: " + source + ") " +
                    title + "</a></li>");
            }
        });
    }

});