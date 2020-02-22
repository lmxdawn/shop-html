import * as types from "../mutation-types";
import { memberInfo } from "../../api/member";
import { getToken, delToken, delUserInit } from "../../utils/userAuth";

const state = {
    userInfo: {
        id: 0,
        name: "",
    }
};

// getters
const getters = {
    userInfo: state => state.userInfo,
};

// actions
const actions = {
    logout({ commit }) {
        let info = {
            id: 0,
            name: "",
        };
        commit(types.USER_INFO, info);
        commit(types.USER_CLEAR_LOGIN);
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
                    if (res.code !== 200) {
                        reject(res.message);
                        return;
                    }
                    // console.log(res);
                    let data = res.data;

                    let info = {
                        id: data.id || 0,
                        name: data.name || "",
                    };
                    commit(types.USER_INFO, info);
                    resolve(info);
                })
                .catch(err => {
                    reject(err)
                });

        });
    },
};

// mutations
const mutations = {
    //清空信息
    [types.USER_CLEAR_LOGIN](state) {
        delToken();
        delUserInit();
        // 如果在登录页面, 则不要重复跳转
        if (state.loginStatus) {
            return false;
        }
    },
    //设置用户信息
    [types.USER_INFO](state, userInfo) {
        state.userInfo = userInfo;
        state.saveUserInfo = userInfo;
    }
};
export default {
    state,
    getters,
    actions,
    mutations
};
