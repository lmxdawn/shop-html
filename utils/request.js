import { API_URL } from '../config/app.js'
import { getToken , delToken, getMemberId } from './userAuth.js'
import { reLaunch, queryParams, toast, navigateTo } from './common.js'
import store from '../store'

const request = (obj) => {

	obj.url = API_URL + obj.url;

	// 获取用户本地保存的token
	let member_id = getMemberId() || 4;
	let token = getToken() || "zm0SVr-J1wtBjLsDq8dbu5PSXsM";
	if (token) {
		obj.header = {};
	}
	obj.params = obj.params || {};
	if (obj.params) {
		obj.params.MEMBER_ID = member_id;
		obj.params.TOKEN = token;
		obj.params.app_name = process.env.VUE_APP_PLATFORM;
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
