const Core = require('@alicloud/pop-core'); //阿里云短信服务核心包

const validSMSTemplateCode = "SMS_179602114"; //验证码短信模板代码
const validSMSSignName = "客多达教育"; //验证码短信签名
const RegionId = "cn-hangzhou"; //验证码短信服务器区域ID
const client = new Core({
    accessKeyId: 'LTAI4FwYdSrqPqV4BB9pCQLe',
    accessKeySecret: 'DJ1GTsqEs6Vz6wygo2txnANlfNZ3cV',
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
});

const {
    randomNumber
} = require('./commonFunc');
exports.sendValidCode = function (PhoneNumbers) {
    const sixValidCode = randomNumber(100000, 999999); //验证码范围
    return new Promise((resolve, reject) => {
        client.request('SendSms', {
            RegionId,
            PhoneNumbers,
            SignName: validSMSSignName,
            TemplateCode: validSMSTemplateCode,
            TemplateParam: JSON.stringify({
                code: sixValidCode
            })
        }, {
            method: 'POST'
        }).then((result) => {
            resolve({
                sixValidCode,
                result
            });
        }, (ex) => {
            reject(ex);
        })
    });
};