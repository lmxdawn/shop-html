import Vue from 'vue'
import App from './App'

import store from './store'
import * as filters from "./filters/index"; // 全局过滤器

// 注册全局实用程序过滤器（register global utility filters）.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

Vue.prototype.$store = store;

App.mpType = 'app';

const app = new Vue({
    store,
    ...App
});
app.$mount();
