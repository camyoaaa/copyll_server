/**
 * 猎流接口
 */
import axios from 'axios'
import queryString from 'query-string'
import md5 from 'md5'

const LAPI_URL = 'http://api.lieliu.com:1024/' //猎流api地址
const VER = 5; //api版本
const REQUST_TIMEOUT = 6000; // 请求超时时间
const USER_NAME = "u_1859976"; //用于请求的用户名
const USER_PEM = 'bede9557b4db3fa39463020b91c32fb9'; //用户请求秘钥
const FORMAT = 'json'; //返回数据格式

const laxios = axios.create({ // 创建 axios 实例
    baseURL: LAPI_URL,
    timeout: REQUST_TIMEOUT
})

// 请求拦截器
laxios.interceptors.request.use(config => {
    let plusParams = config[config.method == 'post' ? 'data' : 'params'];
    Object.assign(plusParams, );
    plusParams = {
        ...plusParams,
        ...new ExtraParams({
            url: config.url,
            params: plusParams
        })
    }

    console.log('**************plusParams', plusParams);
    return config
}, (err) => {
    return Promise.reject(error)
})

// 响应拦截器
laxios.interceptors.response.use((response) => {
    return response.data
}, (err) => {
    return Promise.reject(error)
})


class ExtraParams {
    constructor({
        url,
        params
    }) {
        this.timestamp = Math.ceil(Date.now() / 1000); //时间戳 秒
        this.signkey = this.getSignkey({
            url,
            params
        })
    }
    getSignkey() {
        params = {
            ...params,
            timestamp: this.timestamp
        };
        const paramstr = queryString.stringify(params, {
            sort: (a, b) => a.localeCompare(b)
        });
        return md5(encodeURIComponent(`${url}?${paramstr}&${USER_PEM}`));
    }
}

ExtraParams.prototype = {
    format: FORMAT,
    ver: VER,
    username: USER_NAME,
}

export default laxios