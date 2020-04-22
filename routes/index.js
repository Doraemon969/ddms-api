var express = require('express');
var router = express.Router();
var database = require('../db/index')


// 文件上传功能
// var multer = require('multer')
// var upload = multer({
//   dest: 'uploads/'
// })


// 定义管理员列表
var manager = []
// 定义数据库返回的数据
var dataList = []


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express首页'
  });
});

/**
 * 数据初始化
 */
router.get('/deviceInit', (req, res) => {
  let dataList = ['popular', 'workHigh', 'earthmovingEquipment', 'forkliftTruck', 'pneumaticTools', 'truck', ]
  let dataTmp = []

  function runAsync() {
    return new Promise((resolve, reject) => {
      // 遍历数据库，返回总数据
      for (let i = 0; i < dataList.length; i++) {
        let element = dataList[i];
        database.connect(function (db) {
          db.collection(element).find().toArray(function (err, docs) {
            if (err) {
              console.log('+++++error+++++error+++++error+++++', err);
            } else {
              dataTmp.push(docs)
            }
          })
        })
      }
      setTimeout(() => {
        resolve(dataTmp);
      }, 1500);
    });
  }
  runAsync().then((data) => {
    let tmp = []
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      tmp.push(element[0])
    }
    res.json({
      code: 200, // 正确返码
      message: tmp
    })
  })
});

/**
 * 登录
 */
router.post('/logIn', (req, res) => {
  const userInfo = {
    name: req.body.userName,
    psd: req.body.userPassword
  }

  // 数据库查询管理员信息
  database.connect(function (db) {
    db.collection('manager').find(userInfo).toArray(function (err, docs) {
      if (err) {
        console.log('+++++error+++++error+++++error+++++', err);
      } else {
        console.log('+++++success+++++用户名查询+++++success+++++');
        manager = docs
        // 验证密码
        console.log('================', );
        console.log(docs);
        console.log('================', );
        if (docs[0]) {
          // 返回数据
          res.json({
            code: 200, // 正确返码
            message: "用户名和密码正确"
          })
        } else {
          res.json({
            code: 0, // 错误返码
            message: "用户名或密码错误"
          })
        }
      }
    })
  })

});


/**
 * 添加数据
 */
router.post('/addInfo', (req, res, next) => {
  let tmp = req.body.addParam
  let collectionName = tmp.type
  let typeName = ''
  switch (collectionName) {
    case 'popular':
      typeName = '流行'
      break;
    case 'workHigh':
      typeName = '高空作业'
      break;
    case 'pneumaticTools':
      typeName = '气动工具'
      break;
    case 'earthmovingEquipment':
      typeName = '土方设备'
      break;
    case 'truck':
      typeName = '物料搬运'
      break;
    case 'forkliftTruck':
      typeName = '叉车和拖车'
      break;
    case '流行':
      typeName = '流行'
      break;
    case '高空作业':
      typeName = '高空作业'
      break;
    case '气动工具':
      typeName = '气动工具'
      break;
    case '土方设备':
      typeName = '土方设备'
      break;
    case 'truck':
      typeName = '物料搬运'
      break;
    case '叉车和拖车':
      typeName = '叉车和拖车'
      break;
  }
  // 向数据库中写入数据
  database.connect(function (db) {
    db.collection(collectionName).updateOne({
      type: typeName
    }, {
      $addToSet: {
        subDevice: tmp
      }
    })
  })
  res.send({
    code: 200,
    message: '添加成功！'
  });
});

/**
 * 修改数据
 */
router.post('/modifyInfo', (req, res, next) => {
  res.send({
    code: '0',
    message: '更新成功！'
  });
});

/**
 * 删除数据
 */
