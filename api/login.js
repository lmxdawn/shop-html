import request from "../utils/request";

//用户授权 公众号
export function wapLogin(data) {
    return request({
        url: "/api/user/login/weChatWap",
        method: "post",
        data: data
    });
}

// 手机号登录
export function telLogin(data) {
    return request({
        url: "/login/commit",
        method: "post",
        data: data
    });
}

// 获取手机验证码
export function sendVerificationCode(data) {
    return request({
        url: "/login/sendVerificationCode",
        method: "post",
        data: data
    });
}
