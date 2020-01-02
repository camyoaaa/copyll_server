var express = require("express");
var router = express.Router();

const DB = require("../models");
const TaskModel = DB.getModel("Tasks");

const saveTask = async function (taskform) {

}

router.post('/save', async function (req, res, next) {
    let success = false;
    // req.body;
    console.log('req.body', req.body);
    try {
        let result = await TaskModel.create({
            ...req.body,
            userid: req.userid,
            status: 0
        });
        if (result) {
            success = true;
        }
    } catch (error) {
        success = false;
        console.log('ERROR:******************************************** \n', error);
    } finally {
        res.json({
            status: success ? 200 : 500,
            msg: success ? '方案保存成功' : '系统错误,请重试'
        })
    }


});

router.get('/list', async function (req, res, next) {
    let success = false;
    let result = {};
    try {
        result = await TaskModel.find({
            userid: req.userid,
        });
        if (result) {
            success = true;
        }
    } catch (error) {
        success = false;
        console.log('ERROR:******************************************** \n', error);
    } finally {
        res.json({
            status: success ? 200 : 500,
            msg: success ? '获取成功' : '系统错误,请重试',
            list: result
        })
    }


});

router.post('/deploy', function (req, res, next) {

});

module.exports = router;