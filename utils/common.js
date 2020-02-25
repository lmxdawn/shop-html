import {UPLOAD_DOMAIN} from "../config/app";
// 跳转
export function navigateTo(path) {
    uni.navigateTo({
        url:"/pages/"+path
    });
}
// 跳转
export function redirectTo(path) {
    uni.redirectTo({
        url:"/pages/"+path
    });
}

// 跳转
export function switchTab(path){
    uni.switchTab({
        url:"/pages/"+path
    });
}

// 跳转
export function reLaunch(path){
    uni.reLaunch({
        url:"/pages/"+path
    });
}

// 返回上级页面
export function navigateBack(delta, type, duration){
    uni.navigateBack({
        delta: delta,
        animationType: type,
        animationDuration: duration
    });
}

// 设置标题栏
export function setNavigationBarTitle(title){
    uni.setNavigationBarTitle({
        title: title
    });
}

// 跳转webView
export function jumpWebView(url){
    url = encodeURIComponent(url);
    navigateTo("utils/webView?url=" + url)
}

/**
 * 自动消失的提示窗
 */
export function toast(msg, duration, success){
    uni.showToast({
        title: msg,
        icon: success ? 'success' : 'none',
        duration: duration || 2000
    })
}

/**
 * 显示加载
 */
export function showLoading(title){
    uni.showLoading({
        title: title || '加载中'
    });
}

/**
 * 隐藏加载
 */
export function hideLoading(){
    uni.hideLoading();
}

/**
 * 将对象转为url参数
 * @param data
 * @param isPrefix
 */
export function queryParams(data, isPrefix = false) {
    let prefix = isPrefix ? '?' : '';
    let _result = [];
    for (let key in data) {
        let value = data[key];
        // 去掉为空的参数
        if (['', undefined, null].includes(value)) {
            continue
        }
        if (value.constructor === Array) {
            value.forEach(_value => {
                _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
            })
        } else {
            _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
        }
    }

    return _result.length ? prefix + _result.join('&') : ''
}

/**
 * 把上传资源的 path 路径转为 url 地址
 * @param path
 * @returns {string|*}
 */
export function getUploadImagePathToUrl(path) {
    if (["", undefined, null].includes(path)) {
        return path;
    }

    if (path.indexOf("http") === 0) {
        return path;
    } else if (path.indexOf("/") === 0) {
        return path;
    }

    return UPLOAD_DOMAIN + "/" + path;
}

export function isNullOrEmpty (value) {
    //是否为空
    return (value === null || value === '' || value === undefined) ? true : false;
}
export function trim (value) {
    //去空格
    return value.replace(/(^\s*)|(\s*$)/g, "");
}
export function isMobile (value) {
    //是否为手机号
    return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(value);
}
export function isFloat (value) {
    //金额，只允许保留两位小数
    return /^([0-9]*[.]?[0-9])[0-9]{0,1}$/.test(value);
}
export function isNum (value) {
    //是否全为数字
    return /^[0-9]+$/.test(value);
}
export function checkPwd (value) {
    //密码为8~20位数字和字母组合
    return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(value);
}
export function formatNum (num) {
    //格式化手机号码
    if (utils.isMobile(num)) {
        num = num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    }
    return num;
}
export function rmoney (money) {
    //金额格式化
    return parseFloat(money).toFixed(2).toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(
        /\,$/, '').split('').reverse().join('');
}
