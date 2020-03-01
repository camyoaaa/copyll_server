var express = require("express");
var router = express.Router();
var API_CONFIG = require('../config/index');
var getLieliuType = require('../tool/getLieliuType');
const laxios = require('../tool/lieliuAxios');

const {
    taskSearch
} = require('../tool/lieliuApi');

const {
    generateTaskID
} = require('../tool/commonFunc');

const DB = require("../models");
const TaskModel = DB.getModel("Tasks");

//取消任务
router.post('cancel', async function (req, res, next) {
    let success = false;
    const {
        taskid
    } = req.body;
    try {
        let result = await laxios({
            url: '/ll/task_cancel',
            method: 'get',
            params: {
                username: API_CONFIG.USER_NAME,
                id: taskid,
            }
        });
    } catch (error) {} finally {
        res.json({
            status: success ? 200 : 500,
            msg: success ? '方案保存成功' : '系统错误,请重试'
        })
    }
});

//发布任务
router.post('/publish', async function (req, res, next) {
    let success = false;
    const {
        platform,
        category,
        type,
        plan: {
            daily,
            total,
            dateRange: [sdate, edate]
        },
        targetinfo: {
            itemlink
        },
        keywords,
        scantime,
        scandeep,
        alloc
    } = req.body;
    let taskid = generateTaskID();
    let lieliuType = getLieliuType(platform, category, type);
    try {

        let publish = await laxios({
            url: '/ll/task_add',
            method: 'post',
            data: {
                id: taskid,
                begin_time: sdate,
                type: lieliuType,
                count: total,
                hour: alloc.join(','),
                target: itemlink,
                keyword: keywords.join(','),
                browse_time: scantime,
                depth: scandeep,
            }
        }).catch((error) => {
            console.log('****************************error \n', error);
        });

        let result = await TaskModel.create({
            ...req.body,
            daily,
            total,
            sdate,
            edate,
            luserid: API_CONFIG.USER_NAME,
            kuserid: req.userid,
            taskid,
            status: 1 //发布
        });
        if (result) {
            success = true;
        }
        console.log('****************************reslut \n', publish);

    } catch (error) {
        console.log('****************************error \n', error);
    } finally {
        res.json({
            status: success ? 200 : 500,
            msg: success ? '发布成功' : '系统错误,请重试'
        })
    }
});

//任务查询
router.get('/search', async function (req, res, next) {
    const {
        type,
        status,
        sdate,
        edate,
        searchBy,
        searchText,
        start,
        limit
    } = req.query;

    try {
        let {
            data: {
                list,
                all,
                count,
                success,
                success_all,
                tips,
                status: resstatus
            }
        } = await taskSearch({
            type,
            sdate,
            edate,
            start,
            limit,
            searchBy,
            searchText,
            status
        });
        res.json({
            all: all || 0,
            count,
            start,
            limit,
            list: (list && Array.isArray(list.l)) ? list.l : [],
            success: resstatus == '1',
            tips: tips
        })
    } catch (error) {
        console.log('**************** error', error);
    }
})

module.exports = router;