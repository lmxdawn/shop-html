import request from "../utils/request";

// 下单时获取商品列表
export function orderList(params) {
    return request({
        url: "/api/order/order/index",
        method: "get",
        params: params
    });
}

// 下单
export function orderSubmit(data) {
    return request({
        url: "/api/order/order/create",
        method: "post",
        data: data
    });
}

// 订单详情
export function orderRead(params) {
    return request({
        url: "/api/order/order/read",
        method: "get",
        params: params
    });
}

// 订单取消
export function orderCancel(data) {
    return request({
        url: "/api/order/order/cancel",
        method: "post",
        data: data
    });
}

// 订单确认收货
export function orderOk(data) {
    return request({
        url: "/api/order/order/ok",
        method: "post",
        data: data
    });
}

// 下单时获取商品列表
export function orderSubmitGoodList(data) {
    return request({
        url: "/api/order/order/submitGoodList",
        method: "post",
        data: data
    });
}

// 评价
export function orderComment(data) {
    return request({
        url: "/api/order/order/comment",
        method: "post",
        data: data
    });
}

