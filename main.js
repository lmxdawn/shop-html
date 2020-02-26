import Vue from 'vue'
import App from './App'
import store from './store'

import { toast, navigateTo, navigateBack, switchTab, jumpWebView, showLoading, hideLoading, navigateToLogin } from "./utils/common";
import { getToken } from "./utils/userAuth";
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
    },
    navigateTo(path) {
        navigateTo(path)
    },
    navigateToLogin() {
        if (!getToken()) {
            navigateToLogin();
            return false;
        }
        return true;
    },
    loginNavigateTo(path) {
        if (!getToken()) {
            navigateToLogin();
            return false;
        }
        navigateTo(path)
    },
    navigateBack(delta, type, duration) {
        navigateBack(delta, type, duration)
    },
    switchTab(path) {
        switchTab(path)
    },
    jumpWebView(url) {
        jumpWebView(url)
    },
    showLoading(title, mask) {
        showLoading(title, mask)
    },
    hideLoading() {
        hideLoading()
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
