import { getStorageSync, setStorageSync, removeStorageSync } from "./storage";

const tokenKey = "user_token";
const initKey = "user_init";

// 获取用户的本地token
export function getToken() {
  return getStorageSync(tokenKey);
}

// 设置用户的本地token
export function setToken(toekn) {
  return setStorageSync(tokenKey, toekn);
}

// 删除登录信息
export function delToken() {
  return removeStorageSync(tokenKey);
}


// 获取用户初始化信息(例如:头像和昵称)
export function getUserInit() {
  return getStorageSync(initKey);
}

// 设置用户初始化信息(例如:头像和昵称)
export function setUserInit(obj) {
  return setStorageSync(initKey, obj);
}

// 删除用户初始化信息(例如:头像和昵称)
export function delUserInit() {
  return removeStorageSync(initKey);
}
