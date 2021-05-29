// pages/myOrder/myOrder.js
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    userList: [
      {
        "id":1,
        "name": "张三",
        "phone": "1583616575",
        "createTime": "2021-12-22 10:22:11",
        "type": "普通用户",
        "code": "dx100"
      },
      {
        "id":2,
        "name": "李四",
        "phone": "1583616575",
        "createTime": "2021-12-23 10:22:11",
        "type": "管理员",
        "code": "dx101"
      }
      
    ]
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
 
  //点击切换隐藏和显示
  toggleBtn: function (event) { 
    var that = this;
    var toggleBtnVal = that.data.uhide;
    var itemId = event.currentTarget.id; 
    if (toggleBtnVal == itemId) {
      that.setData({
        uhide: 0
      })
    } else {
      that.setData({
        uhide: itemId
      })
    } 
  }
})