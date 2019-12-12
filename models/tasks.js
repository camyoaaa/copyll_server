module.exports = {
    userid: {
        type: String,
        default: '',
        required: true
    },
    taskid: { //用户名
        type: String,
        default: '',
        required: true

    },
    taskname: { //任务名称
        type: String,
        default: ''
    },
    platform: { //任务平台
        type: String,
        default: '',
        required: true,
    },
    category: { //任务范畴
        type: String,
        default: '',
        required: true,
    },
    type: { //任务类型
        type: String,
        default: '',
        required: true
    },
    sdate: { //开始时间
        type: String,
        default: '',
        required: true
    },
    edate: { //结束时间
        type: String,
        default: '',
        required: true
    },
    itemid: { //任务对象的id
        type: Number,
        default: 0,
        required: true
    },
    itemlink: { //任务对象的链接
        type: String,
        default: '',
        required: true
    },
    daliy: { //每日任务量
        type: Number,
        default: 0
    },
    scantime: { //浏览时间
        type: String,
        default: ''
    },
    scandeep: { //浏览深度
        type: Number,
        default: 0
    },
    keywords: { //关键词
        type: String,
        default: ''
    },
    remark: { //备注
        type: String,
        default: 0
    }

}