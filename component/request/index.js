// 定义 Promise 异步请求
export const request=()=>{
  return new Promise((reslove,reject)=>{
  wx.request({
    ...param,
    success:(result)=>{
      reslove(reslove);
    },
    fail:(error)=>{
      reject(error);
    }
  });
  })
}
