import { API_URL } from '../config/app.js'
import { getToken , delToken } from './userAuth.js'
import { reLaunch, queryParams, toast, navigateTo } from './common.js'
import store from '../store'

const request = (obj) => {

	obj.url = API_URL + obj.url;

	// 获取用户本地保存的token
	let token = getToken();
	if (token) {
		obj.header = {};
		obj.header.token = token;
	}

	if (obj.method === "get" && obj.params) {
		obj.url = obj.url + queryParams(obj.params, true);
	}
	return new Promise((resolve, reject) => {
		uni.request({
		        url: obj.url,
		        method: obj.method || "get",
		        data: obj.data,
		        dataType: 'json',
		        header: obj.header
		    }).then(data => {
		        let [err, res] = data;
				let resData = res.data || {};
				if (res.statusCode !== 200) {
					reject(err);
				} else {
					// 如果是登录失效
					if (resData.code === 20001 || resData.code === 99999) {
						toast(resData.message);
						store.dispatch("logout");
						return false;
					}
					resolve(resData);
				}
		    }).catch(err => {
				return reject(err);
		　　});
	});
};

export default request
