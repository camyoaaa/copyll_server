var express = require("express");
var router = express.Router();
var moment = require("moment");

const DB = require("../models");
const UserModel = DB.getModel("Users");
const ScoreModel = DB.getModel("Scores");

const {
    sendCaptcha
} = require("../tool/sendSMS"); //发送验证码短信api

const Jwt = require("../authMiddleware/jwt");

//剥离记录中敏感信息
const filterUserInfo = (record, req) => {
    const {
        password,
        transactionPassword,
        __v,
        _id,
        ...usreInfo
    } = record;
    usreInfo.userid = _id;
    usreInfo.lastLoginIP = usreInfo.lastLoginIP || getClientIP(req);
    usreInfo.lastLoginTime = usreInfo.lastLoginTime || moment().format("YYYY-MM-DD HH:mm:ss");
    return usreInfo;
};

const getClientIP = req => {
    // console.log("headers = " + JSON.stringify(req.headers)); // 包含了各种header，包括x-forwarded-for(如果被代理过的话)
    // console.log("x-forwarded-for = " + req.header('x-forwarded-for')); // 各阶段ip的CSV, 最左侧的是原始ip
    // console.log("ips = " + JSON.stringify(req.ips)); // 相当于(req.header('x-forwarded-for') || '').split(',')
    // console.log("remoteAddress = " + req.connection.remoteAddress); // 未发生代理时，请求的ip
    // console.log("ip = " + req.ip); // 同req.connection.remoteAddress, 但是格式要好一些
    return (ip = req.headers["x-real-ip"] ? req.headers["x-real-ip"] : req.ip.replace(/::ffff:/, ""));
};

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
        let findandupdateResult = await UserModel.findOneAndUpdate({
            phone,
            password
        }, {
            lastLoginTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            lastLoginIP: getClientIP(req)
        });
        if (findandupdateResult && findandupdateResult._id) {
            //成功更新一条数据
            let userid = findandupdateResult._id.toString();
            // res.cookie("userid", userid); //登录时候设置cookie
            let userToken = new Jwt(userid).generateToken();
            res.header("Authorization", userToken);
            res.json({
                status: 200,
                msg: "登陆成功",
                user: filterUserInfo(findandupdateResult._doc, req)
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
        let queryResult = await UserModel.findOne({
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
        // req.session.captcha = sixCaptcha;
        res.json({
            status: 200,
            smsPhone: phone,
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
        guiderid
    } = req.body;
    let registSuccess = await UserModel.create({
        username,
        guiderid,
        phone,
        password,
        kscore: 200,
        registIP: getClientIP(req),
        registTime: moment().format("YYYY-MM-DD HH:mm:ss")
    });
    let systemCharge = await ScoreModel.create({
        userid: registSuccess._doc._id.toString(),
        phone: phone,
        score: 200,
        type: 0,
        remark: "新用户注册系统赠送"
    });
    console.log("systemCharge", systemCharge._doc);
    if (registSuccess) {
        res.json({
            status: 200,
            msg: "注册成功"
        });
    }
    return;
});

//获取用户信息
router.get("/info", async function (req, res, next) {
    try {
        let userid = req.userid;
        let queryResult = await UserModel.findOne({
            _id: userid
        });
        res.json({
            status: 200,
            user: filterUserInfo(queryResult._doc, req)
        });
    } catch (error) {
        res.json({
            status: 404,
            msg: "未查询到用户信息",
            info: null
        });
    }
});

router.get("/promote", async (req, res, next) => {
    try {
        let userid = req.userid;
        let promoteUsers = await UserModel.aggregate([{
                $match: {
                    guiderid: userid
                }
            },
            {
                $lookup: {
                    from: "Scores",
                    localField: "phone",
                    foreignField: "phone",
                    as: "scoreinfo"
                }
            }
        ]);

        res.json({
            status: 200,
            promoteUsers
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            msg: error.message
        });
    }
});

module.exports = router;