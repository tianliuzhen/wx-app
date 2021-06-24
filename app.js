// app.js

import {
  request
} from "/component/request/index.js";
App({
  // 1、生命周期回调——监听小程序初始化
  onLaunch() {
    console.log("onLaunch")
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     request({
    //       url:this.globalData.api_getUserInfo,
    //       method: 'get',
    //       data:{jsCode:res.code}
    //     }).then(res=>{
    //       // 存入缓存
    //       wx.setStorageSync("userInfo", res.data.data)
    //       this.globalData.userInfo=res.data.data
    //     })
    //   }
    // })
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
  globalData2: {
    userInfo: null,
    domain: 'http://localhost:9999',
    api_addUser: 'http://localhost:9999/wx-lock-api/addUser',
    api_getUserInfo: 'http://localhost:9999/wx-lock-api/getUserInfo',
    api_getUsersPage: 'http://localhost:9999/wx-lock-api/getUsersPage',
    api_auditPass: 'http://localhost:9999/wx-lock-api/auditPass',
    api_editUser: 'http://localhost:9999/wx-lock-api/editUser',
    api_getQrCode: 'http://localhost:9999/wx-lock-api/getQrCode',
    api_getRoleChildData: 'http://localhost:9999/wx-lock-api/getOrgChildData',
    api_getUserInfoByOpenId: 'http://localhost:9999/wx-lock-api/getUserInfoByOpenId',
    api_getOpenDoorRecord: 'http://localhost:9999/openDoorRecord/page',
    api_getDevices: 'http://localhost:9999/device/page',
    api_remoteOpen: 'http://localhost:9999/wx-lock-api/remoteOpen',
    api_updatePassword: 'http://localhost:9999/wx-lock-api/updatePassword',
    api_getQrCodeDataByBluetooth: 'http://localhost:9999/wx-lock-api/getQrCodeDataByBluetooth',
  },
  globalData: {
    userInfo: null,
    domain: 'https://codeok.cn/',
    api_addUser: 'https://codeok.cn/wx-lock-api/addUser',
    api_getUserInfo: 'https://codeok.cn/wx-lock-api/getUserInfo',
    api_getUsersPage: 'https://codeok.cn/wx-lock-api/getUsersPage',
    api_auditPass: 'https://codeok.cn/wx-lock-api/auditPass',
    api_editUser: 'https://codeok.cn/wx-lock-api/editUser',
    api_getQrCode: 'https://codeok.cn/wx-lock-api/getQrCode',
    api_getRoleChildData: 'https://codeok.cn/wx-lock-api/getOrgChildData',
    api_getUserInfoByOpenId: 'https://codeok.cn/wx-lock-api/getUserInfoByOpenId',
    api_getOpenDoorRecord: 'https://codeok.cn/openDoorRecord/page',
    api_getDevices: 'https://codeok.cn/device/page',
    api_remoteOpen: 'https://codeok.cn/wx-lock-api/remoteOpen',
    api_updatePassword: 'https://codeok.cn/wx-lock-api/updatePassword',
    api_getQrCodeDataByBluetooth: 'https://codeok.cn/wx-lock-api/getQrCodeDataByBluetooth',
  }
})