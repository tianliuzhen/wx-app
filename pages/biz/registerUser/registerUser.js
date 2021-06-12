// 引入用来发送请求的方法
import {
  request
} from "../../../component/request/index.js";
var interval;
const app = getApp()
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
    count: 0,
    jsCode: "",
    isNewUser: false,
    isTip: true, // 提示点击获取二维码
    reRegister: false,
    errorMes: "",
    screenBrightness: "", // 系统默认亮度
    //普通选择器：（普通数组）
    areaList: [],
    areaListIndex: "" // 选择框选中值

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
    // 一般这里发送页面请求初始化页面
    // 初始化用户信息
    // this.initUser()
    request({
      url: app.globalData.api_getRoleChildData,
      method: 'post',
    }).then(res => {
      this.setData({
        areaList: res.data.data
      })
    })
  },
  onShow: function () {
    // 页面出现在前台时执行
    this.initUser()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 页面关闭时，清空定时器函数
    clearInterval(interval);
    if (this.data.screenBrightness != null && this.data.screenBrightness != '') {
      wx.setScreenBrightness({
        value: this.data.screenBrightness,
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面关闭时，清空定时器函数
    clearInterval(interval);
    if (this.data.screenBrightness != null && this.data.screenBrightness != '') {
      wx.setScreenBrightness({
        value: this.data.screenBrightness,
      })
    }

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
     this.setData({
      time: 10 * 6
      })
    clearInterval(interval);
    this.initUser() 
    // this.getQrocdeByClick(wx.getStorageSync("userInfo").openId)
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新。
    wx.stopPullDownRefresh()
  },
  initUser() {
    // 初始化用户信息
    if (wx.getStorageSync("userInfo") != null && wx.getStorageSync("userInfo") != '') {
      if (wx.getStorageSync("userInfo").type === 2) {
        // return
      }
      this.checkUser(wx.getStorageSync("userInfo"))
    } else {
      // 登录
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
            wx.setStorageSync("userInfo", res.data.data)
            this.checkUser(res.data.data)
          })
        }
      })
    }

  },
  // 用户检测
  checkUser(userInfo) {
    // 用户信息不为空
    if (userInfo != null && userInfo != '') {
      this.setData({
        isNewUser: false,
        isShowQrCode: true,
      })
      // 审批通过
      if (userInfo.status == 1) {
        this.setData({
          isTip: false
        })
        this.getQrocdeByClick(userInfo.openId)
        // 审批中
      } else if (userInfo.status == 0) {
        wx.showToast({
          title: '审批中请等待！',
          icon: 'none',
          duration: 1500
        })
      }
      // 用户信息为空
    } else {
      this.setData({
        isNewUser: true,
        isShowQrCode: false,
      })
    }
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      areaListIndex: e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let {
      mobile,
      name,
      cardId,
      doorNo
      // verificationCode
    } = e.detail.value;
    // 待确定1：是否需要短信验证 （|| !verificationCode ）
    if (!mobile || !name  || !doorNo || !this.data.areaListIndex) {
      wx.showToast({
        title: '提交内容不能为空！',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(mobile))) {
      wx.showToast({
        title: '手机号码有误',
        duration: 2000,
        icon: 'none'
      });
      return;
    }
    // 调用接口注册，注册之后弹窗提示注册成功
    this.addUser(e.detail.value)
  },
  getQrocdeByClickManual() {
    this.refush()
  },
  refush() {
    request({
      url: app.globalData.api_getUserInfoByOpenId + "?openId=" + wx.getStorageSync("userInfo").openId,
      method: 'post',
    }).then(res => {
      wx.setStorageSync("userInfo", res.data.data)
      this.initUser()
    })
  },
  //  todo 这里调用获取二维码权限
  getQrocdeByClick(openId) {
    request({
      url: app.globalData.api_getQrCode + "?openId=" + openId + "&types=0,1",
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
  addUser(requestData) {
    // 1、 清理之前数据
    this.setData({
      qrCode: ""
    })
    if (requestData.isManger) {
      requestData.type = 0
    }
    if (!requestData.isManger) {
      requestData.type = 1
    }
    // 2、发送数据换取开锁二维码
    wx.login({
      success: res => {
        // 获取code换openid
        // console.log("res.code:"+res.code);
        requestData.jsCode = res.code
        requestData.areaId = this.data.areaList[this.data.areaListIndex].code
        request({
          url: app.globalData.api_addUser,
          data: requestData,
          method: 'POST',
        }).then(res => {
          wx.setStorageSync("userInfo", res.data.data)
          if (res.data.success) {
            wx.showToast({
              title: '已经提交，等待审核',
              icon: 'none',
              duration: 2000,
            })
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
          }
        });
      }
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
  reLoadImage: function (event) {
    // console.log(event)
    // this.setData({
    //   qrCode:""
    // })
  },
  reRegister() {
    this.setData({
      isNewUser: true,
      isShowQrCode: false,
    })
  }

})