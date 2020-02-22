import amap from "../libs/amap-wx";
import { AM_AP_KEY } from "../config/app";

// 高德
export function amGetLocation() {
    return new Promise((resolve, reject) => {
        if (process.env.VUE_APP_PLATFORM === 'h5') {
            let data = {
                country: "中国",
                province: "重庆市",
                city: "重庆市",
                area: "渝中区",
                locationDetail: "重庆市渝中区石油路街道经纬大道重庆总部城D区",
                longitude: 106.503671,
                latitude: 29.545337,
            };
            resolve(data);
        }
        let amapPlugin = new amap.AMapWX({
            key: AM_AP_KEY
        });
        amapPlugin.getRegeo({
            success: res => {
                if (!res || !res[0]) {
                    reject("获取地址失败");
                }
                let addressData = res[0];
                if (!addressData.regeocodeData.addressComponent.province) {
                    reject("获取地址失败");
                }
                let formattedAddress = addressData.regeocodeData.formatted_address;
                let country = addressData.regeocodeData.addressComponent.country;
                let province = addressData.regeocodeData.addressComponent.province;
                let city = addressData.regeocodeData.addressComponent.city;
                if (typeof(city) !== 'string') {
                    city = province;
                }
                let district = addressData.regeocodeData.addressComponent.district;
                let longitude = addressData.longitude;
                let latitude = addressData.latitude;
                let data = {
                    country: country,
                    province: province,
                    city: city,
                    area: district,
                    locationDetail: formattedAddress,
                    longitude: longitude,
                    latitude: latitude,
                };
                resolve(data);
            },
            fail: err => {
                reject(err);
            }
        });
    });
}
