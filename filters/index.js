import {UPLOAD_DOMAIN} from "../config/app";
import {getUploadImagePathToUrl, getDiffYmdBetweenDate} from "../utils/common";

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
export function _formatDate(inputTime) {
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
export function FormatDate(date_str, fmt) {
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
 * 计算年龄
 * 计算年份->计算月份->计算天数
 * @param date
 * @returns {string}
 */
export function filterDateToAge(date) {
    if (!date || date.length === 0) {
        return "";
    }
    let date2 = FormatDate(new Date(), "yyyy-MM-dd");
    let res = getDiffYmdBetweenDate(date, date2);
    let str = (res.y > 0 ? res.y + "岁" : "" ) + (res.m > 0 ? (res.m < 10 && res.y > 0 ? "零" + res.m : res.m) + "个月" : "") + (res.d > 0 ? (res.d < 10 && res.m > 0 ? "零" + res.d : res.d) + "天" : "");
    return str ? str : "0岁";
}

/**
 * 计算年龄
 * 计算年份
 * @param date
 * @returns {string}
 */
export function filterDateToAgeYear(date) {
    if (!date || date.length === 0) {
        return "";
    }
    let date2 = FormatDate(new Date(), "yyyy-MM-dd");
    let res = getDiffYmdBetweenDate(date, date2);
    return res.y;
}
