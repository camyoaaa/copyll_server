const mongoose = require("mongoose");
const MongooseSchema = mongoose.Schema;
const CollectionName = 'Tasks';

const {
    generateTaskID,
    filterObject
} = require('../tool/commonFunc');

const TaskSchemaDefine = {
    luserid: {
        //猎流用户名
        type: String,
        default: "",
        required: true
    },
    kuserid: {
        //客多达用户名
        type: String,
        default: "",
        required: true
    },
    taskid: {
        //任务id
        type: String,
        default: "",
        required: true
    },
    status: {
        //任务状态  0保存 1已发布
        type: Number,
        default: 0
    },
    taskname: {
        //任务名称
        type: String,
        default: ""
    },
    platform: {
        //任务平台
        type: String,
        default: "",
        required: true
    },
    category: {
        //任务范畴
        type: String,
        default: "",
        required: true
    },
    type: {
        //任务类型
        type: String,
        default: "",
        required: true
    },
    ltype: {
        //猎流任务类型
        type: String,
        default: "",
        required: true
    },
    sdate: {
        //开始时间
        type: String,
        default: "",
        required: true
    },
    edate: {
        //结束时间
        type: String,
        default: "",
        required: true
    },
    targetinfo: {
        //任务对象的一些信息,任务类型不一样,target存放的数据也可能不一样.
        type: String,
        default: "",
        get: function (str) {
            return JSON.parse(str);
        },
        set: function (obj) {
            return JSON.stringify(obj);
        }
    },
    plan: {
        type: String,
        default: "",
        get: function (str) {
            return JSON.parse(str);
        },
        set: function (obj) {
            return JSON.stringify(obj);
        }
    },
    daily: {
        //每日任务量
        type: Number,
        default: 0
    },
    alloc: {
        type: String,
        default: "",
        get: function (str) {
            return str.split(',');
        },
        set: function (arr) {
            if (Array.isArray(arr)) {
                return arr.join(',');
            } else {
                return arr
            }
        }
    },
    total: {
        //总任务量
        type: Number,
        default: 0
    },
    scantime: {
        //浏览时间
        type: String,
        default: ""
    },
    scandeep: {
        //浏览深度
        type: Number,
        default: 0
    },
    keywords: {
        //关键词
        type: String,
        default: "",
        get: function (str) {
            return str.split(',');
        },
        set: function (arr) {
            if (Array.isArray(arr)) {
                return arr.join(',');
            } else {
                return arr
            }
        }
    },
    remark: {
        //备注
        type: String,
        default: 0
    },
    updatetime: {
        type: Date,
        default: Date.now
    }
};

const TaskSchema = new MongooseSchema(TaskSchemaDefine);

/**TaskSchema权限设置**/
TaskSchema.set('toJSON', { // toJSON时能够转换
    getters: true,
    virtuals: true
});
TaskSchema.set('toObject', { // toObject时能够转换
    getters: true,
    virtuals: true
});

/**TaskSchema静态方法**/

//保存模板
TaskSchema.static.saveTemp = function (record = {
    status: 0,
    luserid,
    kuserid,
    taskid: generateTaskID(),
    taskname,
    platform,
    category,
    type,
    ltype,
    sdate,
    edate,
    targetinfo,
    plan,
    daily,
    alloc,
    total,
    scantime,
    scandeep,
    keywords,
    remark,
    updatetime: Date.now()

}) {
    return this.create(record);
}

//更新模板
TaskSchema.static.updateTemp = function (taskid, payload) {
    return this.update({
        taskid
    }, {
        $set: payload
    });
}

//获取模板列表
TaskSchema.static.getTempList = function (condition = {
    kuserid,
    platform,
    category,
    type,
    taskname
}) {
    let findCondition = filterObject(condition); //有效的查询条件,过滤掉空值

    if (findCondition.taskname) { //任务名称模糊匹配
        findCondition.taskname = new RegExp(findCondition.taskname);
    }
    let countPromise = this.countDocuments(findCondition);
    let queryPromise = this.find(findCondition).sort({
        '_id': -1
    }).skip((Number(start) - 1) * Number(limit)).limit(Number(limit)).select({ //这里的参数是排除字段
        luserid: 0,
        kuserid: 0,
        __v: 0,
        _id: 0
    });

    return Promise.all([countPromise, queryPromise]);
}

//删除模板
TaskSchema.static.deleteTemp = function (taskid) {
    return this.deleteOne(taskid)
}
module.exports = mongoose.model(CollectionName, TaskSchema, CollectionName);