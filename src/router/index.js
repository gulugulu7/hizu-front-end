import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index.vue'
import Agreement from '@/views/Agreement.vue'
import Policy from '@/views/Policy.vue'
import Detail from '@/views/Detail.vue'
import List from '@/views/List.vue'
import Publish from '@/views/Publish.vue'
import User from '@/views/User.vue'
import UserMessage from '@/components/UserMessage.vue'
import UserCollection from '@/components/UserCollection.vue'
import ManageAll from '@/components/ManageAll.vue'
import ManageDisplay from '@/components/ManageDisplay.vue'
import ManageInAudit from '@/components/ManageInAudit.vue'
import ManageAuditFailed from '@/components/ManageAuditFailed.vue'
import ManageDeleted from '@/components/ManageDeleted.vue'
import UserProfile from '@/components/UserProfile.vue'
import MakeAppointment from '@/components/MakeAppointment.vue'
import ReceiveAppointment from '@/components/ReceiveAppointment.vue'
import ViewHouse from '@/components/ViewHouse.vue'
import EditHouse from '@/components/EditHouse.vue'
import PromotionHouse from '@/components/PromotionHouse.vue'
import MyPromotion from '@/components/MyPromotion.vue'
import Map from '@/views/Map.vue'
import store from '../store/index.js'
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(Router)

const router = new Router({
    // mode: "hash",
    routes: [{
            path: '/',
            redirect: { name: 'Index' }
        },
        {
            path: '/:city',
            name: 'Index',
            component: Index
        },
        {
            path: '/:city/user',
            name: 'User',
            component: User,
            children: [{
                    path: '',
                    redirect: { name: 'UserMessage' }
                },
                {
                    path: 'usermessage',
                    name: 'UserMessage',
                    component: UserMessage,
                },
                {
                    path: 'usercollection',
                    name: 'UserCollection',
                    component: UserCollection,
                },
                {
                    path: 'manageall',
                    name: 'ManageAll',
                    component: ManageAll,
                },
                {
                    path: 'managedisplay',
                    name: 'ManageDisplay',
                    component: ManageDisplay,
                },
                {
                    path: 'manageinaudit',
                    name: 'ManageInAudit',
                    component: ManageInAudit,
                },
                {
                    path: 'manageauditfailed',
                    name: 'ManageAuditFailed',
                    component: ManageAuditFailed,
                },
                {
                    path: 'managedeleted',
                    name: 'ManageDeleted',
                    component: ManageDeleted,
                },
                {
                    path: 'userprofile',
                    name: 'UserProfile',
                    component: UserProfile,
                },
                {
                    path: 'makeappointment',
                    name: 'MakeAppointment',
                    component: MakeAppointment,
                },
                {
                    path: 'receiveappointment',
                    name: 'ReceiveAppointment',
                    component: ReceiveAppointment,
                },
                {
                    path: 'promotionhouse',
                    name: 'PromotionHouse',
                    component: PromotionHouse,
                },
                {
                    path: 'mypromotion',
                    name: 'MyPromotion',
                    component: MyPromotion,
                },
                {
                    path: 'viewhouse/:houseid',
                    name: 'ViewHouse',
                    component: ViewHouse,
                },
                {
                    path: 'edithouse/:houseid',
                    name: 'EditHouse',
                    component: EditHouse,
                },

            ]
        },
        {
            path: '/:city/detail/:houseid',
            name: 'Detail',
            component: Detail
        },
        {
            path: '/:city/publish',
            name: 'Publish',
            component: Publish,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/:city/map',
            name: 'Map',
            component: Map,
        },
        {
            path: '/:city/agreement',
            name: 'Agreement',
            component: Agreement
        },
        {
            path: '/:city/policy',
            name: 'Policy',
            component: Policy
        },
        {
            path: '/:city/list/:style/:aindex/:bindex/:cindex/:dindex/:eindex/:findex/:gindex/:hindex/:iindex',
            name: 'List',
            component: List,
        },



    ]
});

//注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
    //获取store里面的token
    let token = store.state.token;
    //判断要去的路由有没有requiresAuth
    if (to.meta.requiresAuth) {
        if (token) {
            next();
        } else {
            Message({
                type: "warning",
                message: "请先登录"
            });
        }
    } else {
        next();
    }
});


export default router;