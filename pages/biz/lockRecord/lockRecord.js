// pages/biz/lockRecord/lockRecord.js

const app = getApp()
import {
  request
} from "../../../component/request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [],
    searchContion:"",
    requestData:{
      page:1,
      limit:10,
    },
    totalPage:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initDataList(this.data.requestData)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  search() {
    this.setData({
      recordList: [],
    })
    var res = this.data.requestData
    res.page = 1
    res.limit = 10
    this.data.requestData.devSn=this.data.searchContion
    this.data.requestData.cardNum=this.data.searchContion
    this.initDataList(this.data.requestData)
  },
  initDataList(data) {
    request({
      url: app.globalData.api_getOpenDoorRecord,
      data: data,
      method: 'get',
    }).then(res => {
      var list = res.data.data
      list = this.data.recordList.concat(list)
      list.forEach(element => {
        // 开锁类型处理
        switch (element.recordType) {
          case 1:
            element.recordType = '刷卡'
            break;
          case 2:
            element.recordType = '扫码'
            break;
          case 3:
            element.recordType = '蓝牙'
            break;
          case 4:
            element.recordType = '开关'
            break;
          default:
            break;
        }
        // 权限
        switch (element.isVaild) {
          case 1:
            element.isVaild = '开门'
            break;
          case 2:
            element.isVaild = '无权限'
            break;
          default:
            break;
        }
      });

      this.setData({
        recordList: list,
        totalPage:res.data.totalPage
      })
      wx.stopPullDownRefresh()
    })
  },
    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log( this.data.totalPage);
    if (this.data.requestData.page >= this.data.totalPage) {
      wx.showToast({
        title: '已经到底了！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.data.requestData.page = this.data.requestData.page + 1
    this.initDataList(this.data.requestData)
  },

})