let API_URL = "";
let SOCKET_URL = "";
const UPLOAD_URL = "http://up-z2.qiniu.com";
const UPLOAD_DOMAIN = "http://youmeng.await.fun";
// 环境判断
if (process.env.NODE_ENV === 'development') {
    // 测试
    API_URL = "http://47.107.230.123:8080";
    SOCKET_URL = "ws://47.107.230.123:8080/websocket";
} else {
    // 正式
    API_URL = "http://47.107.230.123:8080";
    SOCKET_URL = "ws://47.107.230.123:8080/websocket";
}
const AM_AP_KEY = "9cb6501819ae8b7c26e671dd7de3eaf9";
export {
    API_URL,
    SOCKET_URL,
    UPLOAD_URL,
    UPLOAD_DOMAIN,
    AM_AP_KEY
}
