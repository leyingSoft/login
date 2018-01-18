# 用户登录功能
## 前端页面:/public/login.html
前端页面使用Bootstrap框架搭建界面，使用Vue.js框架处理数据。

前端数据通过ajax请求，通过json格式传输数据，实现低耦合的前后端分离,提高系统稳定性。

## 后端：/routes/users.js
服务端使用node.js express框架,实现灵活同时高性能服务端搭建。

### 登录流程：
1. 数据库查询用户名
2. 有记录时sha265加密密码
3. 密码与查询记录比较
4. 用户名密码验证成功时，更新数据库中用户最后登录时间数据
5. 登录成功时添加cookies
6. 返回相应的登录代码和对应的消息

### 数据库
数据库使用mysql
1. 数据库连接
```
var mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'LOGIN'
};

var connection = mysql.createConnection(mysqlConfig);
connection.connect();
```

2. 数据库查询和更新
```
var query = connection.query('SELECT `password` FROM `users` WHERE `username`="' + req.body.username + '"');//查询用户

var update = connection.query('UPDATE `users` SET `lastlogin` = CURRENT_TIMESTAMP WHERE `username`="' + req.body.username + '"'); //更新登录时间
```

### 项目运行
项目依赖node.js运行环境，安装环境后，可以通过`node ./bin/www`或者`npm start`运行服务。

项目上线后，可以通过node.js的进程管理器，如`PM2`或者`forever`来运行服务，实现后台运行，进程保护，自动分配系统资源，远程监控等功能。