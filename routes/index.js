var express = require("express");
var router = express.Router();
/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", {
        title: "Express"
    });
});
router.post("/mylogin", function(req, res, next) {
    req.session.password = req.body.password; // 登录成功，设置 session
    res.json({ status: 200, msg: "登陆成功" });
});
module.exports = router;
