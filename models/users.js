module.exports = {
    username: { //用户名
        type: String,
        default: '',
        required: true

    },
    userid: { //用户id
        type: String,
        default: '',
        required: true,
    },
    password: { //用户密码
        type: String,
        default: ''
    },
    phone: { //手机号码
        type: Number,
        default: 0,
        required: true
    },
    email: { //用户邮箱
        type: String,
        default: ''
    },
    vipgrade: { //vip等级
        type: Number,
        default: 0
    },
    chargescore: { //充值积分
        type: Number,
        default: 0
    },
    flowscore: { //流量积分
        type: Number,
        default: 0
    },
    validcode: {
        type: String,
        default: ''
    }
}