module.exports = {
    username: { //用户名
        type: String,
        default: '',
        required: true,
        comment: '用户名'

    },
    guiderid: { //推广人id
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: '//mapp.alicdn.com/1571622754899D0vApol5yaxNpaQ.png',
    },
    realname: { //真实姓名
        type: String,
        default: '',

    },
    sex: { //用户性别
        type: String,
        default: '',
    },
    password: { //用户密码
        type: String,
        default: ''
    },
    transactionPassword: { //交易密码
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
    qq: { //用户QQ
        type: String,
        default: ''
    },
    wx: { //用户微信
        type: String,
        default: ''
    },
    ww: { //用户旺旺
        type: String,
        default: ''
    },
    vip: { //vip等级
        type: Number,
        default: 0
    },
    kscore: { //充值积分
        type: Number,
        default: 0
    },
    registTime: { //注册时间
        type: String,
        default: ''
    },
    registIP: { //注册IP
        type: String,
        default: ''
    },
    lastLoginTime: { //上次登陆时间
        type: String,
        default: ''
    },
    lastLoginIP: { //上次登陆IP
        type: String,
        default: ''
    }
}