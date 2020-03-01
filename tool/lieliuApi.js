const laxios = require('./lieliuAxios');
const getLieliuType = require('./getLieliuType');

//发布任务
exports.taskPublish = function (data) {
    return laxios({
        url: '/ll/task_add',
        method: 'post',
        data
    });
};

//取消任务
exports.taskCancel = function (id) {
    return laxios({
        url: '/ll/task_cancel',
        method: 'get',
        params: {
            id
        }
    });
};

//查询任务
exports.taskSearch = function ({
    type,
    sdate,
    edate,
    searchBy,
    searchText,
    start,
    limit
}) {
    let params = {
        type,
        line: limit,
        page: start,
        date1: sdate,
        date2: edate,
        do: searchText ? searchBy : 'all'
    }
    if (searchText) {
        params[searchBy] = searchText;
        params.params = searchText;
    }

    return laxios({
        url: '/ll/task_list',
        method: 'get',
        params
    });
};

//查询店铺信息
exports.tbShopSearch = function (url) {
    return laxios({
        //https://e.lieliu.com/api/query_taobao_shop.json,
        url: '/api/query_taobao_shop.json',
        method: 'post',
        data: {
            url
        }
    });
}

//查询淘口令,返回淘宝商品id
exports.tklSearch = function (tkl) {
    return laxios({
        url: '/api/query_taokouling.json',
        method: 'get',
        params: {
            key: tkl
        }
    });
}