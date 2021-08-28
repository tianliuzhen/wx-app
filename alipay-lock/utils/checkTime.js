const _my = require("../__antmove/api/index.js")(my);
const wx = _my;
// 检查时间
function verifyTime(startTime, endTime) {
    var beginTime = startTime.date + "-" + startTime.time;
    var endTime = endTime.date + "-" + endTime.time;
    console.log(beginTime.replace(/-/g, "").replace(":", ""));
    console.log(endTime.replace(/-/g, "").replace(":", ""));

    if (
        beginTime.replace(/-/g, "").replace(":", "") >=
        endTime.replace(/-/g, "").replace(":", "")
    ) {
        wx.showToast({
            title: "有效开始时间不能大于等于有效结束时间！",
            duration: 2000,
            icon: "none"
        });
        return false;
    }

    return true;
}

function buO(time) {
    if (time >= 1 && time <= 9) {
        time = "0" + time;
    }

    return time;
}

module.exports = {
    verifyTime: verifyTime
};
