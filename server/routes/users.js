const router = require('koa-router')();
//用于密码加密
const md5 = require('md5');
//时间插件
const moment = require('moment');
//createToken
const createToken = require('../api/createToken');
//验证码
const svgCaptcha = require('svg-captcha');
const User = require('../models/User');
const Collection = require('../models/Collection');
const Message = require('../models/Message');
const lowerCase = require('lower-case');
const checkToken = require('../api/checkToken');
var checkcaptcha = "";
const jwt = require('jsonwebtoken');
const upload = require('../api/getavatarpath.js');

/*
@route GET /users/test
@desc 测试接口
@access 接口是公开的
*/
router.get('/test', async(ctx) => {
    ctx.status = 200;
    ctx.body = { msg: '这是一个测试接口' };
})



/*
@route POST /users/register
@desc 注册接口
@access 接口是公开的
*/
router.post('/register', async(ctx) => {
    let user = new User({
        username: ctx.request.body.name,
        password: md5(ctx.request.body.pass), //加密
        email: ctx.request.body.email,
        phone: ctx.request.body.phone,
        password_grade: ctx.request.body.password_grade
    });
    let findName = await User.find({ username: user.username });
    let findEmail = await User.find({ email: user.email });
    let findPhone = await User.find({ phone: user.phone });
    if (findName.length > 0) {
        ctx.status = 200;
        ctx.body = { success: 'name' }; //用户已存在
    } else if (findEmail.length > 0) {
        ctx.status = 200;
        ctx.body = { success: 'email' }; //邮箱已占用
    } else if (findPhone.length > 0) {
        ctx.status = 200;
        ctx.body = { success: 'phone' }; //手机号已占用
    } else {
        await user.save().then((user) => {
                ctx.status = 200;
                ctx.body = { success: 'true' }; //注册成功
            })
            .catch((err) => {
                console.log(err);
            });

    }
})

/*
@route POST /users/login
@desc 登录接口
@access 接口是公开的
*/
router.post('/login', async(ctx) => {
    let username = ctx.request.body.name;
    let password = md5(ctx.request.body.pass);
    let captcha = lowerCase(ctx.request.body.captcha);
    let doc = await User.findOne({ username: username })
    if (captcha != checkcaptcha) {
        console.log(checkcaptcha);
        ctx.status = 200;
        ctx.body = {
            captcha: false
        }
        return;
    } else {
        ctx.status = 200;
        ctx.body = {
            captcha: true
        }
        if (!doc) {
            console.log('检查到用户名不存在');
            ctx.status = 200;
            ctx.body = {
                info: false
            }
        } else if (doc.password === password) {
            console.log('密码一致!');
            //生成一个新的token
            let token = createToken(doc._id);
            //更新登录时间
            let login_time = new Date;
            await User.updateOne({ _id: doc._id }, { login_time: login_time }).then()
            ctx.status = 200;
            ctx.body = {
                success: true,
                username,
                token, //登录成功要创建一个新的token
                create_time: doc.create_time,
                login_time: doc.login_time
            };
        } else {
            console.log('密码错误!');
            ctx.status = 200;
            ctx.body = {
                success: false
            };
        }
    }
})

/*
@route POST /users/forgetPass
@desc 忘记密码接口
@access 接口是公开的
*/
router.post('/forgetPass', async(ctx) => {
    let name = ctx.request.body.name;
    let new_pass = md5(ctx.request.body.newPass);
    let phone = lowerCase(ctx.request.body.phone);
    let findUser = await User.findOne({ username: name })
    if (findUser) {
        if (findUser.phone == phone) {
            await User.updateOne({ password: new_pass }).then(doc => {
                ctx.body = {
                    info: 'success'
                }
            })
        } else {
            ctx.body = {
                info: 'phone'
            }
        }
    } else {
        ctx.body = {
            info: 'name'
        }
    }

})

