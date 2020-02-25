import request from "../utils/request";

// 推荐商品
export function goodRecommend(params) {
    return request({
        url: "/api/good/good/recommend",
        method: "get",
        params: params
    });
}

// 商品列表
export function goodList(params) {
    return request({
        url: "/api/good/good/index",
        method: "get",
        params: params
    });
}

// 商品详情
export function goodDetail(params) {
    return request({
        url: "/api/good/good/detail",
        method: "get",
        params: params
    });
}
