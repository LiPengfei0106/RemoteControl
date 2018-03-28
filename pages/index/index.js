//index.js
//获取应用实例
const app = getApp()
const url = require('../../common/url.js')
const utils = require('../../common/utils.js')
const request = require('../../common/request.js')
const controller = require('../../common/controller.js')
const Base64 = require('../../libs/base64.js').Base64
const jim = require('../../common/jim.js')

Page({
  data: {
    state: 0,
    motto: '正在登录...',
    userInfo: {},
    hasUserInfo: false
  },
  onLoad: function (options) {
    console.log(options)
    
    // 初始化从二维码获取到的的数据
    this.initControlData(options)
    if (app.globalData.userInfo) {
      this.loadData(app.globalData.userInfo)
    } else {
      app.userInfoReadyCallback = userInfo => {
        console.log("userInfoReadyCallback")
        if(userInfo){
          this.loadData(userInfo)
        }else{
          this.setData({
            motto: '重新登录'
          })
        }
      }
    }
  },
  // 手动重新登录
  getUserInfo: function(e) {
    console.log("getUserInfo")
    console.log(e)
    app.userInfoReadyCallback = userInfo => {
      console.log("userInfoReadyCallback")
      if (userInfo) {
        this.loadData(userInfo)
      } else {
        this.setData({
          motto: '重新登录'
        })
      }
    }
    if(e.detail.errMsg == "getUserInfo:ok")
      app.logonClear(e.detail)
  },

  // 登录成功
  loadData(userInfo){
    console.log("loadData")
    console.log(userInfo)

    let _this = this
    this.setData({
      userInfo: userInfo,
      state: 1,
      motto: '登录成功',
      hasUserInfo: true
    })
    // 获取项目相关的遥控器信息
    let params = {
      'action': 'checkInfo',
      'projectID': wx.getStorageSync("projectName")
    }
    request.post(url.getResource, params,
      success => {
        console.log("checkInfo")
        console.log(success)
        app.globalData.remoteType = success.data.remoteType
        app.globalData.hasMovie = success.data.hasMovie
        app.globalData.hasLive = success.data.hasLive
        app.globalData.controlType = success.data.controlType
        
        // 加载电影列表和直播列表
        let count = 0
        let total = app.globalData.hasMovie + app.globalData.hasLive
        if(total<1){
          _this.gotoControl()
          return
        }
        let params = {
          'action':'getMovieTag',
          'projectID':wx.getStorageSync('projectName')
        }
        request.post(url.getResource, params,
          res => {
            console.log("getMovieTag")
            console.log(res)
            if(res.rescode == "200"){
              app.globalData.tagList = res.data
              _this.getMovieList(0)
              if (++count >= total) {
                _this.gotoControl()
              }
            }
          }
        )
        params = {
          'action': 'getLiveList',
          'projectID': wx.getStorageSync('projectName')
        }
        request.post(url.getResource, params,
          res => {
            console.log("getLiveList")
            console.log(res)
            if (res.rescode == "200") {
              app.globalData.liveList = res.data
              if (++count >= total) {
                _this.gotoControl()
              }
            }
          }
        )
      })
  },
  // 根据tagid递归获取电影列表，并过滤没有电影的tag
  getMovieList(index){
    let _this = this
    if (index >= app.globalData.tagList.length || index < 0)
      return
    if (index == 0){
      app.globalData.movieList = []
    }
    let params = {
      "action": "getMovieListByTag",
      "projectID": wx.getStorageSync('projectName'),
      "data": {
        "tagid": app.globalData.tagList[index].ID
      }
    }
    request.post(url.getResource, params,
      res => {
        console.log(res)
        if (res.rescode == "200") {
          if (res.data.length > 0) {
            app.globalData.movieList.push({
              "tag": app.globalData.tagList[index],
              "movieList": res.data
            })
          }
        }
        _this.getMovieList(++index)
      })
  },
  // 进入遥控器，并发送用户登录连接的消息
  gotoControl(){
    console.log("进入遥控器 ：gotoControl")
    request.post(url.getResource, { "action": "getDeviceInfo", "data": { "alias": wx.getStorageSync('deviceAlias')}}, success => {
      console.log("获取设备信息成功 ")
      console.log(success)
      if(parseInt(success.rescode) == 200){
        wx.setStorageSync('DeviceUid', success.data.DeviceUid);
        wx.setStorageSync('Platform', success.data.Platform);
        wx.setStorageSync('ProjectID', success.data.ProjectID);
        wx.setStorageSync('AppVersion', success.data.AppVersion);
        wx.setStorageSync('ControllerVersion', success.data.ControllerVersion);
        wx.setStorageSync('Alias', success.data.Alias);
        wx.setStorageSync('Mac', success.data.Mac);
        wx.setStorageSync('DeviceType', success.data.DeviceType);
        wx.setStorageSync('IP', success.data.IP);
        wx.setStorageSync('RegID', success.data.RegID);
        wx.setStorageSync('RoomID', success.data.RoomID);
        wx.setStorageSync('DeviceID', success.data.ID);
        jim.init(app.globalData.userInfo, function () { jim.joinRoom(success.data.ID)})
      }else{

      }
    })
    // jim.init(app.globalData.userInfo, function () { jim.joinRoom(10409886) })
    
    wx.reLaunch({
      url: '../control/PadControl/PadControl'
    })

    let content = {
      'nickName': app.globalData.userInfo.nickName,
      'headImgUrl': app.globalData.userInfo.avatarUrl,
      'sex': app.globalData.userInfo.gender,
      'province': app.globalData.userInfo.province,
      'country': app.globalData.userInfo.country,
      'city': app.globalData.userInfo.city,
      'language': app.globalData.userInfo.language
    }
    controller.sendControl("login", content)
    
  },
  initControlData(options){
    let deviceAlias = options.alias
    if(options.alias){
      deviceAlias = options.alias
      wx.setStorageSync('deviceAlias', deviceAlias);
      console.log('获取alias参数:' + deviceAlias)
    } else if (wx.getStorageSync('deviceAlias')){
      deviceAlias = wx.getStorageSync("deviceAlias")
      console.log('没有alias参数,getStorage:' + deviceAlias)
    } else {
      deviceAlias = 'dGVzdDswMDo2NjpDRjowRTpDQTo1NDsxOTIuMTY4LjE3LjIwNDo0MDEwNjtoaW1lZGlhXzRjb3JlOzE1MTYwMDQzMjQ'
      wx.setStorageSync('deviceAlias', deviceAlias);
      console.log('没有alias参数,设置默认的参数:' + deviceAlias)
    }
    let _this = this
    

    if (deviceAlias.indexOf('$') > 0) {
      console.log('Old参数')
      wx.setStorageSync('deviceAlias', deviceAlias);
      if (options.projectName){
        let projectName = options.projectName;
        wx.setStorageSync('projectName', projectName);
      } else {
        let projectName = deviceAlias.split('$')[0];
        wx.setStorageSync('projectName', projectName);
      }
      let mac = 'unknow';
      let deviceIP = 'unknow';
      let devicePlatform = 'unknow';
      wx.setStorageSync('mac', mac);
      wx.setStorageSync('devicePlatform', devicePlatform);
      wx.setStorageSync('deviceIP', deviceIP);
      wx.setStorageSync('isOld', true);
      return
    }
    let decodedData = Base64.decode(deviceAlias).split(';');
    if (decodedData.length > 3) {
      console.log('新的参数')
      console.log(decodedData);
      let projectName = decodedData[0];
      let mac = decodedData[1];
      let deviceIP = decodedData[2];
      let devicePlatform = decodedData[3];
      wx.setStorageSync('projectName', projectName);
      wx.setStorageSync('mac', mac);
      wx.setStorageSync('devicePlatform', devicePlatform);
      wx.setStorageSync('deviceIP', deviceIP);
      wx.setStorageSync('isOld', false);
      return
    }
    utils.showToast('参数错误')
  }
})
