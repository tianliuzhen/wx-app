/**
 * 初始化蓝牙
 * 蓝牙1、******* 判断蓝牙是否打开、搜索指定设备、解析deviceId
 * @param {*} this
 */
const app = getApp()
import {
    request
} from "../component/request/index.js";

var thisGlobal = null
// var sign= "Feas"
var sign = "FGBT"

function initBlueTooth(pointer) {
    thisGlobal = pointer
    var that = thisGlobal
    that.setData({
        deviceId: "",
        blueData: {}
    })
    // 1.1、如何判断蓝牙是否打开
    wx.openBluetoothAdapter({
        success: function (res) {
            console.log(res)
        },
        fail: function (res) {
            wx.showModal({
                content: '请开启手机蓝牙后再试'
            })
            return
        }
    });
    // 1.2、开始搜索蓝牙
    wx.startBluetoothDevicesDiscovery({
        success: function (res) {
            wx.showLoading({
                title: '搜索设备中...',
            })
            console.log('search:========', res)
        }
    })
    // 1.3、发现设备
    wx.getBluetoothDevices({
        success: function (res) {
            console.log('发现设备:', res)
            //5s内未搜索到设备，关闭搜索，关闭蓝牙模块
            setTimeout(function () {
                if (!that.data.deviceId) {
                    wx.hideLoading()
                    wx.showModal({
                        content: '未搜到设备...'
                    });
                    //关闭搜索
                    wx.stopBluetoothDevicesDiscovery();
                    //关闭蓝牙
                    wx.closeBluetoothAdapter();
                }
            }, 5000)
        }
    });
    // 1.4、监听发现设备
    wx.onBluetoothDeviceFound(function (devices) {
        console.log('监听设备:', devices.devices)
        for (let i = 0; i < devices.devices.length; i++) {
            //检索指定设备
            if (devices.devices[i].name.substr(0, 4) == sign) {
                wx.hideLoading()
                that.setData({
                    deviceId: devices.devices[i].deviceId,
                    deviceName: devices.devices[i].name
                })
                // =====>  蓝牙2、******* 连接设备
                toConnectionBlueToothDevice()
                //关闭搜索
                console.log("关闭搜索");
                wx.stopBluetoothDevicesDiscovery({
                    success: function (res) {
                        console.log('连接蓝牙成功之后关闭蓝牙搜索');
                    }
                });
                console.log('已找到指定设备id:', devices.devices[i].deviceId);
                console.log('已找到指定设备name:', devices.devices[i].name);
            }
        }
    })
}

/**
 * 蓝牙2、******* 连接设备
 */
function toConnectionBlueToothDevice() {
    var that = thisGlobal
    console.log("toConnectionBlueToothDevice");
    if (that.data.deviceId === '') {
        return;
    }
    // 2.1、建立连接
    console.log("建立连接");
    wx.createBLEConnection({
        deviceId: that.data.deviceId, //搜索设备获得的蓝牙设备 id
        success: function (res) {
            var blueData = that.data.blueData
            blueData.connectData = '连接蓝牙成功'
            that.setData({
                blueData: blueData,
                dialogvisible: true
            })
            // =======>  2.2、获取服务UUID
            getBLEServiceId(that.data.deviceId)
        },
        fail: function (res) {
            wx.showModal({
                content: '连接超时,请重试'
            });
            wx.closeBluetoothAdapter();
        }
    })


}

// 2.2、获取服务UUID
function getBLEServiceId(deviceId) {
    console.log("获取服务UUID:" + deviceId);
    var that = thisGlobal
    wx.getBLEDeviceServices({
        deviceId: deviceId, //搜索设备获得的蓝牙设备 id
        success: function (res) {
            let serviceId = "";
            var services = res.services;
            if (services.length <= 0) {
                wx.showModal({
                    content: '未找到主服务列表'
                });
            }
            if (services.length >= 1) {
                // 这里搜到多个服务，默认取第一个
                serviceId = services[0].uuid;
                that.setData({
                    service_id: serviceId
                })
                // =====>2.3 获取特征值
                getBLECharactedId(deviceId, serviceId);
            }
            console.log('service_id:', that.data.service_id);
        },
        fail(res) {
            console.log(res);
        }
    })
}

// 2.3 获取特征值
function getBLECharactedId(deviceId, serviceId) {
    var that = thisGlobal
    wx.getBLEDeviceCharacteristics({
        deviceId: deviceId, //搜索设备获得的蓝牙设备 id
        serviceId: serviceId, //服务ID
        success: function (res) {
            console.log('device特征值:', res.characteristics)
            for (let i = 0; i < res.characteristics.length; i++) {
                let charc = res.characteristics[i];
                // if (charc.properties.indicate) {
                //   that.setData({
                //     indicate_id: charc.uuid
                //   });
                //   console.log('indicate_id:', that.data.indicate_id);
                // }
                if (charc.properties.write) {
                    that.setData({
                        write_id: charc.uuid
                    });
                    console.log('写write_id:', that.data.write_id);
                    // todo 自动执行，转为手动执行
                    //  sendBLECharacterNotice();
                }
                if (charc.properties.notify) {
                    that.setData({
                        notify_id: charc.uuid
                    });
                    console.log('通知notify:', that.data.notify_id);
                    recvBLECharacterNotice(deviceId, serviceId, charc.uuid);
                }
                // if (charc.properties.read) {
                //   that.setData({        read_id: charc.uuid     });
                //   console.log('读read_id:', that.data.read_id);
                // }

            }
        }
    });
}

