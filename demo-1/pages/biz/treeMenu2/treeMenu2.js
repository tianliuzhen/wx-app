// pages/biz/treeMenu/treeMenu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      menuTreeImgLeft: "../../../icon/f_left.png",
      menuTreeImgBottom: "../../../icon/f_bottom.png",
      menuTree: [{
          "checked": false,
          "children": [{
              "checked": false,
              "children": [{
                 "id":"1-1-1",
                  "checked": true,
                  "field": "1",
                  "title": "设备1",
              }, {
                 "id":"1-1-2",
                  "checked": false,
                  "field": "2",
                  "title": "设备2"
              }],
              "id":"1-1",
              "field": "1-floor",
              "title": "1楼",
              "isHidden": true,
              "bindAll": false,
          }, {
              "checked": false,
              "children": [{
                  "checked": false,
                  "field": "3",
                  "title": "设备3"
              }],
              "id":"1-2",
              "field": "2-floor",
              "title": "2楼",
              "isHidden": true,
          }, {
              "checked": false,
              "children": [{
                "id":"1-3-4",
                  "checked": true,
                  "field": "4",
                  "title": "设备4"
              }],
              "id":"1-3",
              "field": "3-floor",
              "title": "3楼",
              "isHidden": true,
          }],
          "isHidden": true,
          "bindAll": false,
          "field": "1-unit",
          "title": "1单元"
      }, {
          "checked": false,
          "children": [{
              "checked": false,
              "children": [{
                   "id":"2-1-1",
                  "checked": false,
                  "field": "5",
                  "title": "设备5"
              }],
              "id":"2-1",
              "field": "1-floor",
              "title": "1楼",
              "isHidden": true,
          }, {
              "checked": false,
              "children": [{
                "id":"2-2-1",
                  "checked": false,
                  "field": "6",
                  "title": "设备6"
              }],
              "id":"2-2",
              "field": "2-floor",
              "title": "2楼",
              "isHidden": true,
          }],
          "bindAll": false,
          "isHidden": true,
          "field": "2-unit",
          "title": "2单元",
          "id":"2",
      }],
      deepList:[],
      deepListOne:[]
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     this.checkForChecked()
  },

  /**
   * 默认选中是否展开
   */
  checkForChecked(){
      var data = this.data.menuTree

      // 获取所有被选中的节点
      var checkedNodes=  this.getDeep(data)
    
      // 获取所有选中节点的父节点
      checkedNodes.forEach(element => {
        
      var tmp=  this.getCheckedParents(data,element.id)
      if(tmp !=undefined &&tmp.length>0 ){
        // 最后一级选中，默认展开和选中父级菜单
        tmp.forEach(element => {
          element.isHidden = false
          element.checked = true
        })
      }
      })

      this.setData({
        menuTree: data
    })
  },
  // 递归根据id获取所有父节点
  getCheckedParents(list,id){
    for (let i in list) {
        if(list[i].id==id){
          return [list[i]]
      }
      if(list[i].children){
        let node=this.getCheckedParents(list[i].children,id);
        if(node!==undefined){
            return node.concat(list[i])
        }
    }
    }
  },

  // 递归-获取所有选中节点
  getDeep(data,newCheckedNodes=[]){
    data.forEach(element => {
      if(element.checked){
        newCheckedNodes.push(element)
      }
      if(element.children){
        this.getDeep(element.children,newCheckedNodes)
      }
    })   
    return newCheckedNodes
  },

  checkboxChangeBindAll(e) {
      var index = e.currentTarget.dataset.index;
      var index2 = e.currentTarget.dataset.index2;
      var list = this.data.menuTree
      if (index2 == undefined) {
          list[index].bindAll = !list[index].bindAll
      }
      if (index2 != undefined) {
          list[index].children[index2].bindAll = !list[index].children[index2].bindAll
      }

      console.log(this.data.menuTree);
  },
  checkboxChange(e) {
      // console.log(e);
      console.log('checkbox发生change事件，携带value值为：', e.detail.value)
      const values = e.detail.value
  },
  checkboxChangeAll(e) {
      var index = e.currentTarget.dataset.index;
      var index2 = e.currentTarget.dataset.index2;
      var index3 = e.currentTarget.dataset.index3;
      var list = this.data.menuTree
      if (index2 == undefined) {
          // 隐藏第一级，下面所有
          list[index].checked = !list[index].checked
          for (let i = 0; i < list[index].children.length; i++) {
              if (list[index].checked) {
                  list[index].children[i].checked = true
                  list[index].isHidden = false
              } else {
                  list[index].children[i].checked = false
                  // list[index].isHidden = true
              }
              for (let k = 0; k < list[index].children[i].children.length; k++) {
                  if (list[index].children[i].checked) {
                      list[index].children[i].children[k].checked = true
                      list[index].children[i].isHidden = false
                  } else {
                      list[index].children[i].children[k].checked = false
                      // list[index].children[i].isHidden = true
                  }
              }
          }
      }
      if (index2 != undefined && index3 == undefined) {
          // 隐藏第二级，下面所有
          list[index].children[index2].checked = !list[index].children[index2].checked
          for (let k = 0; k < list[index].children[index2].children.length; k++) {
              if (list[index].children[index2].checked) {
                  list[index].children[index2].children[k].checked = true
                  list[index].checked = true
                  list[index].children[index2].isHidden = false
              } else {
                  list[index].children[index2].children[k].checked = false
                  // list[index].children[index2].isHidden = true
              }
          }
          var ifTwoChecked = false
          for (let k = 0; k < list[index].children.length; k++) {
              if (list[index].children[k].checked == true) {
                  ifTwoChecked = true
              }
          }
          if (!ifTwoChecked) {
              list[index].checked = false
          }

      }

      // 第三级切换
      if (index3 != undefined) {
          // list[index].checked = !list[index].checked
          // list[index].children[index2].checked = !list[index].children[index2].checked
          list[index].children[index2].children[index3].checked = !list[index].children[index2].children[index3].checked

          if (list[index].children[index2].children[index3].checked) {
              list[index].children[index2].checked = true
              list[index].checked = true
          } else {
              // 遍历同级的第三级元素是否都选中没有
              var ifThreeChecked = false
              for (let k = 0; k < list[index].children[index2].children.length; k++) {
                  if (list[index].children[index2].children[k].checked == true) {
                      ifThreeChecked = true
                  }
              }
              if (!ifThreeChecked) {
                  list[index].children[index2].checked = false
              }

              var ifTwoChecked = false
              for (let k = 0; k < list[index].children.length; k++) {
                  if (list[index].children[k].checked == true) {
                      ifTwoChecked = true
                  }
              }
              if (!ifTwoChecked) {
                  list[index].checked = false
              }
          }
      }

      this.setData({
          menuTree: list
      })

      // console.log(this.data.menuTree);
  },
  /**
   * 点击层级显示与否
   */
  opens(e) {
      var index = e.currentTarget.dataset.index;
      var index2 = e.currentTarget.dataset.index2;
      var list = this.data.menuTree
      if (index2 == undefined) {
          // 隐藏第一级
          list[index].isHidden = !list[index].isHidden
      } else {
          // 隐藏第二级
          list[index].children[index2].isHidden = !list[index].children[index2].isHidden
      }
      this.setData({
          menuTree: list
      })

  }
})
