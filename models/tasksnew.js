const mongoose = require("mongoose");
const MongooseSchema = mongoose.Schema;
const CollectionName = "Tasks";

const commonFunc = require("../tool/commonFunc");
const filterObject = commonFunc.filterObject
const GetLieliuType = require("../tool/getLieliuType");

const STATUS = {
    ASTEMP: -1, //作为模板,
    ERROR: -9, //任务异常(未提交,未扣款等),
    DOING: 0, //处理中,
    PAUSE: 7, //暂停,
    CANCELING: 8, //取消中
    BACKSOME: 9, //部分退款,
    BACKALL: 10 //全部退款
};

const TaskSchemaDefine = {
    kuserid: {
        //客多达用户名
        type: String,
        required: true
    },

    taskid: String,
    status: Number, //任务状态  -1为模板 11保存  -9订单未提交,未扣款,,
    status_description: String, //任务状态描述,
    name: String,
    platform: {
        //任务平台
        type: String,
        required: true
    },
    category: {
        //任务范畴
        type: String,
        required: true
    },
    type: {
        //任务类型
        type: String,
        required: true
    },
    ltype: {
        //猎流任务类型
        type: String,
        required: true
    },
    sdate: {
        //开始时间
        type: String,
        required: true
    },
    edate: {
        //结束时间
        type: String,
        required: true
    },
    targetid: String,
    targeturl: String,
    targetimg: String,
    targettitle: String,
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
    plan: String,
    daily: Number,
    alloc: String, //"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,11,11,12,9,9"
    payscore: Number,
    backscore: Number,
    total: Number,
    scantime: String,
    scandeep: Number,
    keywords: String,
    remark: String,
    updatetime: {
        type: Date,
        default: Date.now
    },
    refreshms: {
        //数据更新时间
        type: Number,
        default: Date.now
    }
};

const TaskSchema = new MongooseSchema(TaskSchemaDefine);

/**TaskSchema权限设置**/
TaskSchema.set("toJSON", {
    // toJSON时能够转换
    getters: true,
    virtuals: true
});
TaskSchema.set("toObject", {
    // toObject时能够转换
    getters: true,
    virtuals: true
});

/**TaskSchema静态方法**/
TaskSchema.statics.addTemp = function (record) {
    return this.create({
        ...record,
        status: STATUS.ASTEMP //作为模板
    });
}
TaskSchema.statics.addTask = function (record) {
    return this.create({
        ...record,
        status: 0 //处理中
    });
}
//更新模板
TaskSchema.statics.updateTemp = function (taskid, payload) {
    return this.update({
        taskid,
        status: STATUS.ASTEMP //status为-1表示模板
    }, {
        $set: payload
    });
};
//获取记录列表
TaskSchema.statics.getList = function (
    condition = {
        kuserid,
        taskid,
        status,
        platform,
        category,
        type,
        name,
        sdate,
        edate,
        start,
        limit
    }
) {
    let findCondition = filterObject(condition); //有效的查询条件,过滤掉空值

    if (findCondition.name) {
        //任务名称模糊匹配
        findCondition.name = new RegExp(findCondition.name);
    }
    let countPromise = this.countDocuments(findCondition);
    let queryPromise = this.find(findCondition)
        .sort({
            _id: -1
        })
        .skip((Number(start) - 1) * Number(limit))
        .limit(Number(limit))
        .select({
            //这里的参数是排除字段
            kuserid: 0,
            __v: 0,
            _id: 0
        });

    return Promise.all([countPromise, queryPromise]);
};
//获取模板列表
TaskSchema.statics.getTempList = function (condition) {
    let extra = {
        status: STATUS.ASTEMP
    }
    return this.getList(Object.assign(condition, extra));
};
//获取任务列表
TaskSchema.statics.getTaskList = function (condition) {
    return this.getList(condition);
};

//删除模板
TaskSchema.statics.deleteTemp = function (taskid) {
    return this.deleteOne(taskid);
};

//取消
TaskSchema.statics.cancelTask = function (taskid) {
    return this.updateOne({
        taskid
    }, {
        status: STATUS.CANCELING
    });
};
//获取状态为进行中的20条记录,并返回任务id
TaskSchema.statics.getDoingTask20 = function (currentms) {
    return this.find({
            refreshms: {
                $lte: currentms - 5 * 60 * 60
            }
        })
        .sort({
            refreshms: 1
        })
        .limit(20)
        .select("taskid");
};

//更新任务状态
TaskSchema.statics.updateStatus = function (idstatus) {
    return this.bulkWrite(
        idstatus.map(ele => {
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
            };
        })
    );
};

const taskModel = mongoose.model(CollectionName, TaskSchema, CollectionName);
module.exports = taskModel;