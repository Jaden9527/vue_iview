// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill';
import ViewUI from 'view-design';
import store from './store';
import axios from 'axios';
import 'view-design/dist/styles/iview.css';
import api from './common/api';
import VueAMap from 'vue-amap';
import './common/utils/rem'; //自适应rem函数
// import rem from './common/utils/rem';

Vue.prototype.$api = api;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false
Vue.use(ViewUI);
Vue.use(VueAMap);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