/*
@route POST /users/captcha
@desc 验证码接口
@access 接口是公开的
*/
router.get('/captcha', async(ctx) => {
    var captcha = svgCaptcha.create({ //这种生成的是随机数验证码
        size: 4, //验证码长度
        fontSize: 50, //字体大小
        ignoreChars: '0o1i',
        width: 90,
        height: 40,
    });
    checkcaptcha = lowerCase(captcha.text);
    console.log(checkcaptcha);
    ctx.response.type = 'image/svg+xml';
    ctx.status = 200;
    ctx.body = captcha.data;
})

/*
@route GET /users/getUser
@desc 验证码接口
@access 接口是公开的
*/
router.get('/getUser', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id
    await User.findOne({ _id: user_id }).then(doc => {
        ctx.status = 200;
        ctx.body = { 'userInfo': doc }
    })
})

/*
@route POST /users/uploadAvatar
@desc 头像上传接口
@access 接口是公开的
*/
router.post('/uploadAvatar', upload.single('file'), async(ctx, next) => {
    if (ctx.req.file) {
        ctx.status = 200;
        ctx.body = 'http://' + ctx.host + '/uploads/avatar/' + ctx.req.file.filename;
    } else {
        ctx.status = 200;
        ctx.body = 'upload error';
    }
})

/*
@route GET /users/saveAvatar
@desc 头像保存接口
@access 接口是公开的
*/
router.get('/saveAvatar', checkToken, async(ctx) => {
    let avatar = ctx.request.query.avatar
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id
    await User.updateOne({ _id: user_id }, { avatar: avatar }).then(doc => {
        ctx.status = 200;
        ctx.body = {
            success: 'true'
        }
    }).catch(error => {
        console.log(error)
    });
})

/*
@route POST /users/modifyName
@desc 修改用户名接口
@access 接口是公开的
*/
router.post('/modifyName', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id
    let newName = ctx.request.body.newName
    let findName = await User.find({ username: newName }).then()
    if (findName.length > 0) {
        ctx.status = 200;
        ctx.body = {
            success: 'false'
        }
    } else {
        await User.updateOne({ _id: user_id }, { username: newName }).then(doc => {
            ctx.status = 200;
            ctx.body = {
                success: 'true'
            }
        }).catch(error => {
            console.log(error)
        });
    }
})

/*
@route POST /users/modifyEmail
@desc 修改邮箱接口
@access 接口是公开的
*/
router.post('/modifyEmail', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id
    let oldEmail = ctx.request.body.oldEmail
    let newEmail = ctx.request.body.newEmail
    let findUserEmail = await User.findOne({ _id: user_id }, { email: true }).then()
    if (oldEmail === findUserEmail.email) {
        let findEmail = await User.find({ email: newEmail }).then()
        if (findEmail.length > 0) {
            ctx.status = 200;
            ctx.body = {
                info: 'exist'
            }
        } else {
            await User.updateOne({ _id: user_id }, { email: newEmail }).then(doc => {
                ctx.status = 200;
                ctx.body = {
                    info: 'success'
                }
            }).catch(error => {
                console.log(error)
            });
        }
    } else {
        ctx.status = 200;
        ctx.body = {
            info: 'error'
        }
    }
})

/*
@route POST /users/modifyPhone
@desc 修改手机接口
@access 接口是公开的
*/
router.post('/modifyPhone', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id
    let oldPhone = ctx.request.body.oldPhone
    let newPhone = ctx.request.body.newPhone
    let findUserPhone = await User.findOne({ _id: user_id }, { phone: true }).then()
    if (oldPhone === findUserPhone.phone) {
        let findPhone = await User.find({ phone: newPhone }).then()
        if (findPhone.length > 0) {
            ctx.status = 200;
            ctx.body = {
                info: 'exist'
            }
        } else {
            await User.updateOne({ _id: user_id }, { phone: newPhone }).then(doc => {
                ctx.status = 200;
                ctx.body = {
                    info: 'success'
                }
            }).catch(error => {
                console.log(error)
            });
        }
    } else {
        ctx.status = 200;
        ctx.body = {
            info: 'error'
        }
    }
})

