const router = require('koa-router')();
const upload = require('../api/getpath.js');
const checkToken = require('../api/checkToken');
const House = require('../models/House');
const City = require('../models/City');
const Report = require('../models/Report');
const AuditFailed = require('../models/AuditFailed');
const jwt = require('jsonwebtoken');
const Promotion = require('../models/Promotion')
const Collection = require('../models/Collection')

/*
@route POST /houses/publish
@desc 发布房源接口
@access 接口是公开的
*/
router.post('/publish', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let house = new House({
            housing_type: ctx.request.body.housingType,
            rental_mode: ctx.request.body.rentalMode,
            community_name: ctx.request.body.communityName,
            sq_value: ctx.request.body.sqValue,
            cell_address: ctx.request.body.cellAddress,
            room: ctx.request.body.room,
            hall: ctx.request.body.hall,
            toilet: ctx.request.body.toilet,
            floorage: ctx.request.body.floorage,
            floor: ctx.request.body.floor,
            floor_all: ctx.request.body.floorAll,
            elevator: ctx.request.body.elevator,
            house_orientation: ctx.request.body.houseOrientation,
            subway_checked: ctx.request.body.subwayChecked,
            subway_station_value: ctx.request.body.subwayStationValue,
            price: ctx.request.body.price,
            payment_method: ctx.request.body.paymentMethod,
            rent_includes: ctx.request.body.rentIncludes,
            check_in_time: ctx.request.body.checkInTime,
            number: ctx.request.body.number,
            renovation: ctx.request.body.renovation,
            configuration_includes: ctx.request.body.configurationIncludes,
            rental_requirements: ctx.request.body.rentalRequirements,
            housing_description: ctx.request.body.housingDescription,
            house_img: ctx.request.body.houseImg,
            contacts: ctx.request.body.contacts,
            contactssex: ctx.request.body.contactssex,
            contact_number: ctx.request.body.contactNumber,
            house_number: ctx.request.body.houseNumber,
            user_id: jwt.decode(authorization.substr(7)).user_id,
        }


    )
    await house.save().then((house) => {
            ctx.status = 200;
            ctx.body = { success: 'true' };
            console.log('发布成功');
        })
        .catch((err) => {
            console.log(err);
        });
})

/*
@route POST /houses/uploadImg
@desc 图片上传接口
@access 接口是公开的
*/
router.post('/uploadImg', upload.single('file'), async(ctx, next) => {
    if (ctx.req.file) {
        ctx.body = 'http://' + ctx.host + '/uploads/houses/' + ctx.req.file.filename;
    } else {
        ctx.body = 'upload error';
    }
})

