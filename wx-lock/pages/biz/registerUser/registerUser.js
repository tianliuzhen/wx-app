// 引入用来发送请求的方法
import {
  request
} from "../../../component/request/index.js";
var interval;
const app = getApp()
var socket = require("../../../utils/socket")
var blueTooth = require("../../../utils/blueTooth")
var myCheckBox = require("../../../utils/myCheckBox")
var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    allChecked: false,
    menuTreeRes: '',
    menuTree: [],
    checkBoxObjTemp: "",
    checkBoxObj: {
      itemsChecked: "",
      itemsCheckedNo: "",
      items: []
    },
    noObj: {
      floorNo: "",
      doorNo: "",
      buildingNo: ""
    },
    img_add: '/icon/add.png',
    img_sub: '/icon/sub.png',
    lanuage: "中文",
    content: app.globalData.chinese.Content,
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
    screenBrightnessCount: 0, // 系统默认亮度次数
    //小区-普通选择器：（普通数组）
    areaList: [],
    //远程开门-普通选择器：（普通数组）
    deviceList: [],
    areaListIndex: "", // 选择框选中值
    areaListIndexTemp: "", // 选择框选中值
    deviceId: "", // 设备蓝牙 deviceId
    deviceName: "", // 设备蓝牙 deviceName
    deviceData: "", // 设备蓝牙 deviceData
    service_id: "",
    blueData: {},
    read_id: "",
    write_id: "",
    notify_id: "",
    indicate_id: "",
    dialogvisible: false,
    sendBlueDataList: [],
    userInfo: {},
    getPhone:"" // 绑定微信手机号

  },
  /*点击减号*/
  bindMinus: function (e) {
    var type = e.currentTarget.dataset.type
    var num = this.data.noObj[type];
    if (num > 1) {
      num--;
    }
    var obj = this.data.noObj
    obj[type] = num
    this.setData({
      noObj: obj
    })

  },
  /*点击加号*/
  bindPlus: function (e) {
    var type = e.currentTarget.dataset.type
    var num = this.data.noObj[type];
    num++;
    var obj = this.data.noObj
    obj[type] = num
    this.setData({
      noObj: obj
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
    // 一般这里发送页面请求初始化页面
    // 初始化用户信息
    // this.initUser()

  },

  onShareAppMessage: function () {
    // 页面被用户分享时执行
    return {
      title: '千里码门禁',
      path: '/pages/biz/registerUser/registerUser'
      //这是一个路径
    }

  },
  onShow: function () {
    console.log("onShow");
    // 页面出现在前台时执行
    this.setData({
      time: 10 * 6
    })
    clearInterval(interval);
    this.refush()
    console.log(wx.getStorageSync("userInfo") == null || wx.getStorageSync("userInfo") == '');

    // socket 连接处理
    this.refushSocket()
    
    // 初始化国际化翻译
    app.changeLanguage(this,"init")
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
    // 关闭蓝牙
    blueTooth.closeBlueTooth(this)
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

  },

  refushSocket() {
    console.log(wx.getStorageSync("userInfo"));
    console.log(wx.getStorageSync("userInfo") == null || wx.getStorageSync("userInfo") == '');
    if (wx.getStorageSync("userInfo") == null || wx.getStorageSync("userInfo") == '') {
      wx.login({
        success: res => {
          request({
            url: app.globalData.api_getUserInfo + "?types=0,1",
            method: 'get',
            data: {
              jsCode: res.code
            }
          }).then(res => {
            console.log(res.data.data);
            if (res.data.data != null) {
              wx.setStorageSync("userInfo", res.data.data)
              // 连接socket
              console.log(res.data.data);
              console.log("连接socket");
              socket.closeSocket(res.data.data)
              socket.openSocket(res.data.data, this)
            }

          })
        }
      })
    } else {
      socket.closeSocket(wx.getStorageSync("userInfo"))
      // 连接socket
      socket.openSocket(wx.getStorageSync("userInfo"), this)
    }
  },

  initSysData() {
    request({
      url: app.globalData.api_getRoleChildData,
      method: 'post',
    }).then(res => {
      this.setData({
        areaList: res.data.data
      })
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");

    this.openDoorAfter()
    // this.getQrocdeByClick(wx.getStorageSync("userInfo").openId)
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新。
    wx.stopPullDownRefresh()

    // 必须先关
    // socket.closeSocket(wx.getStorageSync("userInfo"))
    // socket 连接处理
    this.refushSocket()
  },
  openDoorAfter() {
    clearInterval(interval);
    this.setData({
      time: 10 * 6
    })
    this.refush()

    // socket 连接处理
    this.refushSocket()
  },

  initUser() {
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
          this.setData({
            userInfo: res.data.data
          })
          this.checkUser(res.data.data)
          // 初始化小区设备列表
          this.initDataCheckObj()
          // 如果是正常的用户
          // console.log(res.data.data);
          if (res.data.data != null && res.data.data.status == 1) {
            return
          }
          this.initSysData()
        })
      }
    })

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
          duration: 2500
        })
        // 审批拒绝
      } else if (userInfo.status == 2) {
        wx.showToast({
          title: '审批被拒绝！',
          icon: 'none',
          duration: 2500
        })
        this.setData({
          reRegister: true,
          errorMes: "审批被拒绝,请联系管理员！",
          isTip: false
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
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      areaListIndex: e.detail.value,
      checkBoxObj: {}
    })
    // 初始化菜单信息
    this.initChekBox(this.data.areaList[this.data.areaListIndex].code, "")
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let {
      mobile,
      name,
      cardId,
      doorNo,
      floorNo,
      buildingNo
      // verificationCode
    } = e.detail.value;
    // 待确定1：是否需要短信验证 （|| !verificationCode ）
    console.log(this.data.checkBoxObj.checkBoxObjTemp);
    if (!reg_tel.test(mobile)) {
      wx.showToast({
        title: '手机号码有误',
        duration: 2000,
        icon: 'none'
      });
      return;
    }
    if (!mobile || !name || !this.data.areaListIndex || this.data.menuTreeRes == '未选择设备') {
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
  getQrocdeByClickManual() {
    this.refush()
  },
  refush() {
    this.initUser()
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
          reRegister: false,
          isNewUser: false,
          isShowQrCode: true,
        })

        // 1、打开定时器去定时获取二维码接口
        this.setTime()

        // 2、亮度调节
        var that = this
        if (that.data.screenBrightnessCount == 0) {
          wx.getScreenBrightness({
            success: function (res) {
              console.log("亮度==============================：" + res.value);
              that.setData({
                screenBrightness: res.value,
                screenBrightnessCount: 1
              })
            }
          })
        }
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
        requestData.deviceTreeMenus = this.data.menuTree
        requestData.allChecked = this.data.allChecked

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
    clearInterval(interval);
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
  },
  initDataCheckObj() {
    if (wx.getStorageSync("userInfo") == null) {
      return
    }
    var areaId = wx.getStorageSync("userInfo").areaId
    var openId = wx.getStorageSync("userInfo").openId
    request({
      url: app.globalData.api_getRemoteOpenDeviceList + "?areaId=" + areaId + "&openId=" + openId,
      method: 'post',
    }).then(res => {
      var list = res.data.data
      var newList = []
      list.forEach(element => {
        if (element.checked) {
          newList.push(element)
        }
      });
      this.setData({
        deviceList: newList
      })

    })
  },
  // 远程开门
  remoteClick(e) {
    // 跳过初始化
    if (e.detail.value == undefined) {
      return
    }

    var deviceCode = this.data.deviceList[e.detail.value].code
    var openId = wx.getStorageSync("userInfo").openId
    request({
      url: app.globalData.api_remoteOpen + "?openId=" + openId + "&deviceCode=" + deviceCode + "&types=0,1",
      method: 'post',
    }).then(res => {
      if (res.data.success) {
        wx.showToast({
          title: "已经执行，请确认",
          icon: 'none',
          duration: 2500
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2500
        })
      }
    })
  },
  showDialog: function () {
    this.setData({
      dialogDevice: true
    })
  },
  showDialogDevice: function () {

    if (this.data.areaListIndex === '') {
      wx.showToast({
        title: '请先选择小区！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // 用于记录当前选中的小区code
    if (this.data.areaListIndexTemp == this.data.areaListIndex) {
      this.setData({
        dialogDevice: true
      })
      return
    }


    var areaId = this.data.areaList[this.data.areaListIndex].code
    request({
      url: app.globalData.api_getRemoteOpenDeviceList + "?areaId=" + areaId,
      method: 'post',
    }).then(res => {
      var checkBoxObj = this.data.checkBoxObj
      checkBoxObj.items = res.data.data
      this.setData({
        checkBoxObj: checkBoxObj
      })
    })
    this.setData({
      dialogDevice: true
    })
    this.setData({
      areaListIndexTemp: this.data.areaListIndex
    })
  },
  closeDialog: function () {
    this.setData({
      dialogvisible: false,
      dialogDevice: false
    })
    // this._toast('关闭')
  },
  confirm: function () {
    this.closeDialog()
    // this._toast('confirm')
    this.checkForChecked()
  },
  cancel: function () {
    this.closeDialog()
    // this._toast('cancel')
  },
  _toast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  /**
   *  蓝牙1、******* 判断蓝牙是否打开、搜索指定设备、解析deviceId
   */
  blueToothClick() {
    if (wx.getStorageSync("userInfo").status == 0) {
      wx.showToast({
        title: "当前用户未审批，请联系管理员！",
        icon: 'none',
        duration: 2000
      })
      return
    }
    blueTooth.initBlueTooth(this)
  },


  delay(ms, res) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(res);
      }, ms);
    });
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var checkBoxObj = this.data.checkBoxObj
    const items = checkBoxObj.items
    const values = e.detail.value

    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].code === values[j]) {
          items[i].checked = true
          break
        }
      }
    }

    checkBoxObj.items = items
    checkBoxObj.itemsChecked = "已选择" + values.length + "个设备"
    checkBoxObj.itemsCheckedNo = values.length
    this.setData({
      checkBoxObj: checkBoxObj
    })

  },
  confirmBlue() {
    blueTooth.sendBLECharacterNotice(this)
    // blueTooth.closeBlueTooth(this)
    this.setData({
      dialogvisible: false
    })
  },
  cancelBlue() {
    blueTooth.closeBlueTooth(this)
    this.setData({
      dialogvisible: false
    })
  },

  /**
   * 多选框操作事件
   */
  /**
   * 多选框操作事件
   */
  checkboxChangeBindAll(e) {
    myCheckBox.checkboxChangeBindAll(this, e)
  },
  checkboxChangeAll(e) {
    myCheckBox.checkboxChangeAll(this, e)
  },
  opens(e) {
    myCheckBox.opens(this, e)
  },
  initChekBox(areaId, openId) {
    myCheckBox.initChekBox(this, areaId, openId)
  },
  checkForChecked() {
    myCheckBox.checkForChecked(this, this.data.menuTree)
  },
  allChecked(status) {
    myCheckBox.allChecked(this, status)
  },


  /**
   绑定手机号
   */
  getPhoneNumber(e) {
    app.getPhoneNumber(e,this)
  },

  /**
   中英文切换
   */
  changeLanguage() {
    app.changeLanguage(this)
  },

})
