var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// mongoDB地址
const url = 'mongodb://localhost:27017';

// 数据库名称
const dbName = 'ddDviceDB'

// 封装函数
function connect(callback) {
    mongoClient.connect(url, function (err, client) {
        if (err) {
            console.log("数据库连接出错！", err);
        } else {
            console.log("数据库连接成功！");
            var db = client.db(dbName);
            callback && callback(db);
            // 关闭数据库
            client.close();
        }
    })
}

// 暴露函数
module.exports = {
    connect
}