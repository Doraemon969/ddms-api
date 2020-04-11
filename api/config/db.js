// module.exports.DB_URL = "mongodb://localhost:27017/usersInfo";






// // 引入模板
// var mongoose = require('mongoose')

// // 定义一个 schema
// var Schema = mongoose.Schema

// // 1. 连接数据库
// // 指定连接的数据库不需要存在，当你插入第一条数据之后就会自动被创建出来
// mongoose.connect('mongodb://localhost/login')

// // 2. 设计文档结构（表结构）
// var userSchema = new Schema({
//     username: {
//         type: String,
//         required: true // 必须有
//     },
//     password: {
//         type: String,
//         required: true
//     }
// })

// // 4. 当我们有了模型构造函数之后，就可以使用这个构造函数对 users 集合中的数据进行操作了（增删改查）

// // 3. 将文档结构发布为模型
// // 直接导出模型构造函数
// module.exports = mongoose.model('users', userSchema)