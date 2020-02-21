import store from "../store";
import { SOCKET_URL } from "../config/app";
import { getToken } from "../utils/userAuth";

const connectSocket = () => {
    if (store.webSocketOpen || !getToken()) {
        return false;
    }
    uni.connectSocket({
        url: SOCKET_URL + "/" + getToken()
    });
};
const onSocketOpen = () => {
    uni.onSocketOpen(() => {
        console.log("WebSocket 连接成功");
        store.dispatch("setWebSocketOpenStatus", true);
    });
};
const onSocketMessage = () => {
    uni.onSocketMessage(res => {
        let jsonData = res.data;
        if (typeof jsonData !== "string") {
            return false;
        }
        try {
            let res = JSON.parse(jsonData);
            let data = res.data;
            console.log('收到服务器内容：', data);
            if (data.send === true) {
                return false;
            }
            let msgData = {
                friendUserId: data.friendUserId,
                send: data.send,
                messageDetail: data.messageDetail,
                sendUserName: data.friendtName,
                sendUserFacialPhoto: data.friendFacialPhoto,
                createTime: data.createTime,
            };
            store.dispatch("chatListAdd", msgData);
            // 修改最后一次对话信息
            store.dispatch("friendListSaveLastConversation", {
                friendUserId: data.receiveUserId,
                content: chatText,
                createTime: data.createTime,
            });
        }catch (e) {
            return false;
        }
    });
};
const onSocketClose = () => {
    uni.onSocketClose(res => {
        console.log('WebSocket 已关闭！');
        store.dispatch("setWebSocketOpenStatus", false);
    });
};
const onSocketError = () => {
    uni.onSocketError(res => {
        console.log('WebSocket连接打开失败，请检查！');
    });
};

export function socketInit() {
    connectSocket();
    onSocketOpen();
    onSocketMessage();
    onSocketClose();
    onSocketError();
}

export function closeSocket() {
    if (store.webSocketOpen) {
        uni.closeSocket();
    }
}
