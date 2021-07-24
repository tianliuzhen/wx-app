// app.js
App({
  // 1、生命周期回调——监听小程序初始化
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  // 2、生命周期回调——监听小程序启动或切前台
  onShow() {
    // 对应用的数据或页面效果 重置
    console.log("onShow")
  },
  // 3、生命周期回调——监听小程序切后台
  onHide() {
    // 暂停或者清除定时器
    console.log("onHide")
  },
  // 4、错误监听函数
  onError(msg) {
    // 当应用代码发生代码报错的时候把请求发到后台去
    console.log("onError")
    console.log(msg)
  },
  // 5、页面不存在监听函数
  onPageNotFound() {
    // 页面不存在通过js的方式重新跳转页面，重新跳转到第二个首页
    // 不能跳到tabbar页面、导航组件类似
    wx.navigateTo({
      url: 'pages/biz/img-404/img-404',
    })
  },
  globalData: {
    userInfo: null
  }
})