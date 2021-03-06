import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

//初始化时用sessionStore.getItem('token'),这样子刷新页面就无需重新登录
const state = {
    token: window.sessionStorage.getItem('token'),
    username: window.sessionStorage.getItem('username'),
    city: window.sessionStorage.getItem('city'),
};

const mutations = {
    LOGIN: (state, data) => {
        //更改token的值
        state.token = data;
        window.sessionStorage.setItem('token', data);
    },
    LOGOUT: (state) => {
        //登出的时候要清除token
        state.token = null;
        state.username = null;
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('username');
    },
    USERNAME: (state, data) => {
        //把用户名存起来
        state.username = data;
        window.sessionStorage.setItem('username', data);
    },
    CITY: (state, data) => {
        state.city = data;
    },
};

const actions = {
    UserLogin({ commit }, data) {
        commit('LOGIN', data);
    },
    UserLogout({ commit }) {
        commit('LOGOUT');
    },
    UserName({ commit }, data) {
        commit('USERNAME', data);
    },
    CITY({ commit }, data) {
        commit('CITY', data);
    },
};

export default new Vuex.Store({
    state,
    mutations,
    actions
});