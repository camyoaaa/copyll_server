var express = require("express");
var router = express.Router();

const DB = require("../models");
const UserModel = DB.getModel("User");
const {
    sendValidCode
} = require("../tool/sendSMS");

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
            res.cookie("userid", user._id); //登录时候设置cookie
        }
        console.log("*******************", user);
        res.json({
            status: user ? 200 : 400,
            msg: user ? "登陆成功" : "用户名或者密码错误",
            user: user
        });
    } catch (error) {
        console.log("^^^^^^^^^^^^^^^^^^^^^", error);
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
router.post("/validcode", async function (req, res, next) {
    const {
        phone
    } = req.body;
    try {
        const {
            sixValidCode,
            result
        } = await sendValidCode(phone);

        //将验证码存入session
        req.session.validcode = sixValidCode;

        res.json({
            status: 200,
            sixValidCode,
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
        phone,
        password,
        validcode
    } = req.body;
    //判断验证码是否正确
    if (validcode != req.session.validcode) {
        res.json({
            status: 400,
            msg: "验证码错误"
        });
        return;
    }
    let = await UserModel.create({
        username: phone,
        userid: '0000001',
        phone,
        password
    });
});

module.exports = router;