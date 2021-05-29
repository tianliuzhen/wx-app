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
        "limitCount":255
      },
      {
        "id": 2,
        "name": "李四",
        "phone": "1583616575",
        "createTime": "2021-12-23 10:22:11",
        "type": "管理员",
        "code": "dx101",
        "limitCount":255
      }
    ],
    showModalStatus: false,
    userinfo: {
     
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  audit(e) {
    var res = e.currentTarget.dataset.userinfo;
    this.setData({
      userinfo: res
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
      duration: 20, //动画时长
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
   inputedit(e){
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    let res= this.data.userinfo
    res[dataset.obj]=value
    //obj是我们使用data-传递过来的键值对的键
    this.setData({
      userinfo: res
    })
    console.log(this.data.userinfo);
  },
  editUser() {
    console.log(this.data.userinfo);
  }

})