router.post('/deleteInfo', (req, res, next) => {
  let type = req.body.type
  let deviceName = req.body.deviceName
  let tmpInfo = {
    recommend: [{
      //  "name": req.body.deviceName,
      //   "type": req.body.type,
      "index": 0,
      "name": "设备一",
      "type": "流行",
      "description": "一款非常炫酷的挖机，适合各个年龄段，从小孩到老年人。它，让无数人新潮澎湃。",
      "rent": 0.01,
      "imgUrl": ""
    }]
  }

  /**
   * 数据库删除信息
   */
  let typeName = ''
  switch (type) {
    case '流行':
      typeName = 'popular'
      break;
    case '高空作业':
      typeName = 'workHigh'
      break;
    case '气动工具':
      typeName = 'pneumaticTools'
      break;
    case '土方设备':
      typeName = 'earthmovingEquipment'
      break;
    case '物料搬运':
      typeName = 'truck'
      break;
    case '叉车和拖车':
      typeName = 'forkliftTruck'
      break;
  }

  // 数据库【数组元素】删除操作
  database.connect(function (db) {
    db.collection(typeName).updateOne({
      "type": type,
    }, {
      $pull: {
        "subDevice": {
          "name": deviceName
        }
      }
    })
  });

  // 返回值
  res.json({
    code: 200,
    message: '删除成功！'
  })

  // 确认是否删除
  // database.connect(function (db) {
  //   db.collection('popular').find({
  //     "subDevice.name": deviceName,
  //   }, {
  //     "subDevice": {
  //       $elemMatch: {
  //         "name": deviceName
  //       }
  //     }}).toArray(function (err, docs) {
  //     if (err) {
  //       console.log('+++++error+++++error+++++error+++++', err);
  //     } else {
  //       console.log('+++++success+++++成功++s+++success+++++', docs);
  //       if (docs[0].subDevice.name === deviceName) {
  //         // 返回数据
  //         res.json({
  //           code: 200,
  //           message: '删除成功！'
  //         })
  //       } else {
  //         res.json({
  //           code: 0, // 错误返码
  //           message: "删除数据失败"
  //         })
  //       }
  //     }
  //   })
  // })

});

/**
 * 查询数据
 */
router.post('/searchInfo', (req, res, next) => {
  let searchInfo = req.body.searchInfo
  // 数据库查询操作
  database.connect(function (db) {
    db.collection('popular').find({
      "subDevice.name": searchInfo
    }, {
      "subDevice": {
        $elemMatch: {
          "name": searchInfo
        }
      }
    }).toArray(function (err, docs) {
      if (err) {
        console.log('+++++error+++++error+++++error+++++', err);
      } else {
        if (docs.length === 0) {
          return
        } else {
          docs[0].subDevice.forEach(element => {
            if (element.name === searchInfo) {
              res.send({
                code: 200,
                message: element
              });
            }
            return
          });
        }
      }
    })
  })
  database.connect(function (db) {
    db.collection('earthmovingEquipment').find({
      "subDevice.name": searchInfo
    }, {
      "subDevice": {
        $elemMatch: {
          "name": searchInfo
        }
      }
    }).toArray(function (err, docs) {
      if (err) {
        console.log('+++++error+++++error+++++error+++++', err);
      } else {
        if (docs.length === 0) {
          return
        } else {
          docs[0].subDevice.forEach(element => {
            if (element.name === searchInfo) {
              res.send({
                code: 200,
                message: element
              });
            }
            return
          });
        }
      }
    })
  })
  database.connect(function (db) {
    db.collection('forkliftTruck').find({
      "subDevice.name": searchInfo
    }, {
      "subDevice": {
        $elemMatch: {
          "name": searchInfo
        }
      }
    }).toArray(function (err, docs) {
      if (err) {
        console.log('+++++error+++++error+++++error+++++', err);
      } else {
        if (docs.length === 0) {
          return
        } else {
          docs[0].subDevice.forEach(element => {
            if (element.name === searchInfo) {
              res.send({
                code: 200,
                message: element
              });
            }
            return
          });
        }
      }
    })
  })
  database.connect(function (db) {
    db.collection('pneumaticTools').find({
      "subDevice.name": searchInfo
    }, {
      "subDevice": {
        $elemMatch: {
          "name": searchInfo
        }
      }
    }).toArray(function (err, docs) {
      if (err) {
        console.log('+++++error+++++error+++++error+++++', err);
      } else {
        if (docs.length === 0) {
          return
        } else {
          docs[0].subDevice.forEach(element => {
            if (element.name === searchInfo) {
              res.send({
                code: 200,
                message: element
              });
            }
            return
          });
        }
      }
    })
  })
  database.connect(function (db) {
    db.collection('truck').find({
      "subDevice.name": searchInfo
    }, {
      "subDevice": {
        $elemMatch: {
          "name": searchInfo
        }
      }
    }).toArray(function (err, docs) {
      if (err) {
        console.log('+++++error+++++error+++++error+++++', err);
      } else {
        if (docs.length === 0) {
          return
        } else {
          docs[0].subDevice.forEach(element => {
            if (element.name === searchInfo) {
              res.send({
                code: 200,
                message: element
              });
            }
            return
          });
        }
      }
    })
  })
  database.connect(function (db) {
    db.collection('workHigh').find({
      "subDevice.name": searchInfo
    }, {
      "subDevice": {
        $elemMatch: {
          "name": searchInfo
        }
      }
    }).toArray(function (err, docs) {
      if (err) {
        console.log('+++++error+++++error+++++error+++++', err);
      } else {
        if (docs.length === 0) {
          return
        } else {
          docs[0].subDevice.forEach(element => {
            if (element.name === searchInfo) {
              res.send({
                code: 200,
                message: element
              });
            }
            return
          });
        }
      }
    })
  })
});



