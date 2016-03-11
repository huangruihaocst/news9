db = connect("localhost:27017/newsdb");
db.news.drop();
db.createCollection("news");
db.news.createIndex({ url: 1 }, { unique: true });