/*
@route GET /houses/getHouseList
@desc 获取房屋列表接口
@access 接口是公开的
*/
router.get('/getHouseList', async(ctx) => {
    let city = ctx.request.query.city;
    let pageNumberHouse = ctx.request.query.pageNumberHouse
    let sortType = ctx.request.query.sortType //type:Number，0:默认，按更新时间，1：租金正序，2：租金倒序，3：面积正序，4：面积倒序
    let style = ctx.request.query.style
    let aindex = ctx.request.query.aindex
    let bindex = ctx.request.query.bindex
    let cindex = ctx.request.query.cindex
    let dindex = ctx.request.query.dindex
    let eindex = ctx.request.query.eindex
    let findex = ctx.request.query.findex
    let gindex = ctx.request.query.gindex
    let hindex = ctx.request.query.hindex
    let iindex = ctx.request.query.iindex
    var houseListAll = new Array();
    var houseList = new Array();
    if (sortType == 0) {
        await House.find({ house_state: 1 }).populate({ path: 'sq_value', populate: { path: 'district_id', populate: { path: 'city_id', match: { city_number: city } } } }).populate({ path: 'subway_station_value', populate: { path: 'subwayLine_id' } }).populate({ path: "user_id" }).sort({ update_time: -1 }).then(docs => {
            houseListAll = docs
        }).catch(error => {
            console.log(error)
        })
    } else if (sortType == 1) {
        await House.find({ house_state: 1 }).populate({ path: 'sq_value', populate: { path: 'district_id', populate: { path: 'city_id', match: { city_number: city } } } }).populate({ path: 'subway_station_value', populate: { path: 'subwayLine_id' } }).populate({ path: "user_id" }).sort({ price: -1 }).then(docs => {
            houseListAll = docs
        }).catch(error => {
            console.log(error)
        })
    } else if (sortType == 2) {
        await House.find({ house_state: 1 }).populate({ path: 'sq_value', populate: { path: 'district_id', populate: { path: 'city_id', match: { city_number: city } } } }).populate({ path: 'subway_station_value', populate: { path: 'subwayLine_id' } }).populate({ path: "user_id" }).sort({ price: 1 }).then(docs => {
            houseListAll = docs
        }).catch(error => {
            console.log(error)
        })
    } else if (sortType == 3) {
        await House.find({ house_state: 1 }).populate({ path: 'sq_value', populate: { path: 'district_id', populate: { path: 'city_id', match: { city_number: city } } } }).populate({ path: 'subway_station_value', populate: { path: 'subwayLine_id' } }).populate({ path: "user_id" }).sort({ floorage: -1 }).then(docs => {
            houseListAll = docs
        }).catch(error => {
            console.log(error)
        })
    } else if (sortType == 4) {
        await House.find({ house_state: 1 }).populate({ path: 'sq_value', populate: { path: 'district_id', populate: { path: 'city_id', match: { city_number: city } } } }).populate({ path: 'subway_station_value', populate: { path: 'subwayLine_id' } }).populate({ path: "user_id" }).sort({ floorage: 1 }).then(docs => {
            houseListAll = docs
        }).catch(error => {
            console.log(error)
        })
    }
    for (i = 0; i < houseListAll.length; i++) {
        if (houseListAll[i].sq_value.district_id.city_id == null) {
            houseListAll.splice(i, 1)
            i = i - 1
        }
    }
    let promotionHouseList = houseListAll.filter(item => item.promotion == 'true')
    if (aindex != 'a0') {
        if (style == 'area') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].sq_value.district_id.district_number != aindex) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].subway_station_value == null || houseListAll[i].subway_station_value.subwayLine_id.subwayLine_number != aindex) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        }
    }
    if (bindex != 'b0') {
        if (style == 'area') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].sq_value.sq_number != bindex) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].subway_station_value.subwayStation_number != bindex) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        }
    }
    if (cindex != 'c0') {
        if (cindex == 'c1') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].rental_mode != '整租') {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (cindex == 'c2') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].rental_mode != '合租') {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        }
    }
    if (dindex != 'd0') {
        if (dindex == 'd1') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].housing_type != '公寓') {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (dindex == 'd2') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].housing_type != '小区') {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (dindex == 'd3') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].housing_type != '别墅') {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        }
    }
    if (eindex != 'e0') {
        if (eindex == 'e1') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].room != 1) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (eindex == 'e2') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].room != 2) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (eindex == 'e3') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].room != 3) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (eindex == 'e4') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].room < 4) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        }
    }
    if (findex != 'f0') {
        if (findex == 'f1') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].price > 1000) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (findex == 'f2') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].price < 1000 || houseListAll[i].price > 2000) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (findex == 'f3') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].price < 2000 || houseListAll[i].price > 3000) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (findex == 'f4') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].price < 3000 || houseListAll[i].price > 4000) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (findex == 'f5') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].price < 4000 || houseListAll[i].price > 8000) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (findex == 'f6') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].price < 8000) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        }
    }

    if (gindex != 'g0') {
        if (gindex == 'g1') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].house_orientation != "朝东") {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (gindex == 'g2') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].house_orientation != "朝南") {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (gindex == 'g3') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].house_orientation != "朝西") {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (gindex == 'g4') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].house_orientation != "朝北") {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (gindex == 'g5') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].house_orientation != "南北") {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (gindex == 'g6') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].house_orientation != "东南") {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (gindex == 'g7') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].house_orientation != "东北") {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (gindex == 'g8') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].house_orientation != "西南") {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (gindex == 'g9') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].house_orientation != "西北") {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (gindex == 'g10') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].house_orientation != "东西") {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        }
    }
    if (hindex != 'h0') {
        if (hindex == 'h1') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].promotion != 'true') {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (hindex == 'h2') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].payment_method != '押一付一') {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (hindex == 'h3') {
            function sortId(a, b) {
                return b.create_time - a.create_time
            }
            houseListAll.sort(sortId);
        }
    }
    if (iindex != 'i0') {
        if (iindex == 'i1') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].subway_station_value == null) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (iindex == 'i2') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].configuration_includes.includes('厨房') != true) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        } else if (iindex == 'i3') {
            for (i = 0; i < houseListAll.length; i++) {
                if (houseListAll[i].configuration_includes.includes('独立卫生间') != true) {
                    houseListAll.splice(i, 1)
                    i = i - 1
                }
            }
        }
    }

    houseList = houseListAll
    let totalCountHouse = houseList.length //总数据条数
    let pageSizeHouse = 10 //单页数据量
    houseList = houseList.slice(pageNumberHouse * pageSizeHouse - pageSizeHouse, pageNumberHouse * pageSizeHouse)
    let totalPageHouse = Math.ceil(totalCountHouse / pageSizeHouse) //总页数
    ctx.status = 200
    ctx.body = { houseList, houseListAll, totalCountHouse, pageSizeHouse, totalPageHouse, promotionHouseList }
})

