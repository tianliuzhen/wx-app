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
    userList: [],
    date: '2021-06-01 12:00:00',
    cancel: '/icon/cancel.png',
    img_add: '/icon/add.png',
    img_sub: '/icon/sub.png',
    showModalStatus: false,
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
    areaListIndex:"", // 选择框选中值
    area:""
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
      console.log(res);
     this.setData({
      areaList:res.data.data
     })
    })

    if(options.type!=null &&  options.type=='visitorList'){
      this.setData({
        isVisitorList:true
      })
      this.data.requestData.condition={'type':2}
    }
    if(options.type!=null &&  options.type=='blacklist'){
      this.setData({
        isVisitorList:true
      })
      this.data.requestData.condition={'blacklist':1}
    }
    if(options.type!=null &&  options.type=='userListAudit'){
      this.data.requestData.condition={'status':0}
    }
    
    if (wx.getStorageSync("userInfo") != null && wx.getStorageSync("userInfo") != '') {
      var userInfo = wx.getStorageSync("userInfo")
      this.data.requestData.condition.area_id=userInfo.areaId
    }
    // 初始化加载列表
    this.initDataUserList(this.data.requestData)
  },
  initDataUserList(data) {

    
    request({
      url: app.globalData.api_getUsersPage,
      data: data,
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
    var area= this.data.areaList[e.detail.value].name
    var userinfo= this.data.userinfo
    userinfo.areaId=this.data.areaList[e.detail.value].code
    this.setData({
      areaListIndex: e.detail.value,
      area:area,
      userinfo:userinfo
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
      area: res.areaId
    })
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 100, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });
    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;
    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();
    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })
      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
    // 显示
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
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

  search() {
    var res = this.data.requestData
    res.pageIndex = 1
    this.setData({
      requestData: res,
      userList: []
    })
    this.data.requestData.condition = {
      'name': this.data.searchContion
    }
    this.initDataUserList(this.data.requestData)
  },
  // doAudit 用户操作
  doAudit(e) {
    var type=e.currentTarget.dataset.type
    var tip = e.currentTarget.dataset.desc
    wx.showModal({
      title: '提示',
      content: '确认 '+tip+' 该用户?',
      success:res=> {
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
  userOpertion( type) {

    // 刷新拉黑缓存
    if(type==5){
      var userInfo = wx.getStorageSync("userInfo")
      userInfo.blacklist =1
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
    wx.showModal({
      title: '提示',
      content: '确认更新该用户信息?',
      success:res=> {
        if (res.confirm) {
          request({
            url: app.globalData.api_editUser,
            data: this.data.userinfo,
            method: 'POST',
          }).then(res=>{
            this.util('close')
            this.initDataUserList(this.data.requestData)
          })
        }
      }
    })
  },
})