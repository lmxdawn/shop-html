import * as types from "../mutation-types";
import { getStorageSync, setStorageSync } from "../../utils/storage"

const guideKey = "guideKey";

const state = {
    PhoneFirstLoadUrl: "", //用户第一次加载的url， vue框架在微信浏览器路由时url不会变
    currentDate: Math.floor(new Date().getTime() / 1000), //当前日期 会用服务器返回的数据
    guide: getStorageSync(guideKey) || false, // 引导页面
    adParams: {}, // 广告点击的参数
    submitOrderAddress: {}, // 下单时的地址
    cartCount: 0, // 购物车数量
};

// getters
const getters = {
    PhoneFirstLoadUrl: state => state.PhoneFirstLoadUrl,
    currentDate: state => state.currentDate,
    guide: state => state.guide,
    adParams: state => state.adParams,
    submitOrderAddress: state => state.submitOrderAddress,
    cartCount: state => state.cartCount,
};

// actions
const actions = {
    setPhoneFirstLoadUrl({ commit }, url) {
        commit(types.PHONE_FIRST_LOAD_URL, url);
    },
    setCurrentDate({ commit }, currentDate) {
        commit(types.CURRENT_DATE, currentDate);
    },
    setGuide({ commit }, guide) {
        commit(types.GUIDE, guide);
    },
    setAdParams({ commit }, item) {
        commit(types.AD_PARAMS, item);
    },
    setSubmitOrderAddress({ commit }, list) {
        commit(types.SUBMIT_ORDER_ADDRESS, list);
    },
    setCartCount({ commit }, type) {
        commit(types.CART_COUNT, type);
    }
};

// mutations
const mutations = {
    //设置用户第一次加载的url，微信js-sdk分享的问题 https://www.zhihu.com/question/59388458/answer/340351305
    [types.PHONE_FIRST_LOAD_URL](state, url) {
        state.PhoneFirstLoadUrl = url;
    },
    // 服务器当前时间
    [types.CURRENT_DATE](state, currentDate) {
        state.currentDate = currentDate;
    },
    // 引导
    [types.GUIDE](state, guide) {
        state.guide = guide;
        setStorageSync(guideKey, guide);
    },
    // 广告跳转到 tabBar 的参数
    [types.AD_PARAMS](state, item) {
        state.adParams[item.key] = item.value;
    },
    // 下单时的商品
    [types.SUBMIT_ORDER_ADDRESS](state, item) {
        state.submitOrderAddress = item;
    },
    // 购物车
    [types.CART_COUNT](state, type) {
        if (type === 1) {
            state.cartCount++;
        } else if (type > 1){
            state.cartCount = type;
        } else {
            if (state.cartCount > 0) {
                state.cartCount--;
            }
        }
        if (state.cartCount > 0) {
            uni.setTabBarBadge({
                index: 2,
                text: state.cartCount + ""
            })
        }
    }
};
export default {
    state,
    getters,
    actions,
    mutations
};
