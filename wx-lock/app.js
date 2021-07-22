// app.js

import { request} from "/component/request/index.js";

var  domain='http://localhost:9999';
var  socketDomain='ws://localhost:9999';

// var  domain='https://codeok.cn';
// var  socketDomain= 'wss://codeok.cn';

// var  domain='https://hyznlock.cn';
// var  socketDomain= 'wss://hyznlock.cn';

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
  globalData: {
    userInfo: null,
    api_addUser: domain+'/wx-lock-api/addUser',
    api_getUserInfo: domain+'/wx-lock-api/getUserInfo',
    api_getUsersPage: domain+'/wx-lock-api/getUsersPage',
    api_auditPass: domain+'/wx-lock-api/auditPass',
    api_editUser: domain+'/wx-lock-api/editUser',
    api_getQrCode: domain+'/wx-lock-api/getQrCode',
    api_getRoleChildData: domain+'/wx-lock-api/getOrgChildData',
    api_getUserInfoByOpenId: domain+'/wx-lock-api/getUserInfoByOpenId',
    api_getOpenDoorRecord: domain+'/openDoorRecord/page',
    api_getDevices: domain+'/device/page',
    api_remoteOpen: domain+'/wx-lock-api/remoteOpen',
    api_updatePassword: domain+'/wx-lock-api/updatePassword',
    api_getQrCodeDataByBluetooth: domain+'/wx-lock-api/getQrCodeDataByBluetooth',
    api_getRemoteOpenDeviceList: domain+'/wx-lock-api/getRemoteOpenDeviceList',
    api_getDeviceTreeMenu: domain+'/wx-lock-api/getDeviceTreeMenu',
    api_websocket:socketDomain+ '/socketServer/',
  },
  
})