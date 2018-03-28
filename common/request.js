const utils = require('utils.js')

const post = function(url,params,successCallback,failCallback) {
  wx.request({
    url: url,
    method: "POST",
    data: params,
    success: function (res) {
      if (successCallback)
        successCallback(res.data)
    },
    fail: function (res) {
      console.log('------网络请求失败------')
      console.log(url)
      console.log(params)
      console.log(res)
      console.log('------------------')
      if(failCallback)
        failCallback(res)
      else{
        utils.showToast({
          img: "http://openvod.cleartv.cn/remotecontrol/res/images/icon_error.png",
          title: '网络错误！'
        })
        // wx.showToast({
        //   title: '网络错误！',
        //   icon: 'error',
        //   duration: 1500
        // })
      }
    }
  })
}



module.exports = {
  post: post,
}
