// pages/biz/qrcode/qrcode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition:true,
    conditionQr:false,
    color:'#0094aa',
  },
  fun_click(){

  },
  fun_click_cancel(){
    this.setData({
      condition:true,
      conditionQr:false
    });
    console.log( this.data.condition);
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let { hostPhone, userName, visitorPhone, roomCode } = e.detail.value;
    if (!hostPhone || !userName || !visitorPhone || !roomCode) {
     wx.showToast({
      title: '提交内容不能为空！',
      icon: 'none',
      duration: 1500
    })
    return
    }
   //todo  这里调用接口生成二维码,打开
    this.setData({
      condition:false,
      conditionQr:true
    });
    console.log( this.data.condition);

  }
})