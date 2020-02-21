import request from "../utils/request";

// 获取用户信息
export function memberInfo(data) {
    return request({
        url: "/api/user/index/info",
        method: "post",
        data: data
    });
}
