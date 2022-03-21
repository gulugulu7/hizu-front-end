const router = require('koa-router')();
const City = require('../models/City');
const District = require('../models/District')
const Sq = require('../models/Sq')
const House = require('../models/House')
const SubwayStation = require('../models/SubwayStation')
const SubwayLine = require('../models/SubwayLine')
const User = require('../models/User')

/*
@route GET /citys/getCity
@desc 获取城市列表接口
@access 接口是公开的
*/
router.get('/getCity', async(ctx) => {
    let cityList = await City.find().then();
    ctx.status = 200
    ctx.body = { cityList }
})


/*
@route GET /citys/getDistrict
@desc 获取行政区列表接口
@access 接口是公开的
*/
router.get('/getDistrict', async(ctx) => {
    let city = ctx.request.query.city
    let districtListAll = ""
    await District.find().populate({ path: 'city_id', match: { city_number: city } })
        .then(docs => {
            districtListAll = docs
        }).catch(error => {
            console.log(error)
        });
    for (i = 0; i < districtListAll.length; i++) {
        if (districtListAll[i].city_id == null) {
            districtListAll.splice(i, 1)
            i = i - 1
        }
    }
    ctx.status = 200
    ctx.body = { 'districtList': districtListAll }
})

/*
@route GET /citys/getSq
@desc 获取商圈列表接口
@access 接口是公开的
*/
router.get('/getSq', async(ctx) => {
    let district = ctx.request.query.district
    let sqListAll = ""
    await Sq.find().populate({ path: 'district_id', match: { district_number: district }, populate: { path: 'city_id' } })
        .then(docs => {
            sqListAll = docs
        }).catch(error => {
            console.log(error)
        });
    for (i = 0; i < sqListAll.length; i++) {
        if (sqListAll[i].district_id == null) {
            sqListAll.splice(i, 1)
            i = i - 1
        }
    }
    ctx.status = 200
    ctx.body = { 'sqList': sqListAll }

})

/*
@route GET /citys/getSubwayLine
@desc 获取地铁线列表接口
@access 接口是公开的
*/
router.get('/getSubwayLine', async(ctx) => {
    let city = ctx.request.query.city
    let subwayLineListAll = ""
    await SubwayLine.find().populate({ path: 'city_id', match: { city_number: city } })
        .then(docs => {
            subwayLineListAll = docs
        }).catch(error => {
            console.log(error)
        });
    for (i = 0; i < subwayLineListAll.length; i++) {
        if (subwayLineListAll[i].city_id == null) {
            subwayLineListAll.splice(i, 1)
            i = i - 1
        }
    }
    ctx.status = 200
    ctx.body = { 'subwayLineList': subwayLineListAll }

})

/*
@route GET /citys/getSubwayStation
@desc 获取地铁站列表接口
@access 接口是公开的
*/
router.get('/getSubwayStation', async(ctx) => {
    let subwayLine = ctx.request.query.subwayLine
    let subwayStationListAll = ""
    await SubwayStation.find().populate({ path: 'subwayLine_id', match: { subwayLine_number: subwayLine }, populate: { path: 'city_id' } })
        .then(docs => {
            subwayStationListAll = docs
        }).catch(error => {
            console.log(error)
        });;
    for (i = 0; i < subwayStationListAll.length; i++) {
        if (subwayStationListAll[i].subwayLine_id == null) {
            subwayStationListAll.splice(i, 1)
            i = i - 1
        }
    }
    ctx.status = 200
    ctx.body = { 'subwayStationList': subwayStationListAll }
})

/*
@route GET /citys/getDistrictHouse
@desc 获取行政区房屋数量接口
@access 接口是公开的
*/
router.get('/getDistrictHouse', async(ctx) => {
    let city = ctx.request.query.city
    let districtListAll = ""
    let houseNumber = []
    await District.find().populate({ path: 'city_id', match: { city_number: city } })
        .then(docs => {
            districtListAll = docs
        }).catch(error => {
            console.log(error)
        });
    for (i = 0; i < districtListAll.length; i++) {
        if (districtListAll[i].city_id == null) {
            districtListAll.splice(i, 1)
            i = i - 1
        }
    }
    for (i = 0; i < districtListAll.length; i++) {
        await House.find({ house_state: 1 }).populate({ path: 'sq_value', populate: { path: 'district_id', match: { _id: districtListAll[i]._id } } }).then(docs => {
            for (j = 0; j < docs.length; j++) {
                if (docs[j].sq_value.district_id == null) {
                    docs.splice(j, 1)
                    j = j - 1
                }
            }
            houseNumber.push(docs.length)
        })
    }
    ctx.status = 200
    ctx.body = { 'districtList': districtListAll, houseNumber }
})

/*
@route GET /citys/getDistrictCell
@desc 获取行政区小区接口
@access 接口是公开的
*/
router.get('/getDistrictCell', async(ctx) => {
    let district = ctx.request.query.district
    let cellListAll = []
    let cellName = []
    let cellNumber = []
    await House.find({ house_state: 1 }).populate({ path: 'sq_value', populate: { path: 'district_id', match: { district_name: district }, populate: { path: 'city_id' } } }).then(docs => {
        cellListAll = docs
    })
    for (i = 0; i < cellListAll.length; i++) {
        if (cellListAll[i].sq_value.district_id == null) {
            cellListAll.splice(i, 1)
            i = i - 1
        }
    }
    for (i = 0; i < cellListAll.length; i++) {
        cellName.push(cellListAll[i].community_name)
        cellNumber.push(0)
        for (j = 0; j < cellListAll.length; j++) {
            if (cellListAll[i].community_name == cellListAll[j].community_name) {
                if (cellNumber[i] != 0) {
                    cellListAll.splice(j, 1)
                    j = j - 1
                    cellNumber[i]++
                } else { cellNumber[i]++ }
            }
        }
    }
    ctx.status = 200
    ctx.body = { cellName, cellNumber }
})

router.get('/changeImga', async(ctx) => {
    let a = await House.find()
    let b = await User.find()
        // let a = await House.findOne({ _id: '5e1095004e5b0322b4c07f66' })
    for (var i = 0; i < a.length; i++) {
        let str1 = a[i].house_img
        var reg = new RegExp('localhost', "g")
        let str2 = str1.replace(reg, '111.67.204.223')
        await House.updateOne({ _id: a[i]._id }, { house_img: str2 })
    }
    for (var i = 0; i < b.length; i++) {
        let str3 = b[i].avatar
        var reg = new RegExp('localhost', "g")
        let str4 = str3.replace(reg, '111.67.204.223')
        await User.updateOne({ _id: b[i]._id }, { avatar: str4 })
    }
    ctx.body = {
        a: a[0]
    }
})

module.exports = router.routes()