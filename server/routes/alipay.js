const router = require('koa-router')();
const AlipaySdk = require('alipay-sdk').default;
const AlipayFormData = require('alipay-sdk/lib/form').default;
const fs = require('fs')
const path = require('path')
const request = require('request')
const checkToken = require('../api/checkToken');
const Promotion = require('../models/Promotion')
const House = require('../models/House');
const moment = require('moment')
const jwt = require('jsonwebtoken');

/*
@route GET /alipay/pay
@desc 支付列表接口
@access 接口是公开的
*/
router.post('/pay', checkToken, async(ctx) => {
    let promotion_price = ctx.request.body.promotionPrice
    let house_number_promotion = ctx.request.body.house_number_promotion
    let tradeNo = new Date().getTime()
    const alipaySdk = new AlipaySdk({
        appId: '2016102100730562',
        privateKey: fs.readFileSync(path.join(__dirname, '../config/pem/private_key.pem'), 'ascii'),
        alipayPublicKey: fs.readFileSync(path.join(__dirname, '../config/pem/alipay_public_key.pem'), 'ascii'),
        gateway: 'https://openapi.alipaydev.com/gateway.do'
    });
    const formData = new AlipayFormData();

    formData.setMethod('get')
    formData.addField('appId', '2016102100730562')
    formData.addField('bizContent', {
        outTradeNo: tradeNo,
        productCode: 'FAST_INSTANT_TRADE_PAY',
        totalAmount: promotion_price,
        subject: house_number_promotion,
        body: house_number_promotion,
    });

    const result = await alipaySdk.exec(
        'alipay.trade.page.pay', {}, { formData: formData },
    );

    // result 为可以跳转到支付链接的 url
    ctx.body = {
        result,
        tradeNo
    }
})

/*
@route POST /alipay/tradeNo
@desc 获取支付结果接口
@access 接口是公开的
*/
router.get('/tradeNo', checkToken, async(ctx) => {
    let outTradeNo = ctx.request.query.tradeNo
    if (!outTradeNo) {
        ctx.body = {
            status: -1,
            info: "支付查询需要订单号"
        }
    }
    const alipaySdk = new AlipaySdk({
        appId: '2016102100730562',
        privateKey: fs.readFileSync(path.join(__dirname, '../config/pem/private_key.pem'), 'ascii'),
        alipayPublicKey: fs.readFileSync(path.join(__dirname, '../config/pem/alipay_public_key.pem'), 'ascii'),
        gateway: 'https://openapi.alipaydev.com/gateway.do'
    });
    const formData = new AlipayFormData();
    formData.setMethod('get')
    formData.addField('appId', '2016102100730562')
    formData.addField('bizContent', {
        outTradeNo: outTradeNo
    });
    var code = ''
    await alipaySdk.exec(
            'alipay.trade.query', {}, { formData: formData },
        )
        .then(result => {
            if (result) {
                return new Promise((resolve, reject) => {
                    request(result, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            let obj = JSON.parse(body)
                            resolve(obj)
                        } else {
                            reject(error)
                        }
                    })
                }).then(response => {
                    ctx.body = {
                        status: 200,
                        info: '查询成功',
                        trade_status: response.alipay_trade_query_response.trade_status
                    }
                }).catch(err => {
                    ctx.body = {
                        status: -1,
                        info: '查询失败'
                    }
                })
            } else {
                ctx.body = {
                    status: -1,
                    info: '查询失败'
                }
            }
        }).catch(err => {
            ctx.body = {
                status: -1,
                info: '查询失败'
            }
        });
})



/*
@route POST /alipay/addPromotion
@desc 新增推广接口
@access 接口是公开的
*/
router.post('/addPromotion', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    const house_id = ctx.request.body.houseId
    const user_id = jwt.decode(authorization.substr(7)).user_id
    const start_time = ctx.request.body.startTime
    const promotion_time = ctx.request.body.promotionTime
    const trade_no = ctx.request.body.tradeNo
    let end_time = ""
    switch (promotion_time) {
        case "3d":
            end_time = moment(start_time).add(3, 'd')
            break;
        case "7d":
            end_time = moment(start_time).add(7, 'd')
            break;
        case "15d":
            end_time = moment(start_time).add(15, 'd')
            break;
        case "1M":
            end_time = moment(start_time).add(1, 'M')
            break;
        case "3M":
            end_time = moment(start_time).add(3, 'M')
            break;
        case "6M":
            end_time = moment(start_time).add(6, 'M')
            break;
        case "1y":
            end_time = moment(start_time).add(1, 'y')
            break;
    }
    let promotion = new Promotion({
        house_id: house_id,
        user_id: user_id,
        start_time: start_time,
        end_time: end_time,
        promotion_price: ctx.request.body.promotionPrice,
        trade_no: trade_no
    })
    await House.updateOne({ _id: house_id }, { promotion: 'wait' })
    await promotion.save().then((promotion) => {
            ctx.status = 200;
            ctx.body = { success: 'true' };
        })
        .catch((err) => {
            console.log(err);
        });
})

/*
@route GET /alipay/getProtionHistory
@desc 获取用户推广历史接口
@access 接口是公开的
*/
router.get('/getProtionHistory', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    const user_id = jwt.decode(authorization.substr(7)).user_id
    await Promotion.find({ user_id: user_id }).populate({ path: "house_id", select: 'house_number community_name' }).then(docs => {
        ctx.status = 200
        ctx.body = {
            'proHouseList': docs
        }
    })
})

/*
@route GET /alipay/applyRefund
@desc 用户申请退款接口
@access 接口是公开的
*/
router.get('/applyRefund', checkToken, async(ctx) => {
    let promotion_id = ctx.request.query.promotionId
    await Promotion.updateOne({ _id: promotion_id }, { refund: 'apply' }).then(docs => {
        ctx.status = 200
        ctx.body = {
            success: 'true'
        }
    })
})

module.exports = router.routes()