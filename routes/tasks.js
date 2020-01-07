var express = require("express");
var router = express.Router();
var API_CONFIG = require('../config/index');
const {
    generateTaskID,
    filterObject
} = require('../tool/commonFunc');

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
            luserid: API_CONFIG.USER_NAME,
            kuserid: req.userid,
            taskid: generateTaskID(),
            // taskInfo: JSON.stringify(req.targetInfo),
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
        let findCondition = filterObject({
            kuserid: req.userid,
            platform: req.body.platform,
            category: req.body.category,
            type: req.body.type,
            taskname: req.body.taskname
        })
        console.log({
            kuserid: req.userid,
            platform: req.query.platform,
            category: req.query.category,
            type: req.query.type,
            taskname: req.query.taskname
        }, findCondition);
        result = await TaskModel.find(findCondition).skip((req.start - 1) * req.limit).limit(req.limit).exec(); //分页查询
        console.log(findCondition);
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
router.delete('/delete', async function (req, res, next) {
    let success = false;
    let result = {};
    try {
        result = await TaskModel.deleteOne({
            taskid: req.body.taskid
        });
        console.log(req.body.taskid, result);
        if (result) {
            success = true;
        }
    } catch (error) {
        console.log('**********error', error);
        success = false;
    } finally {
        res.json({
            status: success ? 200 : 500,
            msg: success ? '删除成功' : '系统错误,请重试',
        })
    }

});

module.exports = router;