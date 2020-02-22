import Vue from 'vue'
import App from './App'
import store from './store'

import { toast } from "./utils/common";
import { STATIC_URL } from "./config/app";
import * as filters from "./filters/index"; // 全局过滤器

// 注册全局实用程序过滤器（register global utility filters）.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

const tui = {
    toast(text, duration, success) {
        toast(text, duration, success)
    },
    px(num) {
        return uni.upx2px(num) + 'px';
    },
    staticUrl() {
        return STATIC_URL;
    }
};

Vue.prototype.$tui = tui;
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue();
Vue.prototype.$store = store;

App.mpType = 'app';

const app = new Vue({
    store,
    ...App
});
app.$mount();
