// pages/biz/set/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openimg: "../../../icon/record.png",
  },
  clickToUserList(){
    wx.navigateTo({
      url: '../../biz/userList/userList',
    })
  },
  longClickToUserList(){
    wx.navigateTo({
      url: '../../biz/userList/userList',
    })
  },
  
})