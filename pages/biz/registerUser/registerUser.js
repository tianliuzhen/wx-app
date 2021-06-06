// 引入用来发送请求的方法
import {
  request
} from "../../../component/request/index.js";
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
    time: 10 * 600,
    count: 0,
    jsCode: "",
    isNewUser: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
   if( wx.getStorageSync("userInfo") != null && wx.getStorageSync("userInfo") !=''){
     this.setData({
      isNewUser:false,
      isShowQrCode: true,
     })
   }
    // 一般这里发送页面请求初始化页面
    // 登录
    wx.login({
      success: res => {
        // 获取code换openid
        // console.log("res.code:"+res.code);
        this.setData({
          jsCode: res.code
        })
      }
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let {
      mobile,
      name,
      cardId,
      door
      // verificationCode
    } = e.detail.value;
    if (!(/^1[34578]\d{9}$/.test(mobile))) {
      wx.showToast({
        title: '手机号码有误',
        duration: 2000,
        icon: 'none'
      });
      return;
    }
    // 待确定1：是否需要短信验证 （|| !verificationCode ）
    if (!mobile || !name || !cardId || !door) {
      wx.showToast({
        title: '提交内容不能为空！',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
    // 调用接口注册，注册之后弹窗提示注册成功
    this.addUser(e.detail.value)
  },
  getQrocdeByClick(){
    // todo 这里调用获取二维码权限
    this.setTime()
    wx.showToast({
      title: '审批未通过,请稍等！',
      icon: 'none',
      duration: 1500,
    })
  }
  ,
  addUser(requestData) {
    // 1、 清理之前数据
    this.setData({
      qrCode: ""
    })

    // 2、发送数据换取开锁二维码
    requestData.jsCode = this.data.jsCode
    console.log(requestData);
    request({
      url: app.globalData.api_addUser,
      data: requestData,
      method: 'POST',
    }).then(res => {
      console.log(res);
      if (res.data.success) {
        wx.showToast({
          title: '已经提交，等待审核',
          icon: 'none',
          duration: 2000,
        })
      }
      if (!res.data.success) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000,
        })
      }
      this.setData({
        isNewUser: false,
        isShowQrCode: true
      })
    });


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
  },

})