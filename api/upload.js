import request from "../utils/request";
import { UPLOAD_URL } from "../config/app";

// 云存储token查询接口
export function getKodoToken(query) {
    return request({
        url: "/kodo/getKodoToken",
        method: "get",
        params: query
    });
}

// 上传
export function uploadCreate(url, name, filePath, data) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: url,
            filePath: filePath,
            name: name,
            formData: data,
            success: (uploadFileRes) => {
                resolve(JSON.parse(uploadFileRes.data));
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

// 七牛上传
export function qiniuUpload(filePath) {
    return new Promise((resolve, reject) => {
        getKodoToken()
            .then(response => {
                let data = {
                    token: response.data
                };
                uploadCreate(UPLOAD_URL, "file", filePath, data)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .catch(err => {
                reject(err);
            });
    });
}
