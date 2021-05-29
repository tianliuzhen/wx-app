// 引入用来发送请求的方法
import {
  request
} from "../../../request/index.js";
const app=getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    color: '#0094aa',
    user: {},
    qrCode: "",
    isShowForm: true,
    isShowQrCode: false,
    time: 10,
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
    // 一般这里发送页面请求初始化页面


  },
  fun_register() {
    console.log(this.data.user.name);
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let {
      phone,
      userName,
      code,
      roomCode,
      verificationCode
    } = e.detail.value;
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '手机号码有误',
        duration: 2000,
        icon: 'none'
      });
      return ;
    }
    if (!phone || !userName || !code || !roomCode || !verificationCode) {
      wx.showToast({
        title: '提交内容不能为空！',
        icon: 'none',
        duration: 1500,
      })
      return ;
    }
    // 调用接口注册，注册之后弹窗提示注册成功
    this.getQrcode()
  },
  getQrcode() {
    console.log("user："+wx.getStorageSync('user'));

    // 1、 清理之前数据
    this.setData({
      qrCode: ""
    })
    // 2、发送数据换取开锁二维码
    wx.request({
      url: app.globalData2.domain+ '/shared/getQRCode',
      header: {
        userToken: 'no2RPgdNqokTSqWTV2Ae3G+8pzALzeW4UPv5UpJk8tE='
      },
      method: 'GET',
      success: (res) => {
        this.setData({
          qrCode: res.data.data,
          isShowForm: false,
          isShowQrCode: true
        })
        this.setTime()
      },
      fail: (res) => {},
      complete: (res) => {},
    })
    // 3、如果是新用户刷新缓存
  },
  checkPhoneCode(e) {
    // 获取输入框的值，用来发送接口校验
    console.log(e.detail.value);
  },

  // 设置计时器
  setTime() {
    let that = this
    let myTime = setInterval(function () {
      that.setData({
        time: that.data.time - 1
      })
      if (that.data.time == 0) {
        clearInterval(myTime)
        that.getQrcode()
        that.setData({
          time: 10
        })

      }
    }, 1000)
  },
  reLoadImage: function (event) {
    // console.log(event)
    // this.setData({
    //   qrCode:""
    // })
  }

})