const mongoose = require("mongoose");
const MongooseSchema = mongoose.Schema;
const CollectionName = 'Tasks';

const {
    generateTaskID,
    filterObject
} = require('../tool/commonFunc');

const GetLieliuType = require('../tool/getLieliuType');


const STATUS = {
    ASTEMP: -1, //作为模板,
    ERROR: -9, //任务异常(未提交,未扣款等),
    DOING: 0, //处理中,
    PAUSE: 7, //暂停,
    CANCELING: 8, //取消中
    BACKSOME: 9, //部分退款,
    BACKALL: 10 //全部退款
}


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
    istemp: { //是否是模板
        type: Boolean,
        default: false
    },
    taskid: {
        //任务id
        type: String,
        default: "",
        required: true
    },
    status: {
        //任务状态  11保存  -9订单未提交,未扣款,
        type: Number,
        default: 0
    },
    description: { //任务状态描述
        type: String,
        default: ''
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
    },
    refreshms: {
        type: Number,
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
//增加一条记录
TaskSchema.statics.addaRecord = function (record = {
    status,
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
    updatetime: Date.now(),
    refreshms: Date.now(),
    description
}) {
    if (!record.ltype) {
        record.ltype = GetLieliuType(record.platform, record.category, record.type);
    }
    return this.create(record);
}
TaskSchema.statics.saveTemp = function (record) {
        return this.addaRecord({
            ...record,
            status: -1 //作为模板
        });
    },
    TaskSchema.statics.publicTask = function (record) {
        return this.addaRecord({
            ...record,
            status: 0 //处理中
        });
    },


    //更新模板
    TaskSchema.statics.updateTemp = function (taskid, payload) {
        return this.update({
            taskid
        }, {
            $set: payload
        });
    }


//获取模板列表
TaskSchema.statics.getTempList = function (condition = {
    kuserid,
    platform,
    category,
    type,
    taskname,
    start,
    limit
}) {
    let findCondition = filterObject(condition); //有效的查询条件,过滤掉空值

    if (findCondition.taskname) { //任务名称模糊匹配
        findCondition.taskname = new RegExp(findCondition.taskname);
    }
    findCondition.status = -1; //任务状态
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


TaskSchema.statics.getTaskList = function (condition = {
    kuserid,
    platform,
    category,
    type,
    sdate,
    edate,
    taskid,
    taskname,
    status: 1
}) {
    return this.getList({
        ...condition,
        status: 0
    });
}

//删除模板
TaskSchema.statics.deleteTemp = function (taskid) {
    return this.deleteOne(taskid)
}
//获取状态为进行中的20条记录,并返回任务id
TaskSchema.statics.getDoingTask20 = function (currentms) {

    return new Promise((resolve, reject) => {

    });
    return this.find({
        refreshms: {
            $lte: currentms - 5 * 60 * 60
        }
    }).limit(20).select('taskid')
}

//更新任务状态
TaskSchema.statics.updateStatus = function (idstatus) {
    return this.bulkWrite(idstatus.map((ele) => {
        return {
            updateOne: {
                filter: {
                    taskid: ele.id
                },
                update: {
                    refreshms: Date.now(),
                    status: ele.status
                }
            }
        }
    }));
}


const taskModel = mongoose.model(CollectionName, TaskSchema, CollectionName);
module.exports = taskModel;