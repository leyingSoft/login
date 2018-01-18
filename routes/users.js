var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');//用于解析上传文件和post数据
var multipartMiddleware = multipart();
var crypto = require('crypto');//加密函数
var mysql = require('mysql');//mysql

/*数据库连接参数
修改host,user,password,databse为数据库的链接信息
*/
var mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'LOGIN'
};

/* 用户登录接口
登录流程：
1、数据库查询用户名
2、有记录时sha265加密密码
3、密码与查询记录比较
4、用户名密码验证成功时，更新数据库中用户最后登录时间数据
5、登录成功时添加cookies
6、返回相应的登录代码和对应的消息
*/
router.post("/login", multipartMiddleware, function (req, res, next) {
  var connection = mysql.createConnection(mysqlConfig);
  connection.connect();
  var send = false;//是否已返回数据
  var query = connection.query('SELECT `password` FROM `users` WHERE `username`="' + req.body.username + '"');//查询用户
  query.on("result", function (rows) {//有数据记录
    send = true;
    var nonce_str = "dsjk43vkblsn";//加密字符串
    var password = req.body.password + nonce_str;
    var fsHash = crypto.createHash('sha256');
    fsHash.update(password);
    password = fsHash.digest('hex');
    if (password == rows.password) {
      //更新登录时间
      var update = connection.query('UPDATE `users` SET `lastlogin` = CURRENT_TIMESTAMP WHERE `username`="' + req.body.username + '"').on("end", function () {
        var echoData = {
          code: "00000",
          msg: "登录成功"
        };
        res.cookie("login", true, { expires: new Date(Date.now() + 60000) });//设置COOKIE，60秒过期
        res.send(echoData);
        return;
      });
    }
    else {
      var echoData = {
        code: "00002",
        msg: "密码错误"
      };
      res.send(echoData);
      return;
    }
  })
    .on("end", function () {//数据遍历完成
      connection.end();
      if(!send){
        var echoData = {
          code: "00001",
          msg: "用户不存在"
        };
        res.send(echoData);
      }
      return;
    })
    .on("error", function () {//数据库查询失败
      connection.end();
      var echoData = {
        code: "00003",
        msg: "网络链接错误，请联系管理员[CODE=00003]!"
      };
      res.send(echoData);
      send = true;
      return;
    });
});

module.exports = router;