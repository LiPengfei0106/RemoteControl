// pages/main/search/search.js
const utils = require('../../../common/utils.js')
const controller = require('../../../common/controller.js')
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    results:[]
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
      results: utils.search(e.detail.value)
    });
  },

  playMovie(event) {
    // console.log(event)
    let movieID = event.currentTarget.dataset.movieid
    controller.playMovie(movieID)
  },

  playLive(event) {
    // console.log(event)
    let channelIndex = event.currentTarget.dataset.channelindex
    controller.playLive(channelIndex)
  }
})