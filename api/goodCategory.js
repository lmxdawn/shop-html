import request from "../utils/request";

// 分类列表
export function goodCategoryList(params) {
    return request({
        url: "/api/good/category/index",
        method: "get",
        params: params
    });
}