// 2.4、开启notify
function recvBLECharacterNotice(deviceId, serviceId, charId) {
    wx.notifyBLECharacteristicValueChange({
        state: true, // 启用 notify 功能
        deviceId: deviceId, //蓝牙设备id
        serviceId: serviceId, //服务id
        characteristicId: charId, //服务特征值indicate
        success: function (res) {
            console.log('开启notify', res.errMsg)
            //监听低功耗蓝牙设备的特征值变化
            wx.onBLECharacteristicValueChange(function (res) {
                console.log("收到Notify数据: ");
                console.log(ab2hext(res.value))
            })
        },
        fail: function (res) {
            console.log(res);
            console.log("特征值Notice 接收数据失败: " + res.errMsg);
        }
    })
}

// 2.5、发送数据
function sendBLECharacterNotice(pointer) {
    thisGlobal = pointer
    var that = thisGlobal
    //写入数据
    request({
        url: app.globalData.api_getQrCodeDataByBluetooth + "?openId=" + wx.getStorageSync("userInfo").openId,
        method: 'post',
    }).then(res => {
        if (res.data.success) {
            var blueData = that.data.blueData
            blueData.sendData = "53" + res.data.data + "0D" + "\\n"
            that.setData({
                blueData: blueData
            })
            // 规定：头部+53，尾部+0D
            console.log("###########");
            wrireToBlueToothDevice("53" + res.data.data + "0D" + "\\n")


            // 发送完数据之后，断开连接
            setTimeout(function () {
                console.log("*************");
                closeBlueTooth(pointer)
            }, 2000)

        }
    })
}

/**
 * 3、 ********* 分片写入数据
 */
function wrireToBlueToothDevice(msg) {
    console.log("msg:" + msg);
    let buffer = toAsciiToArrayBuffer(msg);
    let pos = 0;
    let bytes = buffer.byteLength;
    console.log("bytes：", bytes)
    while (bytes > 0) {
        let tmpBuffer;
        if (bytes > 20) {
            // return this.delay(0.25).then(() => {
            tmpBuffer = buffer.slice(pos, pos + 20);
            console.log("pos: " + pos + " pos2: " + (pos + 20))
            pos += 20;
            bytes -= 20;
            var that = thisGlobal
            wx.writeBLECharacteristicValue({
                deviceId: that.data.deviceId,
                serviceId: that.data.service_id,
                characteristicId: that.data.write_id,
                value: tmpBuffer,
                success(res) {
                    var list = that.data.sendBlueDataList
                    list.push(JSON.stringify(res))
                    that.setData({
                        sendBlueDataList: list
                    })
                    console.log(tmpBuffer);
                    console.log('发送成功：', res)
                },
                fail: function (res) {
                    console.log('发送失败', res)
                }
            })
            // })
        } else {
            // return this.delay(0.25).then(() => {
            tmpBuffer = buffer.slice(pos, (pos + bytes));
            // tmpBuffer = buffer.substr(pos, pos + 20)
            console.log("pos: " + pos + " pos2: " + (pos + bytes))
            pos += bytes;
            bytes -= bytes;
            var that = thisGlobal
            wx.writeBLECharacteristicValue({
                deviceId: that.data.deviceId,
                serviceId: that.data.service_id,
                characteristicId: that.data.write_id,
                value: tmpBuffer,
                success(res) {
                    console.log(tmpBuffer);
                    console.log('发送成功：', res)
                    var list = that.data.sendBlueDataList
                    list.push(JSON.stringify(res))
                    that.setData({
                        sendBlueDataList: list
                    })
                },
                fail: function (res) {
                    console.log('发送失败', res)
                }
            })
            // })
        }
    }
}


/**
 * 将字符串转换成 ASCII
 */
function toAsciiToArrayBuffer(str) {

    var buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer)
    let ind = 0;
    for (let index = 0; index < str.length; index++) {
        var strOne = str.charAt(index);
        var code = strOne.charCodeAt();
        dataView.setUint8(ind, code)
        ind++
    }
    return buffer
}

/**
 * 将字符串转换成ArrayBufer
 */
function hexStringToArrayBuffer(str) {
    if (!str) {
        return new ArrayBuffer(0);
    }
    var buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer)
    let ind = 0;
    for (var i = 0, len = str.length; i < len; i += 2) {
        let code = parseInt(str.substr(i, 2), 16)
        dataView.setUint8(ind, code)
        ind++
    }
    return buffer;
}

/**
 * 将ArrayBuffer转换成字符串
 */
function ab2hext(buffer) {
    var hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2)
        }
    )
    return hexArr.join('');
}

function closeBlueTooth(thisGlobal) {
    var deviceId = thisGlobal.data.deviceId
    console.log(deviceId);
    if (deviceId != '') {
        // 断开设备连接
        wx.closeBLEConnection({
            deviceId: deviceId,
            success: function (res) {
                console.log("断开蓝牙closeBLEConnection");
            },
            fail(res) {
                console.log("断开蓝牙closeBLEConnection");
            }
        })
        // 关闭蓝牙模块
        wx.closeBluetoothAdapter({
            success: function (res) {
                console.log("断开蓝牙closeBluetoothAdapter");
            },
            fail: function (err) {
                console.log("断开蓝牙closeBluetoothAdapter");
            }
        })
        console.log("关闭蓝牙==========================");
    }

}

module.exports = {
    initBlueTooth: initBlueTooth,
    sendBLECharacterNotice: sendBLECharacterNotice,
    closeBlueTooth: closeBlueTooth

}
