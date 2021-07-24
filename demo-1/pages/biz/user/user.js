Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],
    msg:"",
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that  = this
    console.log("onLoad")
    console.log(options)
    // 一般这里发送页面请求初始化页面
    wx.request({
      url:'http://localhost:8080/banner/getBannerList',
      data:{type:1},
      method:'GET',
      success:(res) =>{ // 箭头函数不需要that指向this
        //  success: function(res) {
        // console.log(res.data)
        this.setData({
          swiperList: res.data.data
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  testfun(){
    const str="测试点击第"+this.data.count+"次"
    this.setData({
      msg: str,
      count: this.data.count+1
    })
  }
})