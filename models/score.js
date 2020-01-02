//积分表
module.exports = {
    userid: {
        //用户ID
        type: String,
        default: "",
        required: true
    },
    phone: {
        type: Number
    },
    score: {
        type: Number,
        default: 0
    },
    type: {
        type: Number, //0系统充值,1个人充值,2推广提成,3任务花费
        default: 0
    },
    recordId: {
        //消费或者充值id
        type: String,
        default: ""
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    remark: {
        //消费备注
        type: String,
        default: ""
    }
};
