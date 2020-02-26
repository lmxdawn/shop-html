import request from "../utils/request";

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

// 订单删除
export function orderCancel(data) {
    return request({
        url: "/api/order/order/cancel",
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
