/**
 * 猎流接口
 */
const axios =require('axios');
const queryString = require('query-string');
const md5 = require('md5');


const LAPI_URL = 'http://api.lieliu.com:1024/' //猎流api地址
const VER = 5; //api版本
const REQUST_TIMEOUT = 6000; // 请求超时时间
const USER_NAME = "u_1859976"; //用于请求的用户名
const USER_PEM = 'bede9557b4db3fa39463020b91c32fb9'; //用户请求秘钥
const FORMAT = 'json'; //返回数据格式

const COMMON_PARAMS = {
    ver:5,
    username:'u_1859976',
    format:'json'
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
    plusParams.browse_time = "100-180";

    let signkey = getSignkey(config.url,plusParams,timestamp);
    plusParams.signkey = signkey;
    Object.assign(paramsPointer,plusParams);

    console.log('**************plusParams', config);
    
    return config
}, (error) => {
    console.log('**************request error', error);
    return Promise.reject(error)
})

// 响应拦截器
laxios.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    console.log('**************response error', error);
    return Promise.reject(error)
})

const getSignkey=function(url,params,timestamp){
    params = {
        ...params,
        timestamp
    };
    const paramstr = queryString.stringify(params, {
        strict:false,
        encode:false,
        sort: (a, b) => a.localeCompare(b)
    });
    console.log(`${url}?${paramstr}&${USER_PEM}`);
    return md5(encodeURIComponent(`${url}?${paramstr}&${USER_PEM}`));
}

module.exports = laxios