import request from "../utils/request";

// 下单时获取商品列表
export function orderSubmitGoodList(data) {
    return request({
        url: "/api/order/order/submitGoodList",
        method: "post",
        data: data
    });
}
