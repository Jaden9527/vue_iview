import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist'
import getters from './getters'
import permission from './modules/permission'
import app from './modules/app'

// https://github.com/championswimmer/vuex-persist
const vuexLocal = new VuexPersistence({
    storage: window.sessionStorage
})

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        count: 2
    },
    getters,
    mutations: {
        add (state, text = 1) { // 上面定义的state
            state.count = state.count + text;
        },
        reduct (state, text = 1) {
            state.count = state.count - text;
        }
    },
    actions: { //注册actions， 类似vue 的 methods
        add: function (context, text = 1) { // 接收一个与store 实例具有相同方法的属性的 context 的对象
            context.commit('add', text);
        },
        reduct: function (context, text = 1) {
            context.commit('reduct', text);
        }
    },
    modules: { //可以将store分割成多个模块
        permission,
        app
    },
    plugins: [vuexLocal.plugin]
});

export default store;
