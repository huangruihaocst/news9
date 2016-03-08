/**
 * Created by Alex Wang on 16-3-8.
 */

/* 这些函数是应该写在服务端的 */
function queryFrom(source, queryString, callback) {
    var result = [];
    // 这里写从真正的数据源获取数据, 并且统一成如下的数据格式
    // { "source": "sogou", "title": "xxx", "date": "20150101", "description": "xxx" }
    switch (source) {
        case 'baidu':
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