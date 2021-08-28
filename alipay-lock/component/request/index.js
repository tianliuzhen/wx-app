const _my = require("../../__antmove/api/index.js")(my);
const wx = _my;
// 定义 Promise 异步请求
export const request = params => {
    return new Promise((reslove, reject) => {
        wx.request({
            ...params,
            success: result => {
                reslove(result);
            },
            fail: error => {
                reject(error);
            }
        });
    });
};