/*
@route GET /houses/getHouseDetail
@desc 获取房屋详情接口
@access 接口是公开的
*/
router.get('/getHouseDetail', async(ctx) => {
    let house_id = ctx.request.query.house_id
    let houseDetail = []
    let cellName = ''
    let cellNumber = ''
    let nearbyHouseList = []
    await House.find({ _id: house_id }).populate({ path: 'sq_value', populate: { path: 'district_id' } }).populate({ path: 'subway_station_value', populate: { path: 'subwayLine_id' } }).populate({ path: "user_id" }).then(docs => {
        houseDetail = docs
        cellName = docs[0].community_name
    }).catch(error => {
        console.log(error)
    })
    await House.find({ community_name: cellName, house_state: 1 }).count().then(doc => {
        cellNumber = doc
    })
    await House.find({ community_name: cellName, house_state: 1 }).then(docs => {
        nearbyHouseList = docs
    })
    for (var i = 0; i < nearbyHouseList.length; i++) {
        if (nearbyHouseList[i]._id == house_id) {
            nearbyHouseList.splice(i, 1)
            i = i - 1
        }
    }
    ctx.body = { houseDetail, cellNumber, nearbyHouseList }
})

/*
@route GET /houses/mapCellHouse
@desc 获取地图小区房屋接口
@access 接口是公开的
*/
router.get('/mapCellHouse', async(ctx) => {
    let cellName = ctx.request.query.cellName
    await House.find({ community_name: cellName, house_state: 1 }).populate({ path: 'sq_value', populate: { path: 'district_id' } }).sort({ update_time: -1 }).then(docs => {
        ctx.status = 200
        ctx.body = { 'houseList': docs }
    }).catch(error => {
        console.log(error)
    })
})

