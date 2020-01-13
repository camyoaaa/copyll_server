const {
    Schema
} = require("mongoose");

module.exports = {
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