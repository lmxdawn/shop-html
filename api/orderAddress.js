import request from "../utils/request";

// 地址列表
export function orderAddressList(params) {
    return request({
        url: "/api/order/address/index",
        method: "get",
        params: params
    });
}
// 地址添加
export function orderAddressSave(data) {
    return request({
        url: "/api/order/address/save",
        method: "post",
        data: data
    });
}
// 地址详情
export function orderAddressRead(params) {
    return request({
        url: "/api/order/address/read",
        method: "get",
        params: params
    });
}
// 地址删除
export function orderAddressDel(data) {
    return request({
        url: "/api/order/address/delete",
        method: "post",
        data: data
    });
}
