// 定义 Promise 异步请求
export const request=(params)=>{
  return new Promise((reslove,reject)=>{
  wx.request({
    ...params,
    success:(result)=>{
      reslove(result);
    },
    fail:(error)=>{
      reject(error);
    }
  });
  })
}
