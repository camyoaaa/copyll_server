/**
 * 猎流接口
 */
const axios = require('axios');
const queryString = require('query-string');
const md5 = require('md5');

const {
    LAPI_URL,
    VER,
    REQUST_TIMEOUT,
    USER_NAME,
    USER_PEM,
    FORMAT
} = require('../config/index');

const COMMON_PARAMS = {
    ver: VER,
    username: USER_NAME,
    format: FORMAT
}

const laxios = axios.create({ // 创建 axios 实例
    baseURL: LAPI_URL,
    timeout: REQUST_TIMEOUT
})


// 请求拦截器
laxios.interceptors.request.use(config => {
    let paramsPointer = config[config.method == 'post' ? 'data' : 'params'];
    let plusParams = {
        ...COMMON_PARAMS,
        ...paramsPointer
    };
    let timestamp = Math.ceil(Date.now() / 1000); //时间戳 秒

    plusParams.timestamp = timestamp;

    let signkey = getSignkey(config.url, plusParams, timestamp);
    plusParams.signkey = signkey;
    if (config.method == 'post') {
        //axios默认的config.headers.post['Content-Type'] == 'application/x-www-form-urlencoded',请求方法为post时data数据需要序列化一下
        config.data = queryString.stringify(plusParams);
    } else {
        Object.assign(paramsPointer, plusParams);
    }
    console.log('**************plusParams', queryString.parse(config.data));

    return config
}, (error) => {
    // console.log('**************request error', error);
    return Promise.reject(error)
})

// 响应拦截器
laxios.interceptors.response.use((response) => {
    console.log('*************** response', response.headers);
    return response.data
}, (error) => {
    console.log('**************response error', error);
    return Promise.reject(error)
})

const getSignkey = function (url, params, timestamp) {
    params = {
        ...params,
        timestamp
    };
    const paramstr = queryString.stringify(params, {
        strict: false,
        encode: false,
        sort: (a, b) => a.localeCompare(b)
    });
    console.log(`${url}?${paramstr}&${USER_PEM}`);
    return md5(encodeURIComponent(`${url}?${paramstr}&${USER_PEM}`));
}

module.exports = laxios