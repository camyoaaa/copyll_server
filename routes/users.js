var express = require("express");
var router = express.Router();

const DB = require("../models");
const UserModel = DB.getModel("User");
const {
    sendCaptcha
} = require("../tool/sendSMS"); //发送验证码短信api

const Jwt = require("../authMiddleware/jwt");

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

//用户登录
router.post("/login", async function (req, res, next) {
    const {
        phone,
        password
    } = req.body;
    try {
        let user = await UserModel.findOne({
            phone,
            password
        });
        if (user) {
            let userid = user._id.toString();
            res.cookie("userid", userid); //登录时候设置cookie
            let userToken = new Jwt(userid).generateToken();
            res.header('Access-Control-Expose-Headers', 'Authorization'); //使前端能获取到header中的Authorization
            res.header("Authorization", userToken);
            res.json({
                status: 200,
                msg: "登陆成功",
                user: {...user._doc,token:userToken}
            });
        } else {
            throw new Error("用户名或密码错误,请重新登录");
        }
    } catch (error) {
        res.json({
            status: 400,
            msg: error.message
        });
    }
});

//用户登出
router.post("/logout", async function (req, res, next) {
    const {
        phone,
        password
    } = req.body;
    try {
        let user = await UserModel.findOne({
            phone,
            password
        });
        if (user) {
            let userid = user._id.toString();
            res.cookie("userid", userid); //登录时候设置cookie
            let userToken = new Jwt(userid).generateToken();
            res.header('Access-Control-Expose-Headers', 'Authorization'); //使前端能获取到header中的Authorization
            res.header("Authorization", userToken);
            res.json({
                status: 200,
                msg: "注销成功",
                user: user._doc
            });
        } else {
            throw new Error("用户名或密码错误,请重新登录");
        }
    } catch (error) {
        res.json({
            status: 400,
            msg: error.message
        });
    }
});

//判断用户是否注册
router.post("/isRegist", async function (req, res, next) {
    try {
        const {
            phone
        } = req.body;
        let queryResult = await UserModel.find({
            phone
        });
        res.json({
            status: 200,
            isRegist: queryResult.length > 0
        });
    } catch (error) {}
});

//获取验证码
router.post("/captcha", async function (req, res, next) {
    const {
        phone
    } = req.body;
    try {
        const {
            sixCaptcha,
            result
        } = await sendCaptcha(phone);

        //将验证码存入session
        req.session.captcha = sixCaptcha;
        res.json({
            status: 200,
            sixCaptcha,
            result
        });
    } catch (error) {
        res.json({
            status: 400,
            msg: error.message
        });
    }
});

//注册用户
router.post("/regist", async function (req, res, next) {
    const {
        username,
        phone,
        password,
    } = req.body;
    let = await UserModel.create({
        username,
        userid: "0000001",
        phone,
        password
    });
    res.json({
        status: 200,
        msg: "注册成功"
    });
    return;
});

//获取用户信息
router.get("/info", async function (req, res, next) {
    try {
        const {
            userid
        } = req.body;
        let queryResult = await UserModel.findOne({
            userid
        });
        console.log('queryResult',queryResult);
        res.json({
            status: 200,
            info: {...queryResult,avatar:'//mapp.alicdn.com/1571622754899D0vApol5yaxNpaQ.png'}
        });
    } catch (error) {}
});

module.exports = router;