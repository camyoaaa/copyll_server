//积分表
module.exports = {
    userid: { //用户ID
        type: String,
        default: '',
        required: true,
    },
    score: {
        type: Number,
        default: 0,
    },
    type: {
        type: Number, //0个人充值,1推广提成,2任务花费
        default: 0
    },
    recordId: { //消费或者充值id
        type: String,
        default: ''
    },
    recordTime: { //消费或者充值时间
        type: String,
        default: ''
    }
}