/*
@route POST /houses/searchCellList
@desc List页面搜索小区接口
@access 接口是公开的
*/
router.post('/searchCellList', async(ctx) => {
    let cellName = ctx.request.body.searchValue;
    let city = ctx.request.body.city;
    let pageNumberHouse = ctx.request.body.pageNumberHouse
    var houseListAll = new Array();
    var houseList = new Array();
    await House.find({ house_state: 1, community_name: { $regex: cellName } }).populate({ path: 'sq_value', populate: { path: 'district_id', populate: { path: 'city_id', match: { city_number: city } } } }).populate({ path: 'subway_station_value', populate: { path: 'subwayLine_id' } }).populate({ path: "user_id" }).then(docs => {
        houseListAll = docs
    }).catch(error => {
        console.log(error)
    })
    for (i = 0; i < houseListAll.length; i++) {
        if (houseListAll[i].sq_value.district_id.city_id == null) {
            houseListAll.splice(i, 1)
            i = i - 1
        }
    }
    houseList = houseListAll
    let totalCountHouse = houseList.length //总数据条数
    let pageSizeHouse = 20 //单页数据量
    houseList = houseList.slice(pageNumberHouse * pageSizeHouse - pageSizeHouse, pageNumberHouse * pageSizeHouse)
    let totalPageHouse = Math.ceil(totalCountHouse / pageSizeHouse) //总页数
    ctx.status = 200
    ctx.body = { houseList, houseListAll, totalCountHouse, pageSizeHouse, totalPageHouse }
})

/*
@route POST /houses/searchCellIndex
@desc Index页面搜索小区接口
@access 接口是公开的
*/
router.post('/searchCellIndex', async(ctx) => {
    let select = ctx.request.body.select;
    let cellName = ctx.request.body.searchValue;
    let city = ctx.request.body.city;
    let pageNumberHouse = ctx.request.body.pageNumberHouse
    var houseListAll = new Array();
    var houseList = new Array();
    await House.find({ house_state: 1, community_name: { $regex: cellName } }).populate({ path: 'sq_value', populate: { path: 'district_id', populate: { path: 'city_id', match: { city_number: city } } } }).populate({ path: 'subway_station_value', populate: { path: 'subwayLine_id' } }).populate({ path: "user_id" }).then(docs => {
        houseListAll = docs
    }).catch(error => {
        console.log(error)
    })
    for (i = 0; i < houseListAll.length; i++) {
        if (houseListAll[i].sq_value.district_id.city_id == null) {
            houseListAll.splice(i, 1)
            i = i - 1
        }
    }
    if (select == '合租') {
        for (i = 0; i < houseListAll.length; i++) {
            if (houseListAll[i].rental_mode != '合租') {
                houseListAll.splice(i, 1)
                i = i - 1
            }
        }
    } else if (select == '整租') {
        for (i = 0; i < houseListAll.length; i++) {
            if (houseListAll[i].rental_mode != '整租') {
                houseListAll.splice(i, 1)
                i = i - 1
            }
        }
    } else if (select == '公寓') {
        for (i = 0; i < houseListAll.length; i++) {
            if (houseListAll[i].housing_type != '公寓') {
                houseListAll.splice(i, 1)
                i = i - 1
            }
        }
    }
    houseList = houseListAll
    let totalCountHouse = houseList.length //总数据条数
    let pageSizeHouse = 20 //单页数据量
    houseList = houseList.slice(pageNumberHouse * pageSizeHouse - pageSizeHouse, pageNumberHouse * pageSizeHouse)
    let totalPageHouse = Math.ceil(totalCountHouse / pageSizeHouse) //总页数
    ctx.status = 200
    ctx.body = { houseList, houseListAll, totalCountHouse, pageSizeHouse, totalPageHouse }
})

/*
@route POST /houses/uploadImg
@desc 图片上传接口
@access 接口是公开的
*/
router.post('/uploadImg', upload.single('file'), async(ctx, next) => {
    if (ctx.req.file) {
        ctx.body = 'http://' + ctx.host + '/uploads/houses/' + ctx.req.file.filename;
    } else {
        ctx.body = 'upload error';
    }
})


/*
@route POST /houses/reportHouse
@desc 举报房源接口
@access 接口是公开的
*/
router.post('/reportHouse', async(ctx) => {
    let report = new Report({
        house_id: ctx.request.body.houseId,
        reason: ctx.request.body.reason,
        remarks: ctx.request.body.remarks
    })
    await report.save().then(docs => {
        ctx.status = 200;
        ctx.body = {
            success: 'true'
        }
    })
})

