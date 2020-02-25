import {getUploadImagePathToUrl} from "../utils/common";

/**
 * 把上传的图片的 path 路径转为 url 地址
 * @param path
 * @returns {string}
 */
export function uploadImagePathToUrl(path) {
    return getUploadImagePathToUrl(path);
}

/**
 * 时间戳格式化
 * @param inputTime
 */
export function formatTime(inputTime) {
    let date = new Date(parseInt(inputTime * 1000));
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

/**
 * @return {string}
 */
export function formatDate(date_str, fmt) {
    date_str =
        typeof date_str === "string" ? date_str.replace(/-/g, "/").replace(".000", "") : date_str;
    let date = new Date(date_str);
    if (isNaN(date.getDate())) {
        return "";
    }
    if (!fmt) {
        fmt = "yyyy-MM-dd";
    }
    const o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return fmt;
}

/**
 * 格式化昵称
 * @returns {void | string | *}
 * @param name
 */
export function formatName(name) {
    return name.substr(1, 1) + "***" + name.substr(name.length - 1, 1);
}
