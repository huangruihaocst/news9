/**
 * Created by huangruihao on 16-3-7.
 */

$(document).ready(function(){
    queryNews("thu", "", "", function(result) {
        var content_list = $("#content_list");
        for (var i = 0; i < result.length; ++i) {
            var item = result[i];
            // TODO 这里可以修改从而美化界面, 可用的字段在server.js可以找到
            content_list.append("<li><a href=\"" + item.url + "\">(From: " + item.source + ") " + item.title + "</a></li>");
        }
    });
});