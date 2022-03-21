const koa = require('koa'),
    router = require('koa-router')(),
    bodyParser = require('koa-bodyparser'),
    mongoose = require('mongoose'),
    path = require('path'),
    staticFiles = require('koa-static');

//引入模块
const users = require('./routes/users.js');
const houses = require('./routes/houses.js');
const citys = require('./routes/citys.js');
const appointments = require('./routes/appointments.js');
const alipay = require('./routes/alipay.js');

//实例化koa
const app = new koa();


//配置post提交数据的中间件
app.use(bodyParser());

//静态资源中间件
app.use(staticFiles(path.join(__dirname)))


//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/hizu', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Mongodb Connectd...')
    })
    .catch((err) => {
        console.log(err)
    });



router.get('/', async(ctx) => {
    ctx.body = { ctx };
});

router.use('/users', users);
router.use('/houses', houses)
router.use('/citys', citys)
router.use('/appointments', appointments)
router.use('/alipay', alipay)

//配置路由
app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 3006;

app.listen(port, () => {
    console.log(`server started on ${port}`)
})