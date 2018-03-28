// pages/main/movielist/movielist.js

const app = getApp()
const controller = require('../../../common/controller.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let index = options.index;
    let _this = this;
    this.setData({
      movieList: app.globalData.movieList[index]
    })
    wx.setNavigationBarTitle({
      title: _this.data.movieList.tag.CategoryName['zh-CN']//页面标题为路由参数
    })
  },

  playMovie(event) {
    // console.log(event)
    let movie = event.currentTarget.dataset.movie
    controller.playMovie(movie)
  }
})