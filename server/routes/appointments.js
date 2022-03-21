const router = require('koa-router')();
const checkToken = require('../api/checkToken');
const Appointment = require('../models/Appointment');
const Comment = require('../models/Comment');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const moment = require('moment')

/*
@route POST /appointments/userMakeAppointment
@desc 用户发起预约接口
@access 接口是公开的
*/
router.post('/userMakeAppointment', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let appointment_user_id = jwt.decode(authorization.substr(7)).user_id;
    let appointment = new Appointment({
        house_id: ctx.request.body.houseId,
        house_owner_id: ctx.request.body.houseOwnerId,
        appointment_user_id: appointment_user_id,
        appointment_date: ctx.request.body.appointmentDate,
        appointment_time: ctx.request.body.appointmentTime,
        appointment_phone: ctx.request.body.appointmentPhone,
    })
    await appointment.save().then(docs => {
        ctx.state = 200,
            ctx.body = { success: 'true' }
    }).catch((err) => {
        console.log(err);
        ctx.state = 200,
            ctx.body = { success: 'false' }
    });
})

/*
@route GET /appointments/checkForAppointment
@desc 检查是否预约接口
@access 接口是公开的
*/
router.get('/checkForAppointment', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    let house_id = ctx.request.query.houseId
    let findAppointment = await Appointment.findOne({ appointment_user_id: user_id, house_id: house_id }).then()
    if (findAppointment) {
        if (moment().isAfter(findAppointment.appointment_date)) {
            ctx.state = 200
            ctx.body = { checkAppointment: 'complete' }
        } else {
            ctx.state = 200
            ctx.body = { checkAppointment: 'true' }
        }

    } else {
        ctx.state = 200
        ctx.body = { checkAppointment: 'false' }
    }
})

/*
@route GET /appointments/userCancelAppointment
@desc 用户取消预约接口
@access 接口是公开的
*/
router.get('/userCancelAppointment', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    let house_id = ctx.request.query.houseId
    await Appointment.deleteOne({ appointment_user_id: user_id, house_id: house_id }).then(docs => {
        ctx.state = 200
        ctx.body = {
            success: 'true'
        }
    })
})

/*
@route GET /appointments/aidCancelAppointment
@desc 用aid取消预约接口
@access 接口是公开的
*/
router.get('/aidCancelAppointment', checkToken, async(ctx) => {
    let appointment_id = ctx.request.query.AppointmentId
    await Appointment.deleteOne({ _id: appointment_id }).then(docs => {
        ctx.state = 200
        ctx.body = {
            success: 'true'
        }
    })
})

/*
@route GET /appointments/seeMakeAppointment
@desc 用户查看发起预约接口
@access 接口是公开的
*/
router.get('/seeMakeAppointment', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    await Appointment.find({ appointment_user_id: user_id }).populate({ path: 'house_id', select: 'house_number contact_number' }).then(docs => {
        ctx.state = 200
        ctx.body = { seeMakeAppointmentList: docs }
    }).catch(error => {
        console.log(error)
    })
})

/*
@route GET /appointments/seeReceiveAppointment
@desc 用户查看收到预约接口
@access 接口是公开的
*/
router.get('/seeReceiveAppointment', checkToken, async(ctx) => {
    const authorization = ctx.get('Authorization');
    let user_id = jwt.decode(authorization.substr(7)).user_id;
    await Appointment.find({ house_owner_id: user_id }).populate({ path: 'house_id', select: 'house_number' }).then(docs => {
        ctx.state = 200
        ctx.body = { seeReceiveAppointmentList: docs }
    }).catch(error => {
        console.log(error)
    })
})

/*
@route GET /appointments/ownerAgreeAppointment
@desc 房东同意预约接口
@access 接口是公开的
*/
router.get('/ownerAgreeAppointment', checkToken, async(ctx) => {
    let appointment_id = ctx.request.query.appointmentId
    let appointment_place = ctx.request.query.appointmentPlace
    await Appointment.update({ _id: appointment_id }, { appointment_place: appointment_place, house_owner_confirm: true }).then(doc => {
        ctx.state = 200
        ctx.body = {
            success: 'true'
        }
    })
})

/*
@route GET /appointments/userAgreeAppointment
@desc 用户同意预约接口
@access 接口是公开的
*/
router.get('/userAgreeAppointment', checkToken, async(ctx) => {
    let appointment_id = ctx.request.query.appointmentId
    console.log(appointment_id)
    await Appointment.update({ _id: appointment_id }, { appointment_user_confirm: true }).then(doc => {
        ctx.state = 200
        ctx.body = {
            success: 'true'
        }
    })
})

/*
@route GET /appointments/ownerModifyAppointment
@desc 房东修改预约接口
@access 接口是公开的
*/
router.post('/ownerModifyAppointment', checkToken, async(ctx) => {
    let appointment_id = ctx.request.body.appointmentId
    let appointment_date = ctx.request.body.appointmentDate
    let appointment_time = ctx.request.body.appointmentTime
    let appointment_place = ctx.request.body.appointmentPlace
    let appointmentInfo = await Appointment.findOne({ _id: appointment_id }).populate({ path: 'house_id' })
    await Appointment.update({ _id: appointment_id }, { appointment_date: appointment_date, appointment_time: appointment_time, appointment_place: appointment_place, house_owner_confirm: true, appointment_user_confirm: false }).then(doc => {
        ctx.state = 200
        ctx.body = {
            success: 'true',
            appointmentInfo
        }
    })
})

/*
@route GET /appointments/aidCancelAppointment
@desc aid取消预约接口
@access 接口是公开的
*/
router.get('/aidCancelAppointment', checkToken, async(ctx) => {
    let appointment_id = ctx.request.query.AppointmentId
    await Appointment.deleteOne({ _id: appointment_id }).then(docs => {
        ctx.state = 200
        ctx.body = {
            success: 'true'
        }
    })
})

/*
@route POST /appointments/commentAppointment
@desc 评论预约接口
@access 接口是公开的
*/
router.post('/commentAppointment', checkToken, async(ctx) => {
    let comment = new Comment({
        appointment_id: ctx.request.body.appointmentId,
        arrive: ctx.request.body.arrive,
        appointment_score: ctx.request.body.appointmentScore,
        true_reason: ctx.request.body.trueReason,
        defaulter: ctx.request.body.defaulter,
        false_reason: ctx.request.body.falseReason
    })
    await Appointment.updateOne({ _id: ctx.request.body.appointmentId }, { comment: true })
    await comment.save().then(docs => {
        ctx.status = 200
        ctx.body = {
            success: 'true'
        }
    })
})

/*
@route GET /appointments/checkComment
@desc aid取消预约接口
@access 接口是公开的
*/
router.get('/checkComment', checkToken, async(ctx) => {
    let appointment_id = ctx.request.query.appointmentId
    await Comment.findOne({ appointment_id: appointment_id }).then(docs => {
        ctx.status = 200
        ctx.body = {
            commentResult: docs
        }
    })
})

module.exports = router.routes()