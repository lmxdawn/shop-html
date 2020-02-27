import request from "../utils/request";

// 获取用户信息
export function memberInfo() {
    return request({
        url: "/api/member/member/info",
        method: "get"
    });
}
