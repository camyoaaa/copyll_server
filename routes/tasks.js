var express = require("express");
var router = express.Router();

const DB = require("../models");
const TaskModel = DB.getModel("Task");

const saveTask = async function (taskform) {

}

router.post('/save', async function (req, res, next) {
    let success = false;
    req.body;
    try {
        let result = await TaskModel.create(req.body);
        if (result) {
            success = true;
        }
    } catch (error) {
        success = false;
        console.log('ERROR:******************************************** \n', req.body);
    } finally {
        res.json({
            status: success ? 200 : 500,
            msg: success ? '方案保存成功' : '系统错误,请重试'
        })
    }


});
router.post('/deploy', function (req, res, next) {

});

module.exports = router;