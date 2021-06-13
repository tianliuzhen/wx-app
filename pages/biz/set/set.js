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
    count: 0,
    menuTreeMaster: [{
      "parentNode": {
        "isHidden": false,
        "id": 0,
        "name": "用户管理",
        "childrenNode": [{
          "name": "访客管理",
          "type": "visitorManagerMaster"
        }]
      }
    }],
    menuTree: [{
        "parentNode": {
          "id": 0,
          "name": "用户管理",
          "isHidden": false,
          "childrenNode": [{
              "name": "用户列表",
              "type": "userList"
            },
            {
              "name": "待批列表",
              "type": "userListAudit"
            },
            {
              "name": "访客记录",
              "type": "visitorList"
            },
            {
              "name": "黑名单",
              "type": "blacklist"
            }
          ]
        }
      },
      {
        "parentNode": {
          "isHidden": false,
          "id": 1,
          "name": "设备管理",
          "childrenNode": [{
              "name": "开锁记录",
              "type": "lockRecord"
            },
            {
              "name": "设备列表",
              "type": "machineList"
            }
          ]
        }
      }
    ]

  },
  onTabItemTap(item) {
    //埋点
    console.log(item)
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
    // 开锁记录
    if (type == 'lockRecord') {
      wx.navigateTo({
        url: '../../biz/lockRecord/lockRecord',
      })
      return
    }
    // 设备列表
    if (type == 'machineList') {
      wx.showToast({
        title: '该功能开发中',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // 用户管理
    wx.navigateTo({
      url: '../../biz/userList/userList?type=' + type,
    })


  },

  // 用户列表
  longClickToUserList() {
    wx.navigateTo({
      url: '../../biz/userList/userList',
    })
  },
  onLoad: function (options) {
    this.initUser()
  },
  initUser() {
    // 初始化用户信息
    var userInfo = wx.getStorageSync("userInfo")
    if (userInfo != null && userInfo != '') {
      this.checkUser(userInfo)
    } else {
      // 登录
      this.loginUser()
    }
  },
  checkUser(userInfo) {
    // 1、访客或者普通用户直接返回
    console.log(userInfo);
    if (userInfo.type == 2 || userInfo.type == 3 || userInfo.blacklist == 1) {
      wx.showToast({
        title: '暂无权限！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // 2、判断是否是管理员并且已经审批通过
    if (userInfo.status === 1 && userInfo.type === 0 && userInfo.blacklist === 0) {
      this.setData({
        isManager: true
      })
    }
    if (userInfo.status === 1 && userInfo.type === 1 && userInfo.blacklist === 0) {
      this.setData({
        isManager: true,
        menuTree: this.data.menuTreeMaster
      })
    }

    // 3、如果没有审批通过再次查询
    if (userInfo.status === 0) {
      if (this.data.count >= 1) {
        return
      }
      this.loginUser()
    }
    if (userInfo.blacklist === 1) {
      wx.showToast({
        title: '暂无权限访问，你被拉黑，请联系管理员！',
        icon: 'none',
        duration: 2500
      })
      if (this.data.count >= 1) {
        return
      }
      this.loginUser()
    }
  },
  loginUser() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        request({
          url: app.globalData.api_getUserInfo + "?types=0,1",
          method: 'get',
          data: {
            jsCode: res.code
          }
        }).then(res => {
          // 存入缓存
          if (res.data.data != null) {
            wx.setStorageSync("userInfo", res.data.data)
            this.setData({
              count: this.data.count + 1
            })

            this.checkUser(res.data.data)
          }
        })
      }
    })
  },
  opens(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.menuTree
    console.log(index);
    list[index].parentNode.isHidden = !list[index].parentNode.isHidden
    this.setData({
      menuTree: list
    })

  }

})