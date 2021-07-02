// ----------------------------------
const app = getApp()
function openSocket(userInfo) {
  if (userInfo == null || userInfo == "") {
    return
  }
  var userId=userInfo.openId +"_"+userInfo.type
  // 连接socket
  wx.connectSocket({
    url: app.globalData.api_websocket + userId,
    success: function (res) {
      console.log("连接服务器成功")
    },
    fail: function (res) {
      console.log("连接服务器失败")
    }
  })
  // 连接事件监听
  wx.onSocketOpen(function (res) {
    console.log('WebSocket连接已打开！');
  })
  // 监听socket
  wx.onSocketMessage(function (res) {
    wx.showToast({
      title: res.data,
      icon: 'none',
      duration: 2500
    })
  })
}

function closeSocket(userInfo){
  if (userInfo == null || userInfo == "") {
    return
  }
  //如果 wx.connectSocket 还没回调 wx.onSocketOpen，而先调用 wx.closeSocket，那么就做不到关闭 WebSocket 的目的。
  //必须在 WebSocket 打开期间调用 wx.closeSocket 才能关闭。
  // wx.onSocketOpen(function() {
  //   wx.closeSocket()
  // })
  wx.closeSocket()
  wx.onSocketClose(function(res) {
    console.log('WebSocket 已关闭！')
  })
}

module.exports = {
  openSocket: openSocket,
  closeSocket:closeSocket
}