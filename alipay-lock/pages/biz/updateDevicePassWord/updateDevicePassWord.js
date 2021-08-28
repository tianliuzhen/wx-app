const _my = require("../../../__antmove/api/index.js")(my);

const wx = _my; // pages/biz/updateDevicePassWord/updateDevicePassWord.js

const app = getApp();
import { request } from "../../../component/request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    devSn: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      devSn: options.devSn
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  fun_click(e) {
    if (this.data.password == "") {
      wx.showToast({
        title: "密码不能为空",
        icon: "none",
        duration: 1500
      });
      return;
    }

    var type = e.currentTarget.dataset.type;
    var openId = wx.getStorageSync("userInfo").openId;
    request({
      url: app.globalData.api_updatePassword + "?type=" + type + "&devSn=" + this.data.devSn + "&password=" + this.data.password + "&openId=" + openId,
      method: "post"
    }).then(res => {
      if (res.data.success) {
        wx.showToast({
          title: "已经执行，请核实",
          icon: "none",
          duration: 1500
        });
      } else {
        wx.showToast({
          title: res.data.message,
          icon: "none",
          duration: 3000
        });
      }
    });
  },

  formSubmit() {// 提交表单
  },

  formReset() {// 重置表单
  },

  antmoveAction: function () {
    //执行时动态赋值，请勿删除
  }
});