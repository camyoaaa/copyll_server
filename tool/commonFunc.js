/**
 * 提供公共的工具函数
 */
//随机范围整数
const generateRandomNumber = function (start, end) {
    return start + Math.floor(Math.random() * (end - start));
}
//生成一个任务ID
const generateTaskID = function () { //获取订单号
    return `${new Date().getTime()}${generateRandomNumber(100000,999999)}`
}

//过滤对象空值属性
const filterObject = function (object) {
    for (const key in object) {
        !object[key] && delete object[key];
    }
    return object
}
exports.generateRandomNumber = generateRandomNumber;
exports.generateTaskID = generateTaskID
exports.filterObject = filterObject