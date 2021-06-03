const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [{
        "id": 1,
        "name": "张三",
        "phone": "1583616575",
        "createTime": "2021-12-22 10:22:11",
        "type": "普通用户",
        "code": "dx100",
        "limitCount": 21,
        "startTime": "2021-06-22 10:22:11",
        "endTime": "2021-08-22 10:22:11"
      },
      {
        "id": 2,
        "name": "李四",
        "phone": "1583616575",
        "createTime": "2021-12-23 10:22:11",
        "type": "管理员",
        "code": "dx101",
        "limitCount": 45,
        "startTime": "2021-07-22 10:27:11",
        "endTime": "2021-09-22 10:21:11"
      }
    ],
    date: '2021-06-01 12:00:00',
    cancel: '/icon/cancel.png',
    showModalStatus: false,
    userinfo: {},
    pageSize: 10, // 每页显示数量
    page: 1, // 当前页
    startTime: {
      time: "00:00",
      date: "2021-06-01"
    },
    endTime: {
      time: "00:00",
      date: "2021-08-01"
    },
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync("user"));

  },

  // 点击编辑按钮
  audit(e) {
    var res = e.currentTarget.dataset.userinfo;
    // console.log(res.startTime.substring(0, 10));
    // console.log(res.startTime.substring(11, 16));
    this.setData({
      userinfo: res,
      startTime: {
        date: res.startTime.substring(0, 10),
        time: res.startTime.substring(11, 16)
      },
      endTime: {
        date: res.endTime.substring(0, 10),
        time: res.endTime.substring(11, 16)
      },
      count:res.limitCount
    })
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 100, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  //数据的双向绑定
  inputedit(e) {
    this.buildUserInfo(e)
  },
  editUser() {
    console.log(this.data.userinfo);
    wx.showModal({
      title: '提示',
      content: '确认更新该用户信息?',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新。
    wx.stopPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");
  },

  /**
   * 动态渲染，双向数据绑定
   */
  buildUserInfo(e) {
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    let res = this.data.userinfo
    res[dataset.obj] = value
    //obj是我们使用data-传递过来的键值对的键
    this.setData({
      userinfo: res
    })
    console.log(this.data.userinfo);
  },
  bindStartTimeChange(e) {
    let dataset = e.currentTarget.dataset
    let value = e.detail.value;
    let res = this.data.startTime;
    res[dataset.obj] = value
    this.setData({
      startTime: res
    })
  },
  bindEndTimeChange(e) {
    let dataset = e.currentTarget.dataset
    let value = e.detail.value;
    let res = this.data.startTime;
    res[dataset.obj] = value
    this.setData({
      endTime: res
    })
  },

  //事件处理函数
  /*点击减号*/
  bindMinus: function () {
    var userInfo = this.data.userinfo
    var num = userInfo.limitCount;
    if (num > 1) {
      num--;
    }
    console.log(num);
    userInfo.limitCount = num
    this.setData({
      count: num
    })
  },
  /*点击加号*/
  bindPlus: function () {
    var userInfo = this.data.userinfo
    var num = userInfo.limitCount;
    num++;
    console.log(num);
    userInfo.limitCount = num
    this.setData({
      count: num
    })
    console.log(userInfo);
  }

})