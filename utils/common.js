import { getToken } from "./userAuth";
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

// 需要判断登录的跳转
export function loginNavigateTo(path){
    if (!getToken()) {
        navigateTo("login/index");
        return false;
    }
    navigateTo(path);
}

// 跳转webView
export function jumpWebView(url){
    url = encodeURIComponent(url);
    navigateTo("utils/webView?url=" + url)
}

/**
 * 自动消失的提示窗
 */
export function toast(msg){
    uni.showToast({
        icon: 'none',
        title: msg,
        duration: 2000
    });
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
 * 事件防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp;

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null
            }
        }
    };

    return function(...args) {
        context = this;
        timestamp = +new Date();
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null
        }

        return result
    }
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

/**
 * 计算相差年数月数天数
 * @param sDate1
 * @param sDate2
 * @returns {{d: *, y: *, m: *}}
 */
export function getDiffYmdBetweenDate(sDate1, sDate2) {
    let fixDate = function (sDate) {
        let aD = sDate.split('-');
        for (let i = 0; i < aD.length; i++) {
            aD[i] = fixZero(parseInt(aD[i]));
        }
        return aD.join('-');
    };
    let fixZero = function (n) {
        return n < 10 ? '0' + n : n;
    };
    let fixInt = function (a) {
        for (let i = 0; i < a.length; i++) {
            a[i] = parseInt(a[i]);
        }
        return a;
    };
    let getMonthDays = function (y, m) {
        let aMonthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((y % 400 === 0) || (y % 4 === 0 && y % 100 !== 0)) {
            aMonthDays[2] = 29;
        }
        return aMonthDays[m];
    };
    let checkDate = function (sDate) {
    };
    let y = 0;
    let m = 0;
    let d = 0;
    let sTmp;
    let aTmp;
    sDate1 = fixDate(sDate1);
    sDate2 = fixDate(sDate2);
    if (sDate1 > sDate2) {
        sTmp = sDate2;
        sDate2 = sDate1;
        sDate1 = sTmp;
    }
    let aDate1 = sDate1.split('-');
    aDate1 = fixInt(aDate1);
    let aDate2 = sDate2.split('-');
    aDate2 = fixInt(aDate2);
    y = aDate2[0] - aDate1[0];
    if (sDate2.replace(aDate2[0], '') < sDate1.replace(aDate1[0], '')) {
        y = y - 1;
    }
    //计算月份
    aTmp = [aDate1[0] + y, aDate1[1], fixZero(aDate1[2])];
    while (true) {
        if (aTmp[1] === 12) {
            aTmp[0]++;
            aTmp[1] = 1;
        } else {
            aTmp[1]++;
        }
        if (([aTmp[0], fixZero(aTmp[1]), aTmp[2]]).join('-') <= sDate2) {
            m++;
        } else {
            break;
        }
    }
    //计算天数
    aTmp = [aDate1[0] + y, aDate1[1] + m, aDate1[2]];
    if (aTmp[1] > 12) {
        aTmp[0]++;
        aTmp[1] -= 12;
    }
    while (true) {
        if (aTmp[2] === getMonthDays(aTmp[0], aTmp[1])) {
            aTmp[1]++;
            aTmp[2] = 1;
        } else {
            aTmp[2]++;
        }
        sTmp = ([aTmp[0], fixZero(aTmp[1]), fixZero(aTmp[2])]).join('-');
        if (sTmp <= sDate2) {
            d++;
        } else {
            break;
        }
    }
    return {y: y, m: m, d: d};
}

/**
 * 计算两个日期相差的天数
 * @param start
 * @param end
 * @returns {number}
 */
export function dateDiff(start,  end){
    // start和end是2006-12-18格式  
    let aDate,  oDate1,  oDate2,  iDays;
    aDate  =  start.split("-");
    // 调用Date的构造函数，转换为12-18-2006格式
    oDate1 = new Date(aDate[0] , aDate[1] - 1 ,aDate[2]) ;
    aDate = end.split("-") ;
    oDate2  =  oDate2 = new Date(aDate[0] , aDate[1] - 1, aDate[2]) ;
    //把相差的毫秒数转换为天数
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);
    return  iDays
}
