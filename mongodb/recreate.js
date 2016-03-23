db = connect("localhost:27017/newsdb");

db.news.drop();
db.newSources.drop();
db.createCollection("news");
db.createCollection("newsSources");
db.news.createIndex({ url: 1 }, { unique: true });
db.newsSources.createIndex({ name: 1 }, { unique: true });

