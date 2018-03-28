// pages/main/main.js
const app = getApp()
const controller = require('../../common/controller.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMovie: app.globalData.hasMovie,
    hasLive: app.globalData.hasLive,
    tabs: [''],
    slideOffset: 0,//指示器每次移动的距离
    activeIndex: 0,//当前展示的Tab项索引
    sliderWidth: 0,//指示器的宽度,计算得到
    contentHeight: 0//页面除去头部Tabbar后，内容区的总高度，计算得到
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    try {
      let tabs = []
      // let tabs2 = [
      //   { 
      //     'tag': { 
      //     'tagCode': 'Live',
      //     'tagName': {
      //        'zh-CN': '直播',
      //         'en-US': 'Live'
      //        }
      //      },
      //    'contentList': app.globalData.liveList
      //    },
      //   {
      //     'tag': {
      //       'tagCode': 'Movie',
      //       'tagName': {
      //         'zh-CN': '电影',
      //         'en-US': 'Movie'
      //       }
      //     },
      //     'contentList': app.globalData.movieList
      //   }
      // ]
      let itemHeight = 500
      if (app.globalData.hasMovie == 1) {
        tabs.push({
          'tag': {
            'tagCode': 'Movie',
            'tagName': {
              'zh-CN': '电影',
              'en-US': 'Movie'
            }
          },
          'contentList': app.globalData.movieList
        })
      }else{
        itemHeight = 90
      }
      if (app.globalData.hasLive == 1) {
        tabs.push({
          'tag': {
            'tagCode': 'Live',
            'tagName': {
              'zh-CN': '直播',
              'en-US': 'Live'
            }
          },
          'contentList': app.globalData.liveList
        })
      }
      

      this.setData({
        tabs: tabs,
        hasMovie: app.globalData.hasMovie,
        hasLive: app.globalData.hasLive,
        contentHeight: tabs[0].contentList.length * itemHeight + 10
      })
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            sliderWidth: (res.windowWidth - 48) / that.data.tabs.length,
            sliderOffset: (res.windowWidth - 48) / that.data.tabs.length * that.data.activeIndex
          });
        }
      });
    } catch (e) {
    }
  },

  bindChange: function (e) {
    console.log(e);
    var current = e.detail.current;
    let count = this.data.tabs[current].contentList.length
    let height = 90
    if (this.data.tabs[current].tag.tagCode == 'Live'){
      height = 90
    } else if (this.data.tabs[current].tag.tagCode == 'Movie'){
      height = 500
    }
    
    this.setData({
      activeIndex: current,
      sliderOffset: this.data.sliderWidth * current,
      contentHeight: count * height + 10
    });
    
  },

  tabClick: function (e) {
    console.log(e);
    var current = parseInt(e.currentTarget.id);
    let count = this.data.tabs[current].contentList.length
    let height = 90
    if (this.data.tabs[current].tag.tagCode == 'Live') {
      height = 90
    } else if (this.data.tabs[current].tag.tagCode == 'Movie') {
      height = 500
    }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      contentHeight: count * height + 10
    });
  },

  playMovie(event){
    console.log(event)
    let movie = event.currentTarget.dataset.movie
    controller.playMovie(movie)
  },
  
  playLive(event){
    console.log(event)
    let channel = event.currentTarget.dataset.channel
    let channelIndex = event.currentTarget.dataset.channelindex
    channel.channelIndex = channelIndex
    controller.playLive(channel)
  }
})