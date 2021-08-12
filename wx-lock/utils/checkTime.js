
// 检查时间
function  verifyTime(startTime,endTime){
  var beginTime=startTime.date +"-"+startTime.time
  var endTime=endTime.date +"-"+endTime.time
  if(beginTime.replace(/-/g,"").replace(":","") >= endTime.replace(/-/g,"").replace(":","")){
    wx.showToast({
      title: '有效开始时间不能大于等于有效结束时间！',
      duration: 2000,
      icon: 'none'
    });
    return false;
  }
  return true
}

module.exports = {
  verifyTime:verifyTime
}