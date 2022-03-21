// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import store from '../src/store/index'
import instance from "@/axios";
import util from "@/util/util.js";
import '../theme/index.css'
import App from './App'
import router from './router'
import moment from 'moment'

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$http = instance
Vue.prototype.util = util
Vue.prototype.$moment = moment;


//路由跳转后，页面回到顶部
router.afterEach(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
})


new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    store
})