/*
@route POST /users/modifyPassword
@desc 修改密码接口
@access 接口是公开的
*/
router.post('/modifyPassword', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id
    let oldPassword = md5(ctx.request.body.oldPassword)
    let newPassword = md5(ctx.request.body.newPassword)
    let passwordGrade = ctx.request.body.passwordGrade
    let findUserPassword = await User.findOne({ _id: user_id }).then()
    if (oldPassword === findUserPassword.password) {
        await User.updateOne({ _id: user_id }, { password: newPassword, password_grade: passwordGrade }).then(doc => {
            ctx.status = 200;
            ctx.body = {
                success: 'true'
            }
        }).catch(error => {
            console.log(error)
        });
    } else {
        ctx.status = 200;
        ctx.body = {
            success: 'false'
        }
    }
})

/*
@route GET /users/addCollection
@desc 添加收藏接口
@access 接口是公开的
*/
router.get('/addCollection', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    let house_id = ctx.request.query.houseId;
    let doc = ({
        user_id: user_id,
        house_id: house_id
    })
    await Collection.create(doc).then(doc => {
        ctx.status = 200;
        ctx.body = {
            success: 'true'
        }
    }).catch(err => {
        console.log(err)
        ctx.status = 200;
        ctx.body = {
            success: 'false'
        }
    })
})

/*
@route GET /users/inspectionCollection
@desc 检查收藏接口
@access 接口是公开的
*/
router.get('/inspectionCollection', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    let house_id = ctx.request.query.houseId;
    let findInspectionCollection = await Collection.findOne({ user_id: user_id, house_id: house_id }).then()
    if (findInspectionCollection != null) {
        ctx.status = 200,
            ctx.body = {
                thisCollection: true
            }
    } else {
        ctx.status = 200,
            ctx.body = {
                thisCollection: false
            }
    }
})

/*
@route GET /users/deleteCollection
@desc 添加收藏接口
@access 接口是公开的
*/
router.get('/deleteCollection', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    let house_id = ctx.request.query.houseId;
    let doc = ({
        user_id: user_id,
        house_id: house_id
    })

    await Collection.deleteOne(doc).then(doc => {
        ctx.status = 200;
        ctx.body = {
            success: 'true'
        }
    }).catch(err => {
        console.log(err)
        ctx.status = 200;
        ctx.body = {
            success: 'false'
        }
    })
})

/*
@route GET /users/getCollection
@desc 获取用户收藏接口
@access 接口是公开的
*/
router.get('/getCollection', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    await Collection.find({ user_id: user_id }).populate({ path: 'house_id', populate: { path: 'sq_value', populate: { path: 'district_id' } } }).populate({ path: 'house_id', populate: { path: 'subway_station_value', populate: { path: 'subwayLine_id' } } }).then(docs => {
        ctx.status = 200;
        ctx.body = {
            collectionList: docs
        }
    })
})

/*
@route GET /users/getUserHouse
@desc 获取用户发布房屋接口
@access 接口是公开的
*/
router.get('/getUserHouse', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    let house_state = ctx.request.query.houseState;
    if (house_state) {
        await House.find({ user_id: user_id, house_state: house_state }).then(docs => {
            ctx.status = 200;
            ctx.body = { userHouseList: docs }
        })
    } else {
        await House.find({ user_id: user_id }).then(docs => {
            ctx.status = 200;
            ctx.body = { userHouseList: docs }
        })
    }
})

/*
@route GET /users/getPromotionHouse
@desc 获取用户预约房屋接口
@access 接口是公开的
*/
router.get('/getPromotionHouse', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    let youProHouseList = new Array
    let daiProHouseList = new Array
    let wuProHouseList = new Array
    let userHouseList = new Array
    await House.find({ user_id: user_id, house_state: 1 }).then(docs => {
        userHouseList = docs
    })
    await House.find({ user_id: user_id, house_state: 1, promotion: 'true' }).then(docs => {
        youProHouseList = docs
    })
    await House.find({ user_id: user_id, house_state: 1, promotion: 'wait' }).then(docs => {
        daiProHouseList = docs
    })
    await House.find({ user_id: user_id, house_state: 1, promotion: 'false' }).then(docs => {
        wuProHouseList = docs
    })
    ctx.status = 200
    ctx.body = {
        youProHouseList,
        wuProHouseList,
        daiProHouseList,
        userHouseList
    }
})

