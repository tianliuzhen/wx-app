const _my = require("../__antmove/api/index.js")(my);

const wx = _my;
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/biz/registerUser/registerUser",
      text: "首页",
      iconPath: "/icon/_index.png",
      selectedIconPath: "/icon/index.png"
    }, {
      pagePath: "/pages/biz/visit/visit",
      text: "访客申请",
      iconPath: "/icon/_qrcode.png",
      selectedIconPath: "/icon/qrcode.png"
    }, {
      pagePath: "/pages/biz/set/set",
      text: "设置",
      iconPath: "/icon/_shezhi.png",
      selectedIconPath: "/icon/shezhi.png"
    }]
  },

  attached() {},

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url
      });
      this.setData({
        selected: data.index
      });
    },

    antmoveAction: function () {
      //执行时动态赋值，请勿删除
    }
  }
});