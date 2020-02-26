import * as types from "../mutation-types";
import { memberInfo } from "../../api/member";
import { getToken, delToken, getMemberInit, delMemberInit } from "../../utils/userAuth";

const member = getMemberInit();

const state = {
    memberInfo: {
        member_id: parseInt(member.member_id) || 0,
        name: member.name || "",
        avatar: member.avatar || "",
    }
};

// getters
const getters = {
    memberInfo: state => state.memberInfo,
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
                    if (res.code !== 200) {
                        reject(res.message);
                        return;
                    }
                    // console.log(res);
                    let data = res.data;

                    let info = {
                        member_id: data.member_id || 0,
                        name: data.name || "",
                        avatar: data.avatar || "",
                    };
                    commit(types.MEMBER_INFO, info);
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
    [types.MEMBER_CLEAR_LOGIN](state) {
        delToken();
        delMemberInit();
    },
    //设置用户信息
    [types.MEMBER_INFO](state, memberInfo) {
        state.memberInfo = memberInfo;
    }
};
export default {
    state,
    getters,
    actions,
    mutations
};
