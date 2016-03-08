/**
 * Created by huangruihao on 16-3-7.
 */

/* 这些函数是写在客户端, 用于从服务端获取数据 */
function queryNews(keyword, media, date, callback) {
    var queryString = [keyword, media, date].join(" ");
    // post /query?str=keyword, 得到一个json即result
    // 正常应该是post, 服务端会调用queryFromXXX, 然后返回一个json, 这里直接调用queryFromXXX了
    queryFrom("all", queryString, callback);
}
