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
                    "id": "1-1-1",
                    "checked": true,
                    "field": "1",
                    "title": "设备1",
                }, {
                    "id": "1-1-2",
                    "checked": false,
                    "field": "2",
                    "title": "设备2"
                }],
                "id": "1-1",
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
                "id": "1-2",
                "field": "2-floor",
                "title": "2楼",
                "isHidden": true,
            }, {
                "checked": false,
                "children": [{
                    "id": "1-3-4",
                    "checked": true,
                    "field": "4",
                    "title": "设备4"
                }],
                "id": "1-3",
                "field": "3-floor",
                "title": "3楼",
                "isHidden": true,
            }],
            "id": "1",
            "isHidden": true,
            "bindAll": false,
            "field": "1-unit",
            "title": "1单元"
        }, {
            "checked": false,
            "children": [{
                "checked": false,
                "children": [{
                    "id": "2-1-1",
                    "checked": false,
                    "field": "5",
                    "title": "设备5"
                }],
                "id": "2-1",
                "field": "1-floor",
                "title": "1楼",
                "isHidden": true,
            }, {
                "checked": false,
                "children": [{
                    "id": "2-2-1",
                    "checked": false,
                    "field": "6",
                    "title": "设备6"
                }],
                "id": "2-2",
                "field": "2-floor",
                "title": "2楼",
                "isHidden": true,
            }],
            "bindAll": false,
            "isHidden": true,
            "field": "2-unit",
            "title": "2单元",
            "id": "2",
        }],
        deepList: [],
        deepListOne: []
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
    checkForChecked() {
        var data = this.data.menuTree

        // 获取所有被选中的节点
        var checkedNodes = this.getDeep(data)
        // 获取所有选中节点的父节点
        checkedNodes.forEach(element => {
            var tmp = this.getParentsById(data, element.id)
            if (tmp != undefined && tmp.length > 0) {
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
    // 递归 - 根据id获取所有父节点
    getParentsById(list, id) {
        for (let i in list) {
            if (list[i].id == id) {
                return [list[i]]
            }
            if (list[i].children) {
                let node = this.getParentsById(list[i].children, id);
                if (node !== undefined) {
                    return node.concat(list[i])
                }
            }
        }
    },
    // 递归 - 根据id获取当前节点对象
    getNodeById(data, id, newNodes = []) {
        data.forEach(element => {
            // 匹配到节点
            if (element.id === id) {
                newNodes.push(element)
            }
            if (element.children) {
                this.getNodeById(element.children, id, newNodes)
            }
        })
        return newNodes;
    },

    // 递归 - 根据id获取所有子节点，（其实就是先获取当前id的节点对象，然后取当前对象,注意这里返回的是数组）
    getChildrenById(data, id, newNodes = []) {
        var list = data.children
        if (list != undefined) {
            list.forEach(element => {
                newNodes.push(element)
                if (element.children) {
                    this.getChildrenById(element, id, newNodes)
                }
            })
        }
        return newNodes;
    },

    // 递归 - 获取所有选中节点
    getDeep(data, newCheckedNodes = []) {
        data.forEach(element => {
            if (element.checked) {
                newCheckedNodes.push(element)
            }
            if (element.children) {
                this.getDeep(element.children, newCheckedNodes)
            }
        })
        return newCheckedNodes
    },

    // 递归 - 根据节点id获取兄弟所有节点
    getBrotherNodesById(list, id) {
        // 非顶级节点：获取节点父节点对象里的children
        var parentNodes = this.getParentsById(list, id)
        if (parentNodes && parentNodes.length >= 2) {
            return parentNodes[1].children
        }
        // 顶级节点：第一级是自己，从原始数组中遍历第一层即可
        return list

    },

    // 根据当前节点id，获取及所有的父级兄弟节点的所有父节点
    getParentBrotherAllNodesById(list, id) {
        var result = []
        // 1、获取当前节点id父节点的父节点
        var parentNodes = this.getParentsById(list, id)

        // 小于3表示当前父节点是顶级节点
        if (parentNodes.length < 3) {
            return parentNodes[parentNodes.length - 1]
        }
        var testNode = parentNodes[2];
        // 2、获取父节点的父节点所有兄弟节点
        var children = testNode.children
        children.forEach(element => {
            var parentNodesById = this.getParentsById(list, element.id)
            if (parentNodesById.length >= 2) {
                // js 数组中添加多个元素 简单的方法 push(...[])
                result.push(...(parentNodesById.slice(0, parentNodesById.length - 1)))
            }
        });
        return result;
    },

    /**
     * 点击事件 - 左侧绑定复选框事件
     */
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


    /**
     * 点击事件 - 右侧复选框事件
     */
    checkboxChangeAll(e) {
        var id = e.currentTarget.dataset.id;
        var data = this.data.menuTree
        var node = this.getNodeById(data, id)
        var childrenNodes = this.getChildrenById(node[0], id)

        // 1、子节点点选中状态-跟随父节点移动
        node[0].checked = !node[0].checked
        // 节点下面的所有子节点跟随父节点的选中状态
        childrenNodes.forEach(element => {
            element.checked = node[0].checked
        })

        // 2、父节点选中状态,子节点都没选中，父节点默认不选中，子节点有一个选中，父节点也选中
        // 获取同级兄弟节点
        var bortherNodes = this.getBrotherNodesById(data, id)

        // 3、同级都选中
        var allChecked = false
        bortherNodes.forEach(element => {
            if (element.checked) {
                allChecked = true
            }
        })

        // 获取节点id所有父节点
        var parentNodes = this.getParentsById(data, id)
        if (parentNodes.length > 1) {
            if (allChecked) {
                // 下标index=0的节点是其本身，这里跳过
                for (let index = 1; index < parentNodes.length; index++) {
                    const element = parentNodes[index];
                    element.checked = true
                }
            }else{
                parentNodes[1].checked =false
            }
        }

        // 4、同级都未选中
        if (!allChecked) {
            var allNoChecked = false
            //  根据当前节点id，获取除去顶级节点的所有的父级兄弟节点的所有父节点
            var parentBother = this.getParentBrotherAllNodesById(data, id)
            console.log(parentBother);
            if (parentBother.length > 1) {
                parentBother.forEach(element => {
                    if (element.checked) {
                        allNoChecked = true
                    }
                });
            }
            console.log(allNoChecked);
            // console.log(parentBother);
            if(!allNoChecked){
                parentNodes.forEach(element => {
                    element.checked=false
                });
            }
        }


        this.setData({
            menuTree: data
        })
        // console.log(this.data.menuTree);
    },
    /**
     * 点击事件 - 点击层级显示和折叠事件
     */
    openAndHide(e) {
        var id = e.currentTarget.dataset.id;
        var list = this.data.menuTree

        console.log(id);
        // 根据 id 获取选中节点的对象
        var node = this.getNodeById(list, id)
        // 根据 id 获取选中节点下的所有子节点
        var res = this.getChildrenById(node[0], id)
        // 包含当前id节点本身
        res.push(node[0])

        // 遍历选中节点（及自己）是否展开
        res.forEach(element => {
            element.isHidden = !element.isHidden
        })

        this.setData({
            menuTree: list
        })

    }
})