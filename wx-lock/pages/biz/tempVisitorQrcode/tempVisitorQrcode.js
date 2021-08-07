// 引入用来发送请求的方法
import {
  request
} from "../../../component/request/index.js";
var interval;
var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
const app = getApp()
var socket = require("../../../utils/socket")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    color: '#0094aa',
    user: {},
    qrCode: "",
    isShowQrCode: false,
    time: 10 * 6,
    count: 1,
    jsCode: "",
    isNewUser: true,
    isTip: true, // 提示点击获取二维码
    reRegister: false,
    errorMes: "",
    screenBrightness: "", // 系统默认亮度
    openId: "",
    qrcodePhone: "",
    img_add: '/icon/add.png',
    img_sub: '/icon/sub.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad-临时访客")
    console.log(options.openId);
    // 一般这里发送页面请求初始化页面
    if (wx.getStorageSync("userInfo") != null) {
      this.setData({
        inputValue: wx.getStorageSync("userInfo").mobile,
        openId: options.openId
      })
    }

    //  解析分享页面参数
    if (options != null && options != '') {
      if (options.openId != '' && options.openId != null) {
        this.setData({
          isNewUser: false,
          isShowQrCode: true,
          qrcodePhone: options.mobile,
          openId: options.openId
        })
        this.getQrocdeByClick(options.openId)
      }
    }
    this.connectSocket()


  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
    return {
      title: '临时访客码',
      desc: '请将二维码靠近设置扫码区域',
      path: '/pages/biz/tempVisitorQrcode/tempVisitorQrcode?openId=' + this.data.openId + "&mobile=" + this.data.qrcodePhone
      //这是一个路径
    }

  },
  onShow: function () {
    console.log("onShow:" + this.data.openId);
    // 页面出现在前台时执行
    this.setData({
      time: 10 * 6
    })
    clearInterval(interval);

    this.connectSocket()
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 页面关闭时，清空定时器函数
    clearInterval(interval);
    this.setData({
      time: 10 * 6
    })
    if (this.data.screenBrightness != null && this.data.screenBrightness != '') {
      wx.setScreenBrightness({
        value: this.data.screenBrightness,
      })
    }
    // 关闭socket
    socket.closeSocket(wx.getStorageSync("userInfo"))
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面关闭时，清空定时器函数
    clearInterval(interval);
    this.setData({
      time: 10 * 6
    })
    if (this.data.screenBrightness != null && this.data.screenBrightness != '') {
      wx.setScreenBrightness({
        value: this.data.screenBrightness,
      })
    }
    // 关闭socket
    socket.closeSocket(wx.getStorageSync("userInfo"))
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    // this.getQrocdeByClick(wx.getStorageSync("userInfoVisitor").openId)
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新。
    this.openDoorAfter()
    wx.stopPullDownRefresh()
  },
  connectSocket() {
    // 连接socket
    var userInfo = {
      openId: this.data.openId
    }
    userInfo.type = 3
    console.log(this.data.openId);
    socket.closeSocket(userInfo)
    socket.openSocket(userInfo, this)
  },
  openDoorAfter() {
    this.setData({
      time: 10 * 6
    })
    clearInterval(interval);
    this.refush()

  },
  refush() {
    // 访客没有缓存信息，主人才有
    if (!wx.getStorageSync("userInfo") == null) {
      this.getQrocdeByClick(wx.getStorageSync("userInfo").openId)
    } else {
      this.getQrocdeByClick(this.data.openId)
    }

  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let {
      mobile,
      visitorMobile,
      name,
      doorNo
    } = e.detail.value;

    if (!reg_tel.test(visitorMobile)) {
      wx.showToast({
        title: '访客手机号码输入有误',
        duration: 2000,
        icon: 'none'
      });
      return;
    }
    // 待确定1：是否需要短信验证 （|| !verificationCode || !doorNo ）
    if (!mobile || !name || !visitorMobile) {
      wx.showToast({
        title: '提交内容不能为空！',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
    this.setData({
      qrcodePhone: e.detail.value.visitorMobile
    })
    // 调用接口注册，注册之后弹窗提示注册成功
    this.addUser(e.detail.value)
  },
  addUser(requestData) {
    // 1、 清理之前数据
    this.setData({
      qrCode: ""
    })
    requestData.type = 3
    var userInfo = wx.getStorageSync("userInfo")
    if (userInfo != null && userInfo != '') {
      requestData.openId = userInfo.openId
    }

    // 2、发送数据换取开锁二维码
    wx.login({
      success: res => {
        // 获取code换openid
        // console.log("res.code:"+res.code);
        requestData.jsCode = res.code
        requestData.count = this.data.count
        request({
          url: app.globalData.api_addUser,
          data: requestData,
          method: 'POST',
        }).then(res => {
          wx.setStorageSync("userInfoVisitorHost", res.data.data)
          if (res.data.success) {
            // 主人申请访客码无需审核
            if (res.data.data.status == 1) {
              this.getQrocdeByClick(res.data.data.openId)
            }

            this.setData({
              isTip: true,
              isNewUser: false,
              isShowQrCode: true,
              reRegister: false,
              errorMes: "",
            })
          }
          if (!res.data.success) {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000,
            })
            if (res.data.message === '该访客已经申请') {
              this.setData({
                isNewUser: false,
                isShowQrCode: true,
              })
              this.getQrocdeByClick(wx.getStorageSync("userInfo").openId)
            }
          }
        });
      }
    })
    // 3、如果是新用户刷新缓存
  },
  //  todo 这里调用获取二维码权限
  getQrocdeByClick(openId) {
    request({
      url: app.globalData.api_getQrCode + "?openId=" + openId + "&types=3&mobile=" + this.data.qrcodePhone,
      method: 'post',
    }).then(res => {
      if (res.data.success) {
        this.setData({
          qrCode: res.data.data,
          isNewUser: false,
          isShowQrCode: true,
        })
        // 1、打开定时器去定时获取二维码接口
        this.setTime()

        // 2、亮度调节
        var that = this
        wx.getScreenBrightness({
          success: function (res) {
            that.setData({
              screenBrightness: res.value
            })
          }
        })
        // 设置屏幕亮度
        wx.setScreenBrightness({
          value: 1, //屏幕亮度值，范围 0~1，0 最暗，1 最亮
        })

        //

      } else {
        // 返回二维码异常
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 3000
        })
        this.setData({
          reRegister: true,
          errorMes: res.data.message
        })
      }

    })
  },
  // 设置计时器
  setTime() {
    let that = this
    var countDown = that.data.time;
    interval = setInterval(function () {
      countDown--;
      that.setData({
        time: countDown
      })
      if (that.data.time <= 0) {
        clearInterval(interval);
        that.getQrocdeByClick(wx.getStorageSync("userInfo").openId)
        that.setData({
          time: 10 * 6
        })
      }
    }, 1000)
  },
  //事件处理函数
  /*点击减号*/
  bindMinus: function () {
    var num = this.data.count;
    if (num > 1) {
      num--;
    }
    this.setData({
      count: num
    })
  },
  /*点击加号*/
  bindPlus: function () {
    var num = this.data.count;
    if (num < 256) {
      num++;
    }
    this.setData({
      count: num
    })
  },
})