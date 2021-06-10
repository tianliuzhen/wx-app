// pages/biz/set/set.js
const app = getApp()
import {
  request
} from "../../../component/request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openimg: "../../../icon/record.png",
    openimgMain: "../../../icon/pull.png",
    img_role: '/icon/no_role.png',
    isManager: false,
    count: 0
  },
  onShow: function () {
    // 页面出现在前台时执行
    this.setData({
      count: 0
    })
    this.initUser()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    this.setData({
      count: 0
    })
    this.initUser()
    wx.stopPullDownRefresh()
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新。

  },
  clickToUserList(e) {
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../../biz/userList/userList?type=' + type,
    })
  },
  longClickToUserList() {
    wx.navigateTo({
      url: '../../biz/userList/userList',
    })
  },
  onLoad: function (options) {
    this.initUser()
  },
  bindchange(e){
    console.log(1231);
    console.log(e);

  },
  initUser() {
    // 初始化用户信息
    var userInfo = wx.getStorageSync("userInfo")
    console.log(userInfo);
    if (userInfo != null && userInfo != '') {
      this.checkUser(userInfo)
    } else {
      // 登录
      this.loginUser()
    }
  },
  checkUser(userInfo) {
    // 1、访客或者普通用户直接返回
    if (userInfo.type != 0 &&  userInfo.blacklist==1) {
      console.log(111);
      wx.showToast({
        title: '暂无权限！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // 2、判断是否是管理员并且已经审批通过
    if (userInfo.status === 1 && userInfo.type === 0) {
      console.log(222);
      this.setData({
        isManager: true
      })
    }
    // 3、如果没有审批通过再次查询
    if (userInfo.status === 0 && userInfo.status === 0) {
      console.log(333);
      wx.showToast({
        title: '暂无权限访问，请等待该账户审核结束！',
        icon: 'none',
        duration: 1500
      })
      console.log(this.data.count);
      if (this.data.count >= 1) {
        return
      }
      this.loginUser()
    }
  }

  ,
  loginUser() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        request({
          url: app.globalData.api_getUserInfo,
          method: 'get',
          data: {
            jsCode: res.code
          }
        }).then(res => {
          // 存入缓存
          if(res.data.data != null ){
            wx.setStorageSync("userInfo", res.data.data)
            this.setData({
              count: this.data.count + 1
            })
            this.checkUser(res.data.data)
          }
        })
      }
    })
  }

})