// 小程序端

/**
 * 首页推荐
 */
router.get('/indexRecommend', (req, res) => {
  let dataList = ['popular']
  let dataTmp = []

  function runAsync() {
    return new Promise((resolve, reject) => {
      // 遍历数据库，返回总数据
      for (let i = 0; i < dataList.length; i++) {
        let element = dataList[i];
        database.connect(function (db) {
          db.collection(element).find().toArray(function (err, docs) {
            if (err) {
              console.log('+++++error+++++error+++++error+++++', err);
            } else {
              dataTmp.push(docs)
            }
          })
        })
      }
      setTimeout(() => {
        resolve(dataTmp);
      }, 1500);
    });
  }
  runAsync().then((data) => {
    let tmp = []
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      tmp.push(element[0])
    }
    res.json({
      code: 200, // 正确返码
      message: tmp
    })
  })
});

/**
 * 获取用户数据
 */
router.post('/addUserInfo', (req, res) => {
  // 获取信息
  let tmp = req.body

  // 插入数据库
  database.connect(function (db) {
    db.collection('users').insertOne(tmp)
  })

  // 返回结果
  res.json({
    code: 200, // 正确返码
    message: "数据插入成功"
  })
})

/**
 * “我的”页面
 */
router.get('/mine', (req, res) => {
  database.connect(function (db) {
    db.collection('users').find(userInfo).toArray(function (err, docs) {
      if (err) {
        console.log('+++++error+++++error+++++error+++++', err);
      } else {
        console.log('+++++success+++++用户名查询+++++success+++++');
        manager = docs
        // 验证密码
        console.log('================', );
        console.log(docs);
        console.log('================', );
        if (docs[0]) {
          // 返回数据
          res.json({
            code: 200, // 正确返码
            message: "用户名和密码正确"
          })
        } else {
          res.json({
            code: 0, // 错误返码
            message: "用户名或密码错误"
          })
        }
      }
    })
  })
})

/**
 * 验证我的页面，手机号
 */
router.post('/minePhone', (req, res) => {
  let userPhone = req.body.userPhone
  database.connect(function (db) {
    db.collection('users').find(userPhone).toArray(function (err, docs) {
      if (err) {
        console.log('+++++error+++++error+++++error+++++', err);
      } else {
        console.log('+++++success+++++用户名查询+++++success+++++');
        // 验证
        if (docs[0].userPhone == userPhone) {
          // 返回数据
          res.json({
            code: 200, // 正确返码
            message: docs
          })
        } else {
          // 插入用户
          res.json({
            code: 0, // 错误返码
            message: ""
          })
        }
      }
    })
  })
})


/**
 * 添加到购物车
 */
router.post('/shoppingCar', (req, res) => {
  let userInfo = req.body
  console.log('================', );
  console.log(userInfo);
  console.log('================', );
  // 插入数据库
  database.connect(function (db) {
    db.collection('shoppingCar').insertOne(userInfo)
  })
  // 返回结果
  res.json({
    code: 200, // 正确返码
    message: "数据插入成功"
  })
})


/**
 * 获取购物车信息
 */
router.post('/getShoppingCarInfo', (req, res) => {
  let userInfo = req.body
  // 查询数据库
  database.connect(function (db) {
    db.collection('shoppingCar').find({
      "userPhone": userInfo.userPhone
    }).toArray(function (err, docs) {
      if (err) {
        console.log('+++++error+++++error+++++error+++++', err);
      } else {
        if (docs.length === 0) {
          return
        } else {
          // 返回结果
          res.json({
            code: 200, // 正确返码
            message: "数据查询成功",
            data: docs
          })
        }
      }
    })
  })
})



















module.exports = router;