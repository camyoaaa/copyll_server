/**
 * 提供公共的工具函数
 */
exports.randomNumber = function (start, end) {
    return start + Math.floor(Math.random() * (end - start));
}