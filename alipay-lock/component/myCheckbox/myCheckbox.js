// pages/biz/treeMenu/treeMenu.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuTreeImgLeft: "../../icon/f_left.png",
    menuTreeImgBottom: "../../icon/f_bottom.png",
    menuTree: [{
      checked: false,
      children: [{
        checked: false,
        children: [{
          checked: true,
          field: "1",
          title: "设备1"
        }, {
          checked: false,
          field: "2",
          title: "设备2"
        }],
        field: "1-floor",
        title: "1楼",
        isHidden: true,
        bindAll: false
      }, {
        checked: false,
        children: [{
          checked: false,
          field: "3",
          title: "设备3"
        }],
        field: "2-floor",
        title: "2楼",
        isHidden: true
      }, {
        checked: false,
        children: [{
          checked: true,
          field: "4",
          title: "设备4"
        }],
        field: "3-floor",
        title: "3楼",
        isHidden: true
      }],
      isHidden: true,
      bindAll: false,
      field: "1-unit",
      title: "1单元"
    }, {
      checked: false,
      children: [{
        checked: false,
        children: [{
          checked: false,
          field: "5",
          title: "设备5"
        }],
        field: "1-floor",
        title: "1楼",
        isHidden: true
      }, {
        checked: false,
        children: [{
          checked: false,
          field: "6",
          title: "设备6"
        }],
        field: "2-floor",
        title: "2楼",
        isHidden: true
      }],
      bindAll: false,
      isHidden: true,
      field: "2-unit",
      title: "2单元"
    }]
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var data = that.data.menuTree;

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
            data[j].children[k].checked = true; // console.log(data[j]);
          }
        }
      }
    }

    that.setData({
      menuTree: data
    });
  },

  /**
   * 绑定，单元楼层，复选框选中事件
   */
  checkboxChangeBindAll(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var index2 = e.currentTarget.dataset.index2;
    var list = that.data.menuTree;

    if (index2 == undefined) {
      list[index].bindAll = !list[index].bindAll;
    }

    if (index2 != undefined) {
      list[index].children[index2].bindAll = !list[index].children[index2].bindAll;
    }

    console.log(that.data.menuTree);
  },

  /**
   * 三层级，复选框选中事件
   */
  checkboxChangeAll(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var index2 = e.currentTarget.dataset.index2;
    var index3 = e.currentTarget.dataset.index3;
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
      list[index].children[index2].checked = !list[index].children[index2].checked;

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
      list[index].children[index2].children[index3].checked = !list[index].children[index2].children[index3].checked;

      if (list[index].children[index2].children[index3].checked) {
        list[index].children[index2].checked = true;
        list[index].checked = true;
      } else {
        // 遍历同级的第三级元素是否都选中没有
        var ifThreeChecked = false;

        for (let k = 0; k < list[index].children[index2].children.length; k++) {
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
  },

  /**
   * 点击层级文字显示与否事件
   */
  opens(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var index2 = e.currentTarget.dataset.index2;
    var list = that.data.menuTree;

    if (index2 == undefined) {
      // 隐藏第一级
      list[index].isHidden = !list[index].isHidden;
    } else {
      // 隐藏第二级
      list[index].children[index2].isHidden = !list[index].children[index2].isHidden;
    }

    that.setData({
      menuTree: list
    });
  },

  antmoveAction: function () {
    //执行时动态赋值，请勿删除
  }
});