/*
@route GET /houses/getPromotion
@desc 获取推广情况接口
@access 接口是公开的
*/
router.get('/getPromotion', async(ctx) => {
    let house_id = ctx.request.query.house_id
    let house_promotion = ''
    await House.findOne({ _id: house_id }, { promotion: 1 }).then(doc => {
        house_promotion = doc.promotion
    })
    if (house_promotion == 'true' || house_promotion == 'wait') {
        await Promotion.findOne({ house_id: house_id }).then(doc => {
            ctx.status = 200;
            ctx.body = {
                'nowPromotion': doc
            }
        })
    }
})

/*
@route GET /houses/checkFailedReason
@desc 查看不通过原因接口
@access 接口是公开的
*/
router.get('/checkFailedReason', async(ctx) => {
    let house_id = ctx.request.query.houseId
    await AuditFailed.findOne({ house_id: house_id }).then(docs => {
        ctx.status = 200
        ctx.body = {
            reason: docs
        }
    })
})

/*
@route GET /houses/getRecommendList
@desc 获取首页热门房源列表接口
@access 接口是公开的
*/
router.get('/getRecommendList', async(ctx) => {
    let city = ctx.request.query.city
    let index = ctx.request.query.index
    let houseList = []
    if (index == 0) {
        await House.find({ house_state: 1 }).populate({ path: 'sq_value', populate: { path: 'district_id', populate: { path: 'city_id', match: { city_number: city } } } }).populate({ path: 'subway_station_value', populate: { path: 'subwayLine_id' } }).then(docs => {
            houseList = docs
        }).catch(error => {
            console.log(error)
        })
        for (i = 0; i < houseList.length; i++) {
            if (houseList[i].sq_value.district_id.city_id == null) {
                houseList.splice(i, 1)
                i = i - 1
            }
        }
        let recommendList = houseList.filter(item => item.promotion == 'true')
        ctx.status = 200
        ctx.body = {
            recommendList
        }
    } else if (index == 1) {
        await House.find({ house_state: 1 }).populate({ path: 'sq_value', populate: { path: 'district_id', populate: { path: 'city_id', match: { city_number: city } } } }).populate({ path: 'subway_station_value', populate: { path: 'subwayLine_id' } }).sort({ create_time: -1 }).then(docs => {
            houseList = docs
        }).catch(error => {
            console.log(error)
        })
        for (i = 0; i < houseList.length; i++) {
            if (houseList[i].sq_value.district_id.city_id == null) {
                houseList.splice(i, 1)
                i = i - 1
            }
        }
        let recommendList = houseList
        ctx.status = 200
        ctx.body = {
            recommendList
        }
    } else if (index == 2) {
        let houseList = []
        let collectionNumber = []
        let recommendList = []
        await Collection.find().populate({ path: 'house_id', populate: { path: 'sq_value', populate: { path: 'district_id', populate: { path: 'city_id', match: { city_number: city } } } } }).then(docs => {
            houseList = docs
        })
        for (i = 0; i < houseList.length; i++) {
            if (houseList[i].house_id.sq_value.district_id.city_id == null) {
                houseList.splice(i, 1)
                i = i - 1
            }
        }
        for (i = 0; i < houseList.length; i++) {
            recommendList.push(houseList[i])
            collectionNumber.push(0)
            for (j = 0; j < houseList.length; j++) {
                if (houseList[i].house_id._id == houseList[j].house_id._id) {
                    if (collectionNumber[i] != 0) {
                        houseList.splice(j, 1)
                        j = j - 1
                        collectionNumber[i]++
                    } else { collectionNumber[i]++ }
                }
            }
        }
        ctx.status = 200
        ctx.body = {
            recommendList,
            collectionNumber
        }
    }
})

