var createError = require("http-errors");
var express = require("express");
var path = require("path");
const bodyParser = require("body-parser"); //请求体解析器
var cookieParser = require("cookie-parser"); //cookie解析器
var logger = require("morgan"); //日志模块,只能记录请求信息
var session = require("express-session");

var authMiddleware = require('./authMiddleware'); //token认证

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var tasksRouter = require("./routes/tasks");

var app = express();

//设置跨域
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization,Access-Token,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(authMiddleware); //启用token认证
// 使用 session 中间件
app.use(
    session({
        secret: "secret", // 对session id 相关的cookie 进行签名
        resave: true,
        saveUninitialized: false, // 是否保存未初始化的会话
        cookie: {
            maxAge: 1000 * 60 * 60 * 3 // 设置 session 的有效时间，单位毫秒
        }
    })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(cookieParser()); //使用cookie解析中间件
app.use(bodyParser.json()); //使用请求体解析中间件
app.use(express.static(path.join(__dirname, "public"))); //静态化public目录

app.use("/", indexRouter);
app.use("/auth", usersRouter);
app.use("/tasks", tasksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;