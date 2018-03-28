const request = require('request.js')
const url = require('url.js')
const utils = require('utils.js')

// var lostConn = false
var tryCount = 10
var sending = false

const sendControlOld = function(action,content){
  if (sending) {
    console.log("sending")
    return
  }
  sending = true
  let params = {
    'action': action,
    'project': wx.getStorageSync('projectName'),
    'alias': wx.getStorageSync('deviceAlias'),
    'userID': wx.getStorageSync('userID'),
    'sendTime': (new Date()).getTime(),
    'packageName': 'com.clearcrane.vod',
    'data': content
  }
  console.log("SendControlOld")
  console.log(params)
  request.post(url.sendControlOld, params, success => {
    console.log(success)
    sending = false
    if (success.rescode == 200 || success.rescode == '200') {
      // lostConn = false
    } else {
      if (tryCount < 10) {
        tryCount++
        return
      } else {
        tryCount = 0
        wx.showModal({
          title: '提示',
          content: '您与电视失去联系，点击确认重新扫描电视上的二维码与电视重新连接',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.scanCode({
                onlyFromCamera: true,
                success: (res) => {
                  console.log(res)
                  if (res.path) {
                    console.log(res.path)
                    wx.navigateTo({
                      url: res.path
                    })
                  } else if (res.result.indexOf('openvod.cleartv.cn') != -1) {
                    console.log(res.result)
                    let params = {
                      "action": "getDeviceFromShortUrl",
                      "url": res.result
                    }
                    request.post(url.remoteUrl, params, success => {
                      console.log(success)
                      if (success.rescode == '200') {
                        if (success.alias.indexOf('$') > 0) {
                          wx.reLaunch({
                            url: '/pages/index/index?alias=' + success.alias + '&projectName=' + success.projectName,
                          })
                        } else {
                          wx.reLaunch({
                            url: '/pages/index/index?alias=' + success.alias,
                          })
                        }
                      }
                    })
                  } else {
                    console.log("未知二维码:" + res.result)
                    utils.showToast({
                      img: "http://openvod.cleartv.cn/remotecontrol/res/images/icon_error.png",
                      title: '未知二维码！'
                    })
                  }
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              // lostConn = true
            }
          }
        })
      }
    }
  }, fail => {
    console.log(fail)
    sending = false
    utils.showToast({
      img: "http://openvod.cleartv.cn/remotecontrol/res/images/icon_error.png",
      title: '网络错误！'
    })
  })
}

const sendControl = function (action, content) {
  if(wx.getStorageSync('isOld')){
    sendControlOld(action, content)
  }else{
    sendControlNew(action, content)
  }
}

const sendControlNew = function (action, content) {
  if (sending) {
    console.log("sending")
    return
  }
  sending = true
  let params = {
    'deviceIP': wx.getStorageSync('deviceIP'),
    'mac': wx.getStorageSync('mac'),
    'deviceAlias': wx.getStorageSync('deviceAlias'),
    'packageName': 'com.clearcrane.vod',
    'projectName': wx.getStorageSync('projectName'),
    'actionType': action,
    'actionContent': content,
    'userID': wx.getStorageSync('userID'),
    'newAction': true,
    'sendTime': (new Date()).getTime(),
    'remoteType': wx.getStorageSync('remoteType')
  }
  console.log("sendControlNew")
  console.log(params)
  request.post(url.sendControl, params, success => {
    console.log(success)
    sending = false
    if (success.rescode == 200) {
      // lostConn = false
    } else {
      if (tryCount < 10) {
        tryCount++
        return
      } else {
        tryCount = 0
        wx.showModal({
          title: '提示',
          content: '您与电视失去联系，点击确认扫描电视上的二维码连接电视',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.scanCode({
                onlyFromCamera: true,
                success: (res) => {
                  console.log(res)
                  if(res.path){
                    console.log(res.path)
                    wx.navigateTo({
                      url: res.path
                    })
                  }else if(res.result.indexOf('openvod.cleartv.cn') != -1){
                    console.log(res.result)
                    let params = {
                      "action":"getDeviceFromShortUrl",
                      "url": res.result
                    }
                    request.post(url.remoteUrl,params,success =>{
                      console.log(success)
                      if(success.rescode == '200'){
                        if(success.alias.indexOf('$') > 0){
                          wx.reLaunch({
                            url: '/pages/index/index?alias=' + success.alias + '&projectName=' + success.projectName,
                          })
                        }else{
                          wx.reLaunch({
                            url: '/pages/index/index?alias=' + success.alias,
                          })
                        }
                      }
                    })
                  }else{
                    console.log("未知二维码:" + res.result)
                    utils.showToast({
                      img: "http://openvod.cleartv.cn/remotecontrol/res/images/icon_error.png",
                      title: '未知二维码！'
                    })
                  }
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              // lostConn = true
            }
          }
        })
      }
    }
  }, fail => {
    console.log(fail)
    sending = false
    utils.showToast({
      img: "http://openvod.cleartv.cn/remotecontrol/res/images/icon_error.png",
      title: '网络错误！'
    })
  })
}

const sendKeyEvent = function(keycode){
  wx.vibrateShort();
  utils.playSwipe()
  let content = {
    "keyCode": keycode
  }
  sendControl("keyEvent",content)
}

const playMovie = function (movie) {
  wx.vibrateShort();
  utils.playSwipe()
  let content = {
    "movieID": movie.ID
  }
  sendControl("playMovie", content)
  wx.navigateTo({
    url: '/pages/main/mediadetail/mediadetail',
  })
}

const playLive = function (channel) {
  wx.vibrateShort();
  utils.playSwipe()
  let content = {
    "channelIndex": channel.channelIndex
  }
  sendControl("playLive", content)
  wx.navigateTo({
    url: '/pages/main/mediadetail/mediadetail',
  })
}

module.exports = {
  sendKeyEvent: sendKeyEvent,
  playMovie: playMovie,
  playLive: playLive,
  sendControl: sendControl
}