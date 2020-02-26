import request from "../utils/request";

// 购物车列表
export function orderCartList(params) {
    return request({
        url: "/api/order/cart/index",
        method: "get",
        params: params
    });
}

// 加入购物车
export function orderCartSave(data) {
    return request({
        url: "/api/order/cart/save",
        method: "post",
        data: data
    });
}

// 选中购物车
export function orderCartCheck(data) {
    return request({
        url: "/api/order/cart/check",
        method: "post",
        data: data
    });
}

// 删除购物车
export function orderCartDelete(data) {
    return request({
        url: "/api/order/cart/delete",
        method: "post",
        data: data
    });
}

