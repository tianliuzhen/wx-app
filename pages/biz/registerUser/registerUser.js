// 引入用来发送请求的方法
import {
  request
} from "../../../component/request/index.js";
var interval;
const app = getApp()
var chinese = require("../../../utils/Chinese.js")
var english = require("../../../utils/English.js")
var socket = require("../../../utils/socket")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkBoxObjTemp:"",
    checkBoxObj:{
      itemsChecked: "",
      itemsCheckedNo: "",
      items: [
      ]
    },
    noObj: {
      floorNo: "",
      doorNo: "",
      buildingNo: ""
    },
    img_add: '/icon/add.png',
    img_sub: '/icon/sub.png',
    lanuage: "中文",
    content: chinese.Content,
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
    //小区-普通选择器：（普通数组）
    areaList: [],
    //远程开门-普通选择器：（普通数组）
    deviceList: [],
    areaListIndex: "", // 选择框选中值
    deviceId: "", // 设备蓝牙 deviceId
    deviceName: "", // 设备蓝牙 deviceName
    deviceData: "", // 设备蓝牙 deviceData
    service_id: "",
    blueData: "",
    read_id: "",
    write_id: "",
    indicate_id: "",
    dialogvisible: false

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
    this.initSysData()
    // 连接socket
    socket.openSocket(1)

  },
  onShow: function () {
    // 页面出现在前台时执行
    this.setData({
      time: 10 * 6
    })
    clearInterval(interval);
    this.initUser()
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
    this.closeConnect()
    // 关闭socket
    socket.closeSocket(1)
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
    // 关闭蓝牙
    this.closeConnect()
    // 关闭socket
    socket.closeSocket(1)
  },
 
  
  initSysData(){
    request({
      url: app.globalData.api_getRoleChildData,
      method: 'post',
    }).then(res => {
      this.setData({
        areaList: res.data.data
      })
    })

    if(wx.getStorageSync("userInfo")==null){
      return
    }
    var openId= wx.getStorageSync("userInfo").openId
    request({
      url: app.globalData.api_getRemoteOpenDeviceList +"?openId="+openId,
      method: 'post',
    }).then(res => {
      this.setData({
        deviceList: res.data.data
      })
    })
  },
  closeConnect() {
    if (this.deviceId) {
      // 断开设备连接
      wx.closeBLEConnection({
        deviceId: this.connectedDeviceId,
        success: function (res) {},
        fail(res) {}
      })
      // 关闭蓝牙模块
      wx.closeBluetoothAdapter({
        success: function (res) {},
        fail: function (err) {}
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
    this.refush()
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
      areaListIndex: e.detail.value
    })
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
    if (!mobile || !name   || !this.data.areaListIndex || !this.data.checkBoxObj.itemsCheckedNo) {
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
      url: app.globalData.api_getUserInfoByOpenId + "?openId=" + wx.getStorageSync("userInfo").openId + "&types=0,1",
      method: 'get',
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
            console.log("亮度==============================：" + res.value);
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
        requestData.deviceList = this.data.checkBoxObj.items
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
  },
  // 远程开门
  remoteClick(e) {
    // 跳过初始化
    if(e.detail.value == undefined ){
      return
    }
    var deviceCode=  this.data.deviceList[e.detail.value].code
    var openId = wx.getStorageSync("userInfo").openId
    request({
      url: app.globalData.api_remoteOpen + "?openId=" + openId + "&deviceCode="+deviceCode+"&types=0,1",
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
    if(this.data.areaListIndex === ''){
      wx.showToast({
        title: '请先选择小区！', 
        icon: 'none',
        duration: 1500  
      })
      return 
    }
    var areaId=this.data.areaList[this.data.areaListIndex].code
    if(this.data.checkBoxObj.items.length === 0){
      request({
        url: app.globalData.api_getRemoteOpenDeviceList +"?areaId="+areaId,
        method: 'post',
      }).then(res => {
        var checkBoxObj =this.data.checkBoxObj
        checkBoxObj.items= res.data.data
        this.setData({
          checkBoxObj: checkBoxObj
        })
      })
    }
    this.setData({
      dialogDevice: true
    })
  },
  closeDialog: function () {
    this.setData({
      dialogvisible: false,
      dialogDevice:false
    })
    // this._toast('关闭')
  },
  confirm: function () {
    this.closeDialog()
    // this._toast('confirm')
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
    // 1.1、如何判断蓝牙是否打开
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        wx.showModal({
          content: '请开启手机蓝牙后再试'
        })
        return
      }
    });
    // 1.2、开始搜索蓝牙
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        wx.showLoading({
          title: '搜索设备中...',
        })
        console.log('search:========', res)
      }
    })
    // 1.3、发现设备
    var that = this
    wx.getBluetoothDevices({
      success: function (res) {
        console.log('发现设备:', res)
        if (res.devices[0]) {
          console.log(res.devices[0])
        }
        //5s内未搜索到设备，关闭搜索，关闭蓝牙模块
        setTimeout(function () {
          if (!that.data.deviceId) {
            wx.hideLoading()
            wx.showModal({
              content: '未搜到设备...'
            });
            //关闭搜索
            wx.stopBluetoothDevicesDiscovery();
            //关闭蓝牙
            wx.closeBluetoothAdapter();
          }
        }, 5000)
      }
    });
    // 1.4、监听发现设备
    wx.onBluetoothDeviceFound(function (devices) {
      console.log('发现设备:', devices.devices)
      for (let i = 0; i < devices.devices.length; i++) {
        //检索指定设备
        if (devices.devices[i].name.substr(0, 4) == "FGBT") {
          wx.hideLoading()
          that.setData({
            deviceId: devices.devices[i].deviceId,
            deviceName: devices.devices[i].name
          })
          // =====>  蓝牙2、******* 连接设备
          that.toConnectionBlueToothDevice()
          //关闭搜索
          wx.stopBluetoothDevicesDiscovery();
          console.log('已找到指定设备id:', devices.devices[i].deviceId);
          console.log('已找到指定设备name:', devices.devices[i].name);
        }
      }
    })

  },
  /**
   * 蓝牙2、******* 连接设备
   */
  toConnectionBlueToothDevice() {
    console.log("toConnectionBlueToothDevice");
    var that = this
    if (that.data.deviceId === '') {
      return;
    }
    that.showDialog()
    // 2.1、建立连接
    wx.createBLEConnection({
      deviceId: that.data.deviceId, //搜索设备获得的蓝牙设备 id
      success: function (res) {
        console.log('连接蓝牙:', res.errMsg);

        var blueData = that.data.blueData
        blueData.connectData = '连接蓝牙成功'
        that.setData({
          blueData: blueData
        })
      },
      fail: function (res) {
        wx.showModal({
          content: '连接超时,请重试'
        });
        that.closeBluetoothAdapter();
      }
    })
    // 2.2、获取服务UUID
    wx.getBLEDeviceServices({
      deviceId: that.data.deviceId, //搜索设备获得的蓝牙设备 id
      success: function (res) {
        let serviceId = "";
        if (services.length <= 0) {
          wx.showModal({
            content: '未找到主服务列表'
          });
        }
        if (services.length == 1) {
          serviceId = services[0].uuid;
          that.setData({
            service_id: serviceId
          })
        }
        console.log('service_id:', that.data.service_id);
      },
      fail(res) {
        console.log(res);
      }
    })
    // 2.3 获取特征值
    wx.getBLEDeviceCharacteristics({
      deviceId: that.data.deviceId, //搜索设备获得的蓝牙设备 id
      serviceId: that.data.service_id, //服务ID
      success: function (res) {
        console.log('device特征值:', res.characteristics)
        for (let i = 0; i < res.characteristics.length; i++) {
          let charc = res.characteristics[i];
          if (charc.properties.indicate) {
            that.setData({
              indicate_id: charc.uuid
            });
            console.log('indicate_id:', that.data.indicate_id);
          }
          if (charc.properties.write) {
            that.setData({
              write_id: charc.uuid
            });
            console.log('写write_id:', that.data.write_id);
          }
          if (charc.properties.read) {
            that.setData({
              read_id: charc.uuid
            });
            console.log('读read_id:', that.data.read_id);
          }
        }
      }
    });
    // 2.4、开启notify
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: that.data.deviceId, //蓝牙设备id
      serviceId: that.data.service_id, //服务id
      characteristicId: that.data.indicate_id, //服务特征值indicate
      success: function (res) {
        console.log('开启notify', res.errMsg)
        //监听低功耗蓝牙设备的特征值变化
        wx.onBLECharacteristicValueChange(function (res) {
          console.log('特征值变化', res.value);
        })
        //写入数据
        var openId = wx.getStorageSync("userInfo").openId
        request({
          url: app.globalData.api_getQrCodeDataByBluetooth + "?openId=" + openId,
          method: 'post',
        }).then(res => {
          if (res.data.success) {
            that.setData({
              deviceData: "53" + res.data.data.para + "0D"
            })
            // 规定：头部+53，尾部+0D
            that.wrireToBlueToothDevice("53" + res.data.data.para + "0D")
          }

        })

      }
    })
  },
  // 测试发送数据
  blueToothClick_test() {
    var that = this
    var openId = wx.getStorageSync("userInfo").openId
    request({
      url: app.globalData.api_getQrCodeDataByBluetooth + "?openId=" + openId,
      method: 'post',
    }).then(res => {
      if (res.data.success) {
        that.setData({
          deviceData: "53" + res.data.data.para + "0D"
        })
        // 规定：头部+53，尾部+0D
        that.wrireToBlueToothDevice("53" + res.data.data.para + "0D")
      }

    })
  },
  /**
   * 3、 ********* 分片写入数据
   */
  wrireToBlueToothDevice(msg) {
    let buffer = this.hexStringToArrayBuffer(msg);
    let pos = 0;
    let bytes = buffer.byteLength;
    console.log("bytes", bytes)
    while (bytes > 0) {
      let tmpBuffer;
      if (bytes > 20) {
        // return this.delay(0.25).then(() => {
        tmpBuffer = buffer.slice(pos, pos + 20);
        console.log("pos: " + pos + " pos2: " + (pos + 20))
        pos += 20;
        bytes -= 20;
        var that = this
        wx.writeBLECharacteristicValue({
          deviceId: that.data.deviceId,
          serviceId: that.data.service_id,
          characteristicId: that.data.write_id,
          value: tmpBuffer,
          success(res) {
            var blueData = that.data.blueData
            blueData.sendData = res.errMsg
            that.setData({
              blueData: blueData
            })
            console.log('发送数据：', res.errMsg)
          }
        })
        // })
      } else {
        // return this.delay(0.25).then(() => {
        tmpBuffer = buffer.slice(pos, pos + bytes);
        console.log("pos: " + pos + " pos2: " + (pos + bytes))
        pos += bytes;
        bytes -= bytes;
        var that = this
        wx.writeBLECharacteristicValue({
          deviceId: that.data.deviceId,
          serviceId: that.data.service_id,
          characteristicId: that.data.write_id,
          value: tmpBuffer,
          success(res) {
            var blueData = that.data.blueData
            blueData.sendData = res.errMsg
            that.setData({
              blueData: blueData
            })
            console.log('最后一次发送数据：', res.errMsg)
          },
          fail: function (res) {
            console.log('发送失败', res)
          }
        })
        // })
      }
    }
  },
  hexStringToArrayBuffer(str) {
    if (!str) {
      return new ArrayBuffer(0);
    }
    var buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer)
    let ind = 0;
    for (var i = 0, len = str.length; i < len; i += 2) {
      let code = parseInt(str.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
    }
    return buffer;
  },
  delay(ms, res) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(res);
      }, ms);
    });
  },
  changeLanguage() {
    var version = this.data.lanuage;
    if (version == "中文") {
      this.setData({
        lanuage: "英文",
        content: chinese.Content
      })
    } else {
      this.setData({
        lanuage: "中文",
        content: english.Content
      })
    }
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var checkBoxObj =this.data.checkBoxObj
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
    console.log(this.data.checkBoxObj.items);
    checkBoxObj.itemsChecked="已选择"+values.length+"个设备"
    checkBoxObj.itemsCheckedNo = values.length
    this.setData({
      checkBoxObj:checkBoxObj
    })
  }
})