/*
@route GET /users/deleteUserHouse
@desc 用户删除房屋接口
@access 接口是公开的
*/
router.get('/deleteUserHouse', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    let house_id = ctx.request.query.houseId;
    await House.updateOne({ _id: house_id, user_id: user_id }, { house_state: 4 }).then(docs => {
        ctx.status = 200;
        ctx.body = { success: 'true' }
    }).catch(error => {
        ctx.status = 200;
        ctx.body = { success: 'false' }
    })
})

/*
@route GET /users/recoveryUserHouse
@desc 用户恢复房屋接口
@access 接口是公开的
*/
router.get('/recoveryUserHouse', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    let house_id = ctx.request.query.houseId;
    await House.updateOne({ _id: house_id, user_id: user_id }, { house_state: 2 }).then(docs => {
        ctx.status = 200;
        ctx.body = { success: 'true' }
    }).catch(error => {
        ctx.status = 200;
        ctx.body = { success: 'false' }
    })
})

/*
@route POST /users/editUserHouse
@desc 用户修改房屋接口
@access 接口是公开的
*/
router.post('/editUserHouse', checkToken, async(ctx) => {
    let house_id = ctx.request.body.houseId
    let houseUpdate = {
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
        update_time: new Date
    }
    await House.updateOne({ _id: house_id }, houseUpdate).then(docs => {
        ctx.status = 200
        ctx.body = { success: "true" }
    }).catch(error => console.log(error))
})

/*
@route GET /users/newMessage
@desc 新建消息接口
@access 接口是公开的
*/
router.get('/newMessage', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = "";
    if (ctx.request.query.userId == 'token') {
        user_id = jwt.decode(authorization.substr(7)).user_id;
    } else {
        user_id = ctx.request.query.userId
    }
    let message = new Message({
        message_header: ctx.request.query.messageHeader,
        message_content: ctx.request.query.messageContent,
        user_id: user_id,
        message_jump: ctx.request.query.messageJump,
        message_type: ctx.request.query.messageType,
    });
    await message.save().then(doc => {
        ctx.status = 200
        ctx.body = {
            doc
        }
    }).catch(error => console.log(error))
})

/*
@route GET /users/getMessage
@desc 显示消息接口
@access 接口是公开的
*/
router.get('/getMessage', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    let newMessageNumber = await Message.find({ user_id: user_id, message_state: true }).count().then()
    await Message.find({ user_id: user_id }).sort({ _id: -1 }).then(docs => {
        ctx.status = 200
        ctx.body = { messageList: docs, newMessageNumber }
    }).catch(error => console.log(error))
})

/*
@route GET /users/messageRead
@desc 消息已读接口
@access 接口是公开的
*/
router.get('/messageRead', checkToken, async(ctx) => {
    let message_id = ctx.request.query.messageId
    await Message.updateOne({ _id: message_id }, { message_state: false }).then().catch(error => console.log(error))
    ctx.status = 200
})

/*
@route GET /users/checkSecurity
@desc 检查密码安全性接口
@access 接口是公开的
*/
router.get('/checkSecurity', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    let findUser = await User.findOne({ _id: user_id }).then().catch(error => console.log(error))
    let findMessage_1 = await Message.findOne({ user_id: user_id, message_type: 1 }).then().catch(error => console.log(error))
    if (findUser.password_grade < 2) {
        if (!findMessage_1) {
            ctx.status = 200
            ctx.body = {
                'password_grade': findUser.password_grade
            }
        }

    }
})

/*
@route GET /users/deleteMessage
@desc 删除消息接口
@access 接口是公开的
*/
router.get('/deleteMessage', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    let message_id = ctx.request.query.messageId
    await Message.deleteOne({ _id: message_id }).then(doc => {
        ctx.status = 200
        ctx.body = {
            success: "true"
        }
    }).catch(error => {
        console.log(error)
    })
})


module.exports = router.routes();