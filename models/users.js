const mongoose = require("mongoose");
const MongooseSchema = mongoose.Schema;

const CollectionName = 'Users';

const UserschemaDefine = {
    username: { //用户名
        type: String,
        default: '',
        required: true
    },
    userid: {
        type: Number,
        default: 0
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
        default: ''
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
        default: 11111111111,
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
    tscore: { //推广积分
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

const UserSchema = new MongooseSchema(UserschemaDefine);

//剥离记录中敏感信息
const filterUserInfo = (record, req) => {
    const {
        password,
        transactionPassword,
        __v,
        _id,
        ...usreInfo
    } = record;
    usreInfo.userid = _id;
    usreInfo.lastLoginIP = usreInfo.lastLoginIP || getClientIP(req);
    usreInfo.lastLoginTime = usreInfo.lastLoginTime || moment().format("YYYY-MM-DD HH:mm:ss");
    usreInfo.hasTradeCode = !!transactionPassword;
    return usreInfo;
};

//添加 Model 的静态方法

//用户注册
UserSchema.static.userRegist = function (username, phone, password, guiderid) {
    return this.create({
        username,
        guiderid,
        phone,
        password,
        kscore: 200,
        registIP: getClientIP(req),
        registTime: moment().format("YYYY-MM-DD HH:mm:ss")
    }).then((user) => {
        console.log('user', user);
        ScoreModel.sysGive(registSuccess._doc._id.toString());
    });
}

//手机号是否注册
UserSchema.static.IsPhoneRegist = function (phone) {
    return this.findOne({
        phone
    });
}

//用户登录
UserSchema.static.userLogin = function (phone, password) {
    return UserModel.findOneAndUpdate({
        phone,
        password
    }, {
        lastLoginTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        lastLoginIP: getClientIP(req)
    });
}

//
//获取用户信息
UserSchema.static.getInfo = function (userid) {
    return this.findOne({
        _id: userid
    });
}


//更新用户充值积分
UserSchema.static.modifyKScore = function (userid, kscore) {
    this.updateOne({
        userid
    }, {
        $inc: {
            kscore
        }
    }); //$inc表示增减
}

//更新用户推广积分
UserSchema.static.modifyTScore = function (userid, tscore) {
    this.updateOne({
        userid
    }, {
        $inc: {
            tscore
        }
    }); //$inc表示增减
}

module.exports = mongoose.model(CollectionName, UserSchema, CollectionName);