/*
@route GET /houses/getDistrictHouseList
@desc 获取房屋列表接口
@access 接口是公开的
*/
router.get('/getDistrictHouseList', async(ctx) => {
    let city = ctx.request.query.city;
    let aindex = ctx.request.query.aindex
    let bindex = ctx.request.query.bindex
    var districtHouseListAll = new Array();
    var districtHouseList = new Array();
    await House.find({ house_state: 1 }).populate({ path: 'sq_value', populate: { path: 'district_id', populate: { path: 'city_id', match: { city_number: city } } } }).populate({ path: 'subway_station_value', populate: { path: 'subwayLine_id' } }).populate({ path: "user_id" }).sort({ update_time: -1 }).then(docs => {
        districtHouseListAll = docs
    }).catch(error => {
        console.log(error)
    })
    for (i = 0; i < districtHouseListAll.length; i++) {
        if (districtHouseListAll[i].sq_value.district_id.city_id == null) {
            districtHouseListAll.splice(i, 1)
            i = i - 1
        }
    }
    for (i = 0; i < districtHouseListAll.length; i++) {
        if (districtHouseListAll[i].sq_value.district_id.district_number != aindex) {
            districtHouseListAll.splice(i, 1)
            i = i - 1
        }
    }
    if (bindex != "b0") {
        for (i = 0; i < districtHouseListAll.length; i++) {
            if (districtHouseListAll[i].sq_value.sq_number != bindex) {
                districtHouseListAll.splice(i, 1)
                i = i - 1
            }
        }
    }
    if (districtHouseListAll.length > 16) {
        districtHouseList = districtHouseListAll.splice(0, 16)
    } else {
        districtHouseList = districtHouseListAll
    }
    ctx.status = 200
    ctx.body = { districtHouseList }
})

/*
@route GET /houses/getSubwayLineHouseList
@desc 获取房屋列表接口
@access 接口是公开的
*/
router.get('/getSubwayLineHouseList', async(ctx) => {
    let city = ctx.request.query.city;
    let aindex = ctx.request.query.aindex
    let bindex = ctx.request.query.bindex
    var subwayLineHouseListAll = new Array();
    var subwayLineHouseList = new Array();
    await House.find({ house_state: 1 }).populate({ path: 'sq_value', populate: { path: 'district_id', populate: { path: 'city_id', match: { city_number: city } } } }).populate({ path: 'subway_station_value', populate: { path: 'subwayLine_id' } }).populate({ path: "user_id" }).sort({ update_time: -1 }).then(docs => {
        subwayLineHouseListAll = docs
    }).catch(error => {
        console.log(error)
    })
    for (i = 0; i < subwayLineHouseListAll.length; i++) {
        if (subwayLineHouseListAll[i].sq_value.district_id.city_id == null) {
            subwayLineHouseListAll.splice(i, 1)
            i = i - 1
        }
    }

    for (i = 0; i < subwayLineHouseListAll.length; i++) {
        if (subwayLineHouseListAll[i].subway_station_value == null || subwayLineHouseListAll[i].subway_station_value.subwayLine_id.subwayLine_number != aindex) {
            subwayLineHouseListAll.splice(i, 1)
            i = i - 1
        }
    }
    if (bindex != "b0") {
        for (i = 0; i < subwayLineHouseListAll.length; i++) {
            if (subwayLineHouseListAll[i].sq_value.sq_number != bindex) {
                subwayLineHouseListAll.splice(i, 1)
                i = i - 1
            }
        }
    }
    if (subwayLineHouseListAll.length > 16) {
        subwayLineHouseList = subwayLineHouseListAll.splice(0, 16)
    } else {
        subwayLineHouseList = subwayLineHouseListAll
    }
    ctx.status = 200
    ctx.body = { subwayLineHouseList }
})

/*
@route GET /houses/resubmission
@desc 重新提交接口
@access 接口是公开的
*/
router.get('/resubmission', async(ctx) => {
    let house_id = ctx.request.query.houseId
    await House.updateOne({ _id: house_id }, { house_state: 2 }).then(doc => {
        ctx.status = 200
        ctx.body = {
            success: 'true'
        }
    })
})

module.exports = router.routes();