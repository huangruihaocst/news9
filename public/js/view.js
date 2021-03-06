/**
 * Created by huangruihao on 16-3-7.
 */

var API_HOST = 'news.net9.org';
var HTTP_SCHEME = 'https://';
var MAX_IMG_SIZE = 128;

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
function dateFormat(dateString) {
    var date = new Date(Date.parse(dateString));
    return date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" +
        date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
}

function getPage(keywords, start, end, sources) {
    var k = '', s = '', e = '';
    if(keywords != undefined){
        k = keywords;
    }
    if (start != undefined && encodeURI(start) != 'Invalid%20Date'){
        s = encodeURI(start);
    }
    if (end != undefined && encodeURI(end) != 'Invalid%20Date'){
        e = encodeURI(end);
    }
    var sources_array = [];
    sources_array.push(sources);
    var sources_json = JSON.stringify(sources_array);
    var attachment = '?keywords=' + k + '&startDate=' + s + '&endDate=' + e + '&sources=' +sources_json;
    $("#list").addClass("_hidden");
    setTimeout(function(){
      $.ajax({
          type: "GET",
          url: HTTP_SCHEME + API_HOST + '/api/news' + attachment,
          crossDomain: true,
          xhrFields: {
              withCredentials: true
          },
          success: function (result) {
              console.log(HTTP_SCHEME + API_HOST + '/api/news' + attachment);
              var list = $("#list");
              list.empty();
              for (var i = 0; i < result.length; ++i) {
                  var item = result[i];
                  // TODO: 这里可以修改从而美化界面, 可用的字段在server.js可以找到
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
                      var description = source + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + dateFormat(date);
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
                      for (var j = 0; j < scaled.length; ++j) {
                          scaled[j].onload = function () {
                              var width = this.width;
                              var height = this.height;
                              if (width > height) {
                                  this.width = MAX_IMG_SIZE;
                                  this.height = MAX_IMG_SIZE * height / width;
                              } else {
                                  this.height = MAX_IMG_SIZE;
                                  this.width = MAX_IMG_SIZE * width / height;
                              }
                          }
                      }
                  }
              }
              $("#list").removeClass("_hidden");
          }
      });
    }, 450);
}

function getSources() {
    $.ajax({
        type: "GET",
        url: HTTP_SCHEME + API_HOST + '/api/sources',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            var list = $("#sources");
            for(var i = 0;i < result.length; ++i){
                var source = result[i];
                var name = source.name;
                console.log(name);
                var html = "<option value='" + name + "'>" + name + "</option>";
                list.append(html);
            }
        }
    });
}

$(document).ready(function() {
    getPage();
    getSources();
    $('#filterForm').submit(function(e){
        e.preventDefault();
        var keyword = $('#keyword').val();
        var keywords = keyword.split(/\s/);
        for(var i = 0;i < keywords.length; ++i){
            keywords[i] = encodeURI(keywords[i]);
        }
        keywords = JSON.stringify(keywords);
        var start = new Date($('#start').val());
        var end = new Date($('#end').val());
        var sources = $('#sources').val().split('\"')[0];
        getPage(keywords, start, end, sources);
    });
});
