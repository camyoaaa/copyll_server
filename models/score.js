const mongoose = require("mongoose");
const MongooseSchema = mongoose.Schema;
const CollectionName = 'Scores';


// const UsersModel = require('./usersnew.js');

const {
    generateTaskID
} = require('../tool/commonFunc');

//积分表
const ScoreSchemaDefine = {
    userid: {
        //用户ID
        type: String,
        default: "",
        required: true
    },
    score: {
        type: Number,
        default: 0,
        required: true
    },
    type: {
        type: Number, //0系统充值,1个人充值,2推广提成,3任务花费,4任务退回
        default: 0,
        required: true
    },
    recordId: {
        //任务或者充值id
        type: String,
        default: "",
        required: true
    },
    createTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    remark: {
        //消费备注
        type: String,
        default: ""
    }
};


const ScoreSchema = new MongooseSchema(ScoreSchemaDefine);

//增加一条积分记录
ScoreSchema.static.addaRecord = function (record = {
    userid,
    score,
    type,
    recordId,
    createTime: Date.now(),
    remark

}) {
    return context.create(record);
}

//系统赠送0
ScoreSchema.static.sysGive = function (userid) {
    return this.addaRecord({
        type: 0,
        userid,
        score: 200,
        recordId: generateTaskID(),
        remark: '系统赠送'
    });
}

//积分充值1
ScoreSchema.static.recharge = function (userid, score, recordId) {
    return this.addaRecord({
        type: 1,
        userid,
        score,
        recordId,
        remark: '积分充值'
    });
}

//推广提成2
ScoreSchema.static.promoteDraw = function (userid, score) {
    return this.addaRecord({
        type: 2,
        userid,
        score,
        recordId: generateTaskID(),
        remark: '推广提成'
    });
}

//任务消耗3
ScoreSchema.static.taskSpend = function (userid, score, recordId) {
    return this.addaRecord({
        type: 3,
        userid,
        score,
        recordId,
        remark: '任务消耗'
    });
}

//任务退还4
ScoreSchema.static.taskReturn = function (userid, score, recordId) {
    return this.addaRecord({
        type: 4,
        userid,
        score,
        recordId,
        remark: '任务退还'
    });
}

module.exports = mongoose.model(CollectionName, ScoreSchema, CollectionName);