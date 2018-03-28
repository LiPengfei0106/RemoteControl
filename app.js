//app.js
const url = require('common/url.js')
const utils = require('common/utils.js')
const request = require('common/request.js')
const jim = require('common/jim.js')
let { WeToast } = require('widget/wetoast/wetoast.js')

App({
  WeToast,
  onLaunch: function () {
    let app = this
    utils.init(this)
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 设置消息监听
    jim.addMsgListener(function(content) {
      console.log('收到消息')
      console.log(content)
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        let params = {
          "Type": "MiniProgram",
          "action": "logon",
          "CODE": res.code
        }
        request.post(url.login, params,
          res => {
            console.log("clearlogin")
            console.log(res)
            wx.setStorageSync("userID", res.userID)
            app.getUserInfo()
          })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        // }
      }
    })
  },
  getUserInfo(){
    let app = this
    wx.getUserInfo({
      success: res => {
        console.log("getUserInfo success")
        console.log(res)
        app.logonClear(res)
      },
      fail: function (res) {
        console.log(res)
        if (app.userInfoReadyCallback) {
          app.userInfoReadyCallback()
        }
      }
    })
  },
  logonClear(res){
    let app = this
    let params = {
      "Type": "MiniProgram",
      "action": "updateInfo",
      "encryptedData": res.encryptedData,
      "userID": wx.getStorageSync("userID"),
      "iv": res.iv
    }
    request.post(url.login, params,
      res => {
        console.log("clearupdateInfo")
        console.log(res)
        let userInfo = res.userInfo
        userInfo.userID = wx.getStorageSync("userID")
        app.globalData.userInfo = userInfo
        if (app.userInfoReadyCallback) {
          app.userInfoReadyCallback(userInfo)
        }
      },
      fail => {
        console.log(fail)
        if (app.userInfoReadyCallback) {
          app.userInfoReadyCallback()
        }
      })
  },
  globalData: {
    mediaInfo: null,
    userInfo: null,
    movieInfo: null,
    movieList: null,
    tagList: null,
    liveList: null,
    hasMovie: 0,
    hasLive: 0,
    remoteType: 'MiniProgram',
    controlType: 'ButtonType'
  }
})