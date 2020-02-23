import request from "../utils/request";

// 首页信息
export function otherIndex() {
    return request({
        url: "/api/other/index/index",
        method: "get"
    });
}
