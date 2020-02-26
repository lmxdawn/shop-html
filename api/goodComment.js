import request from "../utils/request";

// 列表
export function goodCommentList(params) {
    return request({
        url: "/api/good/comment/index",
        method: "get",
        params: params
    });
}
