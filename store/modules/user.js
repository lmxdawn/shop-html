import * as types from "../mutation-types";
import { memberInfo } from "../../api/member";
import { getToken, delToken, getMemberInit, delMemberInit } from "../../utils/userAuth";

const member = getMemberInit();

const state = {
    memberInfo: {
        member_id: parseInt(member.member_id) || 0,
        name: member.name || "",
        avatar: member.avatar || "",
    },
    cartCount: 0, // 购物车数量
};

// getters
const getters = {
    memberInfo: state => state.memberInfo,
    cartCount: state => state.cartCount,
};

// actions
const actions = {
    logout({ commit }) {
        let info = {
            member_id: 0,
            name: "",
            avatar: "",
        };
        commit(types.MEMBER_INFO, info);
        commit(types.MEMBER_CLEAR_LOGIN);
    },
    getUserInfo({ commit }) {
        return new Promise((resolve, reject) => {
            if (!getToken()) {
                reject(new Error("沒有用户登录信息"));
                return;
            }
            // 获取用户信息
            memberInfo()
                .then(res => {
                    if (res.code > 0) {
                        reject(res.message);
                        return;
                    }
                    let data = res.data;

                    let info = {
                        member_id: data.member_id || 0,
                        name: data.name || "",
                        avatar: data.avatar || "",
                    };
                    let cartCount = data.cart_count || 0;
                    commit(types.MEMBER_INFO, info);
                    commit(types.CART_COUNT, cartCount);
                    resolve(info);
                })
                .catch(err => {
                    reject(err)
                });

        });
    },
    setCartCount({ commit }, type) {
        commit(types.CART_COUNT, type);
    },
    initCartCount({ commit }, count) {
        commit(types.CART_COUNT_INIT, count);
    }
};

// mutations
const mutations = {
    //清空信息
    [types.MEMBER_CLEAR_LOGIN](state) {
        delToken();
        delMemberInit();
    },
    //设置用户信息
    [types.MEMBER_INFO](state, memberInfo) {
        state.memberInfo = memberInfo;
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
    },
    // 购物车
    [types.CART_COUNT_INIT](state, count) {
        state.cartCount = count;
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
