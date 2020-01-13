var express = require("express");
var router = express.Router();
var API_CONFIG = require('../config/index');
const laxios = require('../tool/lieliuAxios');
const {
    generateTaskID,
    filterObject,
    generateFuzzyQuery
} = require('../tool/commonFunc');

const DB = require("../models");
const TaskModel = DB.getModel("Tasks");

const saveTask = async function (taskform) {

}

//保存模板
router.post('/template/save', async function (req, res, next) {
    let success = false;
    const {
        taskid,
        plan: {
            daily,
            total,
            dateRange: [sdate, edate]
        },
    } = req.body;
    try {
        let result = await TaskModel.create({
            ...req.body,
            daily,
            total,
            sdate,
            edate,
            luserid: API_CONFIG.USER_NAME,
            kuserid: req.userid,
            taskid: generateTaskID(),
            status: 0 //只保存
        });
        if (result) {
            success = true;
        }
    } catch (error) {
        console.log(error);

    } finally {
        res.json({
            status: success ? 200 : 500,
            msg: success ? '方案保存成功' : '系统错误,请重试'
        })
    }
});

//更新任务模板
router.put('/template/update', async function (req, res, next) {

    let updateSuccess = false;
    const {
        taskid,
        plan: {
            daily,
            total,
            dateRange: [sdate, edate]
        },
    } = req.body;
    try {
        let result = await TaskModel.update({
            taskid
        }, {
            $set: {
                ...req.body,
                daily,
                total,
                sdate,
                edate
            }
        });

        updateSuccess = !!result;
    } catch (error) {
        updateSuccess = false;
    } finally {
        res.json({
            status: updateSuccess ? 200 : 500,
            msg: updateSuccess ? '更新成功' : '更新失败'
        })
    }
});


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
    let taskid = generateTaskID();
    try {

        let publish = await laxios({
            url: '/ll/task_add',
            method: 'get',
            params: {
                username: API_CONFIG.USER_NAME,
                id: taskid,
                begin_time: req.body.sdate,
                type: 0,
                count: req.body.total,
                hour: req.body.alloc,
                target: JSON.parse(req.body.targetInfo).itemlink,
                keyword: req.body.keywords,
                browse_time: req.body.scantime,
                depth: req.body.scandeep,
            }


        }).catch((error) => {
            console.log('****************************error \n', error);
        });
        let result = await TaskModel.create({
            ...req.body,
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
            msg: success ? '方案保存成功' : '系统错误,请重试'
        })
    }
});



//查询任务模板
router.get('/template/list', async function (req, res, next) {
    try {
        const {
            platform,
            category,
            taskname,
            type,
            start,
            limit
        } = req.query;
        let findCondition = filterObject({ //有效的查询条件,过滤掉空值
            kuserid: req.userid,
            platform,
            category,
            type,
            taskname
        })

        if (findCondition.taskname) { //任务名称模糊匹配
            findCondition.taskname = new RegExp(findCondition.taskname);
        }
        let countPromise = TaskModel.countDocuments(findCondition);
        let queryPromise = TaskModel.find(findCondition).sort({
            '_id': -1
        }).skip((Number(start) - 1) * Number(limit)).limit(Number(limit)).select({
            luserid: 0,
            kuserid: 0,
            __v: 0,
            _id: 0
        });

        const [total, list] = await Promise.all([countPromise, queryPromise]);
        res.json({
            status: 200,
            msg: '获取成功',
            list: [...list],
            pageinfo: {
                total,
                start,
                limit
            }
        })
    } catch (error) {
        res.json({
            status: 500,
            msg: '系统错误,请重试'
        })
    }


});



//删除任务模板
router.delete('/template/delete', async function (req, res, next) {
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