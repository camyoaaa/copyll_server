const Jwt = require('./jwt'); //引入jwt认证工具类

//不用认证的api地址
const noAuthUrls = [
    '/user/login',
    '/user/regist',
    '/user/isRegist'
];
const auth = function (req, res, next) {
    if (!noAuthUrls.includes(req.url)) {
        let token = req.headers.Authorization;
        if (!new Jwt(token).verifyToken()) {
            res.json({
                status: 403,
                msg: '无权限访问或登录过期,请重新登录'
            });
            return;
        }
    }
    next();
}

module.exports = auth;