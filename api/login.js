import request from "../utils/request";

// 小程序登录
export function byWeChatApplet(data) {
    return request({
        url: "/api/member/login/byWeChatApplet",
        method: "post",
        data: data
    });
}
