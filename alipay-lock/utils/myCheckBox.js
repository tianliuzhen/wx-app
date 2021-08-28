const _my = require("../__antmove/api/index.js")(my);
const wx = _my;
const app = getApp();

function initChekBox(pointer, areaId, openId) {
    var that = pointer; // 请求数据

    var data = [];
    wx.request({
        url:
            app.globalData.api_getDeviceTreeMenu +
            "?areaId=" +
            areaId +
            "&openId=" +
            openId +
            "&type=1",
        method: "post",
        success: res => {
            data = res.data.data; // ==========

            for (let j = 0; j < data.length; j++) {
                // 第一层
                const unit = data[j];

                for (let k = 0; k < unit.children.length; k++) {
                    // 第二层
                    const floor = unit.children[k];

                    for (let i = 0; i < floor.children.length; i++) {
                        // 第三层
                        const device = floor.children[i]; // console.log(device);

                        if (device.checked) {
                            data[j].isHidden = false;
                            data[j].children[k].isHidden = false;
                            data[j].checked = true;
                            data[j].children[k].checked = true;
                        }
                    }
                }
            }

            that.setData({
                menuTree: data
            });
            checkForChecked(that, data); // ==============
        }
    });
}
/**
 * 绑定，单元楼层，复选框选中事件
 */

function checkboxChangeBindAll(pointer, e) {
    var that = pointer;
    var index = e.currentTarget.dataset.index;
    var index2 = e.currentTarget.dataset.index2;
    var list = that.data.menuTree;

    if (index2 == undefined) {
        list[index].bindAll = !list[index].bindAll;
    }

    if (index2 != undefined) {
        list[index].children[index2].bindAll = !list[index].children[index2]
            .bindAll;
    } // checkboxChangeAll(pointer,e)
    // console.log(that.data.menuTree);

    that.setData({
        menuTree: list
    });
}
/**
 * 三层级，复选框选中事件
 */

function checkboxChangeAll(pointer, e) {
    var that = pointer;
    var index = e.currentTarget.dataset.index;
    var index2 = e.currentTarget.dataset.index2;
    var index3 = e.currentTarget.dataset.index3;
    var type = e.currentTarget.dataset.type;
    var list = that.data.menuTree;

    if (index2 == undefined) {
        // 隐藏第一级，下面所有
        list[index].checked = !list[index].checked;

        for (let i = 0; i < list[index].children.length; i++) {
            if (list[index].checked) {
                list[index].children[i].checked = true;
                list[index].isHidden = false;
            } else {
                list[index].children[i].checked = false; // list[index].isHidden = true
            }

            for (let k = 0; k < list[index].children[i].children.length; k++) {
                if (list[index].children[i].checked) {
                    list[index].children[i].children[k].checked = true;
                    list[index].children[i].isHidden = false;
                } else {
                    list[index].children[i].children[k].checked = false; // list[index].children[i].isHidden = true
                }
            }
        }
    }

    if (index2 != undefined && index3 == undefined) {
        // 隐藏第二级，下面所有
        list[index].children[index2].checked = !list[index].children[index2]
            .checked;

        for (let k = 0; k < list[index].children[index2].children.length; k++) {
            if (list[index].children[index2].checked) {
                list[index].children[index2].children[k].checked = true;
                list[index].checked = true;
                list[index].children[index2].isHidden = false;
            } else {
                list[index].children[index2].children[k].checked = false; // list[index].children[index2].isHidden = true
            }
        }

        var ifTwoChecked = false;

        for (let k = 0; k < list[index].children.length; k++) {
            if (list[index].children[k].checked == true) {
                ifTwoChecked = true;
            }
        }

        if (!ifTwoChecked) {
            list[index].checked = false;
        }
    } // 第三级切换

    if (index3 != undefined) {
        // list[index].checked = !list[index].checked
        // list[index].children[index2].checked = !list[index].children[index2].checked
        list[index].children[index2].children[index3].checked = !list[index]
            .children[index2].children[index3].checked;

        if (list[index].children[index2].children[index3].checked) {
            list[index].children[index2].checked = true;
            list[index].checked = true;
        } else {
            // 遍历同级的第三级元素是否都选中没有
            var ifThreeChecked = false;

            for (
                let k = 0;
                k < list[index].children[index2].children.length;
                k++
            ) {
                if (list[index].children[index2].children[k].checked == true) {
                    ifThreeChecked = true;
                }
            }

            if (!ifThreeChecked) {
                list[index].children[index2].checked = false;
            }

            var ifTwoChecked = false;

            for (let k = 0; k < list[index].children.length; k++) {
                if (list[index].children[k].checked == true) {
                    ifTwoChecked = true;
                }
            }

            if (!ifTwoChecked) {
                list[index].checked = false;
            }
        }
    }

    that.setData({
        menuTree: list
    }); // console.log(this.data.menuTree);
}
/**
 * 点击层级文字显示与否事件
 */

function opens(pointer, e) {
    var that = pointer;
    var index = e.currentTarget.dataset.index;
    var index2 = e.currentTarget.dataset.index2;
    var list = that.data.menuTree;

    if (index2 == undefined) {
        // 隐藏第一级
        list[index].isHidden = !list[index].isHidden;
    } else {
        // 隐藏第二级
        list[index].children[index2].isHidden = !list[index].children[index2]
            .isHidden;
    }

    that.setData({
        menuTree: list
    });
}
/**
 * 检测是否被选中
 */

function checkForChecked(pointer, data) {
    var that = pointer;
    var res = false;

    for (let j = 0; j < data.length; j++) {
        // 第一层
        const unit = data[j];

        if (unit.bindAll) {
            res = true;
            break;
        }

        for (let k = 0; k < unit.children.length; k++) {
            // 第二层
            const floor = unit.children[k];

            if (floor.bindAll) {
                res = true;
                break;
            }

            for (let i = 0; i < floor.children.length; i++) {
                // 第三层
                const device = floor.children[i]; // console.log(device);

                if (device.checked) {
                    res = true;
                    break;
                }
            }
        }
    }

    if (that.data.allChecked) {
        res = true;
    }

    that.setData({
        menuTreeRes: res ? "已选择设备" : "未选择设备"
    });
}

function allChecked(pointer, status) {
    var that = pointer;
    that.setData({
        allChecked: !that.data.allChecked
    });

    if (status == true || status == false) {
        that.setData({
            allChecked: status
        });
    }
}

module.exports = {
    initChekBox: initChekBox,
    checkboxChangeBindAll: checkboxChangeBindAll,
    checkboxChangeAll: checkboxChangeAll,
    opens: opens,
    checkForChecked: checkForChecked,
    allChecked: allChecked
};
