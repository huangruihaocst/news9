/**
 * Created by Alex Wang on 16-3-8.
 */

/* 这些函数是应该写在服务端的 */
var keyword = '清华';

function queryFrom(source, queryString, callback) {
    // 这里写从真正的数据源获取数据, 并且统一成如下的数据格式
    // { "source": "sogou", "title": "xxx", "date": "20150101", "description": "xxx", "url": "http://www.baidu.com",
    // "image":"xxx"}
    switch (source) {
        /* TODO 从某个API获取数据, 转换成以上格式并且调用callback(data) */
        case 'songshuxiansheng':
            $.ajax({
                url: "http://apis.baidu.com/songshuxiansheng/real_time/search_news?keyword=" + keyword,
                //data: { signature: authHeader },
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('apikey', '606ef48abce1cb59a5694142d87a64df');},
                success: function(data) {
                    var news_hash = JSON.parse(data);
                    var raw = news_hash['retData']['data'];//array
                    var content = [];
                    for(var i = 0;i < raw.length; ++i){
                        var map = new Map();
                        map.set('source', 'songshuxiansheng');
                        map.set('title', raw[i]['title']);
                        map.set('date', raw[i]['datetime']);
                        map.set('description', raw[i]['abstract']);
                        map.set('url', raw[i]['url']);
                        map.set('image', raw[i]['image_url']);
                        content.push(map);
                    }
                    callback(content);
                }
            });
            break;
        case 'xxapi':
            break;
        default: // 从所有数据源获取数据
            // 这里json/news.json是模拟一个数据源
            $.get("json/news.json", function(data, status) {
                // 从真正数据源获取完数据
                callback(data);
            });
    }
}
