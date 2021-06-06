// pages/biz/set/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openimg: "../../../icon/record.png",
  },
  clickToUserList(e){
   var type= e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../../biz/userList/userList?type='+type,
    })
  },
  longClickToUserList(){
    wx.navigateTo({
      url: '../../biz/userList/userList',
    })
  },
  
})