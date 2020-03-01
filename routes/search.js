var express = require("express");
var router = express.Router();

const {
    tbShopSearch,
    tklSearch,
} = require('../tool/lieliuApi');

//查询淘宝店铺信息
router.get('/tb_shop', async function (req, res, next) {

    try {
        let result = await tbShopSearch(req.query.url);
        console.log('**************tbshop**********\n', result.headers);
    } catch (error) {
        console.log('**************tbshop error**********\n', error);
    }
})

//根据淘口令查询淘宝商品id
router.get('/tklToid', async function (req, res) {
    try {
        let result = await tklSearch(req.query.tkl);
        console.log('**************tklToid**********\n', result.headers);
    } catch (error) {
        // console.log('**************tklToid error**********\n', error);
    }
});
module.exports = router