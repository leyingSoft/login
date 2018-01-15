var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');//用于解析上传文件和post数据
var multipartMiddleware = multipart();
var crypto = require('crypto');//加密函数
var mysql = require('mysql');//mysql

var mysqlConfig = {//数据库连接参数
  host: 'localhost',
  user: 'root',
  password: 'devilxulo',
  database: 'LOGIN'
};

// 用户登录
router.post("/login", multipartMiddleware, function (req, res, next) {
  var connection = mysql.createConnection(mysqlConfig);
  connection.connect();
  var isMember = false;//是否已注册用户
  var query = connection.query('SELECT `password` FROM `users` WHERE `username`="' + req.body.username + '"');//查询用户
  query.on("result", function (rows) {
    isMember = true;
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
        res.cookie("login",true,{expires: new Date(Date.now() + 60000)});//设置COOKIE，60秒过期
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
      if(!isMember){
        var echoData = {
          code: "00001",
          msg: "用户不存在"
        };
        res.send(echoData);
        return;
      }  
    });
});

module.exports = router;