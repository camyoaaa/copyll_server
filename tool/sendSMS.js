const {
    validSMSTemplateCode,
    validSMSSignName,
    RegionId,
    client,
} = require('../config/alicore');

const {
    generateRandomNumber
} = require('./commonFunc');
exports.sendCaptcha = function (PhoneNumbers) {
    const sixCaptcha = generateRandomNumber(100000, 999999); //验证码范围
    return new Promise((resolve, reject) => {
        client.request('SendSms', {
            RegionId,
            PhoneNumbers,
            SignName: validSMSSignName,
            TemplateCode: validSMSTemplateCode,
            TemplateParam: JSON.stringify({
                code: sixCaptcha
            })
        }, {
            method: 'POST'
        }).then((result) => {
            resolve({
                sixCaptcha,
                result
            });
        }, (ex) => {
            reject(ex);
        })
    });
};