import request from "../utils/request";

// 微信小程序支付
export function orderPayWeChatMiniApp(data) {
    return request({
        url: "/api/order/pay/weChatMiniApp",
        method: "post",
        data: data
    });
}
