// pages/biz/qrcode/qrcode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: "你好",
    array: [1, 2, 3, 4, 5,1, 2, 3, 4, 5,1, 2, 3, 4, 5],
    person: {
      age: 24,
      name: "tlz"
    },
    view: 'MINA',
    isChecked: false,
    arrayObj: [{
      person: {
        age: 24,
        name: "tlz"
      }
    }],
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
})