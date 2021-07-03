/**
 [{
        "id": 1, "name": "张三",   "phone": "1583616575",    "createTime": "2021-12-22 10:22:11",  "type": "普通用户",     "code": "dx100",     "limitCount": 21,       "startTime": "2021-06-22 10:22:11",     "endTime": "2021-08-22 10:22:11"
      },
      {   "id": 2,   "name": "李四",   "phone": "1583616575",  "createTime": "2021-12-23 10:22:11",  "type": "管理员",
        "code": "dx101",    "limitCount": 45,    "startTime": "2021-07-22 10:27:11",    "endTime": "2021-09-22 10:21:11"
      }
    ]
 */


const app = getApp()
import {
  request
} from "../../../component/request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkBoxObj: {
      itemsChecked: "",
      itemsCheckedNo: "",
      items: []
    },
    userList: [],
    date: '2021-06-01 12:00:00',
    cancel: '/icon/cancel.png',
    img_add: '/icon/add.png',
    img_sub: '/icon/sub.png',
    showModalStatus: false,
    showModalStatus2: false,
    userinfo: {},
    pageSize: 10, // 每页显示数量
    page: 1, // 当前页
    startTime: {
      time: "00:00",
      date: "2021-06-01"
    },
    endTime: {
      time: "00:00",
      date: "2021-08-01"
    },
    count: 0,
    requestData: { // 分页请求参数
      "pageIndex": 1,
      "pageSize": 10,
      "orderBy": [
        "create_time"
      ],
      "direction": "desc",
      "condition": {
        // "name":"a"
      },

    },
    searchContion: "", //搜索条件
    totalPage: 0, // 总条数
    isVisitorList: false, // 是否是访客记录页面
    areaList: [],
    areaListIndex: "", // 选择框选中值
    area: "",
    type: "" // 用户类型
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    request({
      url: app.globalData.api_getRoleChildData,
      method: 'post',
    }).then(res => {
      this.setData({
        areaList: res.data.data
      })
    })


    if (options.type != null && options.type == 'visitorList') {
      this.setData({
        isVisitorList: true
      })
      this.data.requestData.condition = {
        'type': 2
      }
    }
    if (options.type != null && options.type == 'blacklist') {
      // this.setData({
      //   isVisitorList: true
      // })
      this.data.requestData.condition = {
        'blacklist': 1
      }
    }
    if (options.type != null && options.type == 'userListAudit') {
      this.data.requestData.condition = {
        'status': 0
      }
    }
    if (options.type != null && options.type == 'visitorManagerMaster') {
      this.data.requestData.condition = {
        'type': 2,
        'respondents_mobile': wx.getStorageSync("userInfo").mobile
      }
    }

    var res = this.data.requestData
    this.setData({
      requestData: res
    })


  },
  onShow: function () {
    // 初始化加载列表
    this.initDataUserList()
  },
  initDataUserList() {
   request({
      url: app.globalData.api_getUserInfoByOpenId +"?openId=" + wx.getStorageSync("userInfo").openId+"&types=0,1",
      method: 'get',
    }).then(res => {
      // 存入缓存
      if(res.data.data !=null){
        wx.setStorageSync("userInfo", res.data.data)
        var req=this.data.requestData
        req.condition.area_id = res.data.data.areaId
        this.initUserList(req)
      }
    })
    
  },
  initUserList(req){
    request({
      url: app.globalData.api_getUsersPage,
      data: req,
      method: 'POST',
    }).then(res => {
      this.setData({
        userList: res.data.data.data,
        totalPage: res.data.data.totalPage
      })
      wx.stopPullDownRefresh()
    })
  },

  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var area = this.data.areaList[e.detail.value].name
    var userinfo = this.data.userinfo
    userinfo.areaId = this.data.areaList[e.detail.value].code
    this.setData({
      areaListIndex: e.detail.value,
      area: area,
      userinfo: userinfo,
      checkBoxObj:{}
    })
  },
  // 点击编辑按钮
  audit(e) {
    var res = e.currentTarget.dataset.userinfo;
    // console.log(res.startTime.substring(0, 10));
    // console.log(res.startTime.substring(11, 16));
    var status;
    if (res.status === '通过') {
      status = false
    } else {
      status = true
    }
    this.setData({
      userinfo: res,
      startTime: {
        date: res.startTime.substring(0, 10),
        time: res.startTime.substring(11, 16)
      },
      endTime: {
        date: res.endTime.substring(0, 10),
        time: res.endTime.substring(11, 16)
      },
      count: res.count,
      area: res.areaName
    })
    this.initDataCheckObj(res.areaId, res.openId)
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
     //关闭
     if (currentStatu == "close") {
      this.setData({
        showModalStatus: false
      });
    }
    if (currentStatu == "close2") {
      this.setData({
        showModalStatus2: false,
        showModalStatus: true
      });
    }
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
    if (currentStatu == "open2") {
      this.setData({
        showModalStatus2: true,
        showModalStatus: false
      });
    }
  },
  //数据的双向绑定
  inputedit(e) {
    this.buildUserInfo(e)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新。
    // 初始化加载列表
    this.initDataUserList(this.data.requestData)

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.requestData.pageIndex >= this.data.totalPage) {
      wx.showToast({
        title: '已经到底了！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.data.requestData.pageIndex = this.data.requestData.pageIndex + 1
    this.initDataUserListPush(this.data.requestData)
  },
  initDataUserListPush(data) {

    if (wx.getStorageSync("userInfo") != null && wx.getStorageSync("userInfo") != '') {
      var userInfo = wx.getStorageSync("userInfo")
      data.condition.area_id = userInfo.areaId
    }

    request({
      url: app.globalData.api_getUsersPage,
      data: data,
      method: 'POST',
    }).then(res => {
      var list = this.data.userList.concat(res.data.data.data)
      this.setData({
        userList: list,
        totalPage: res.data.data.totalPage
      })
    })
  },
  /**
   * 动态渲染，双向数据绑定
   */
  buildUserInfo(e) {
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    let res = this.data.userinfo
    res[dataset.obj] = value
    console.log(res);
    //obj是我们使用data-传递过来的键值对的键
    this.setData({
      userinfo: res
    })
  },
  bindStartTimeChange(e) {
    let dataset = e.currentTarget.dataset
    let value = e.detail.value;
    let res = this.data.startTime;
    res[dataset.obj] = value
    this.setData({
      startTime: res
    })
  },
  bindEndTimeChange(e) {
    let dataset = e.currentTarget.dataset
    let value = e.detail.value;
    let res = this.data.endTime;
    res[dataset.obj] = value
    this.setData({
      endTime: res
    })
  },

  //事件处理函数
  /*点击减号*/
  bindMinus: function () {
    var userInfo = this.data.userinfo
    var num = userInfo.count;
    if (num > 1) {
      num--;
    }
    userInfo.count = num
    this.setData({
      count: num
    })
  },
  /*点击加号*/
  bindPlus: function () {
    var userInfo = this.data.userinfo
    var num = userInfo.count;
    num++;
    userInfo.count = num
    this.setData({
      count: num
    })
  },
  // 搜索input框双向绑定
  searchContion(e) {
    let value = e.detail.value;
    this.setData({
      searchContion: value
    })
  },
  searchV2() {

  },
  search() {
    var res = this.data.requestData
    res.pageIndex = 1
    res.condition.name = this.data.searchContion
    this.setData({
      requestData: res,
      userList: []
    })
    this.initDataUserList()
  },
  // doAudit 用户操作
  doAudit(e) {
    var type = e.currentTarget.dataset.type
    var tip = e.currentTarget.dataset.desc
    wx.showModal({
      title: '提示',
      content: '确认 ' + tip + ' 该用户?',
      success: res => {
        if (res.confirm) {
          this.userOpertion(type)
        }
      }
    })
  },

  /**
   * 用户操作
   * @param {*} id  用户id
   * @param {*} type  1-审批/驳回，2-删除，3-禁用/解禁
   */
  userOpertion(type) {

    // 刷新拉黑缓存
    if (type == 5) {
      var userInfo = wx.getStorageSync("userInfo")
      userInfo.blacklist = 1
      wx.setStorageSync("userInfo", userInfo)
    }

    request({
      url: app.globalData.api_auditPass,
      data: {
        id: this.data.userinfo.id,
        type: type
      },
      method: 'get',
    }).then(res => {
      this.util('close')
      this.initDataUserList(this.data.requestData)
    })
  },
  // 更新用户
  editUser() {
    var startTime = this.data.startTime.date + " " + this.data.startTime.time + ":00"
    var endTime = this.data.endTime.date + " " + this.data.endTime.time + ":00"
    this.data.userinfo.startTime = startTime
    this.data.userinfo.endTime = endTime
    this.data.userinfo.deviceList = this.data.checkBoxObj.items
 
    // 如未修改小区
    this.buildAreaId();
    wx.showModal({
      title: '提示',
      content: '确认更新该用户信息?',
      success: res => {
        if (res.confirm) {
          request({
            url: app.globalData.api_editUser,
            data: this.data.userinfo,
            method: 'POST',
          }).then(res => {
            this.util('close')
            this.initDataUserList()
          })
        }
      }
    })
  },
  buildAreaId() {
    if (this.data.areaListIndex === '') {
      this.data.areaList.forEach(element => {
        if (element.name === this.data.userinfo.areaId) {
          this.data.userinfo.areaId = element.code;
        }
      });
    }
  },
  showDialogDevice() {
    console.log(111);

    if (this.data.areaListIndex === '') {
      this.util('open2');
      return
    }
    this.util('open2');
   
    if(this.data.areaListIndexTemp == this.data.areaListIndex){
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
      areaListIndexTemp:this.data.areaListIndex
    })

  },
  powerDrawer2() {
    this.util('close2');
  },
  initDataCheckObj(areaId, openId) {
    request({
      url: app.globalData.api_getRemoteOpenDeviceList + "?areaId=" + areaId + "&openId=" + openId,
      method: 'post',
    }).then(res => {
      var checkBoxObj = this.data.checkBoxObj
      checkBoxObj.items = res.data.data
      var values = res.data.data
      var no = 0
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (values[j].checked === true) {
          no++
        }
      }
      checkBoxObj.itemsChecked = "已选择" + no + "个设备"
      checkBoxObj.itemsCheckedNo = no
      this.setData({
        checkBoxObj: checkBoxObj
      })

    })
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
    checkBoxObj.itemsChecked = "已选择" + values.length + "个设备"
    checkBoxObj.itemsCheckedNo = values.length
    this.setData({
      checkBoxObj: checkBoxObj
    })
  },

})