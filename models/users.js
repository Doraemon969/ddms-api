// // Models/users.js
// var mongoose = require('mongoose');
// var users = mongoose.connection;
// var Schema = mongoose.Schema;

// mongoose.connect('mongodb://localhost:27017/usersInfo')
// users.on('open', function () {
//     console.log('++ MongoDB Connection Successed ++');
// });
// users.on('error', function () {
//     console.log('++ MongoDB Connection Error ++');
// });


// // 声明一个数据集 对象
// var userSchema = new Schema({
//     userName: {
//         type: String,
//         unique: true
//     },
//     userPassword: {
//         type: String
//     }
// });
// // 将数据模型暴露出去
// module.exports = mongoose.model('users', userSchema);







const mongoose = require('mongoose')

const usersInfo = mongoose.Schema({
    userName: String,
    userPassword: String,
}, {
    collection: 'users'
})
//这里mongoose.Schema要写上第二个参数，明确指定到数据库中的哪个表取数据


module.exports = mongoose.model('user', usersInfo);
