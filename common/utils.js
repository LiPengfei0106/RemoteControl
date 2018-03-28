const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var mApp
var swipeAudio
var innerAudioContext
// var weToast
const init = obj => {
  mApp = obj
  // weToast = new mApp.WeToast()
  swipeAudio = wx.createInnerAudioContext()
  swipeAudio.src = 'http://openvod.cleartv.cn/remotecontrol/res/swipe.mp3'
  swipeAudio.onPlay(() => {
    console.log('开始播放')
  })
  swipeAudio.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })
}

const showToast = obj => {
  if (mApp) {
    try {
      new mApp.WeToast().toast(obj)
    } catch (err) {
      console(err)
    }
  }
}

const playSwipe = function(){
  if (swipeAudio){
    console.log('playSwipe')
    swipeAudio.play()
  }
}

const playAudio = src => {
  console.log('playAudio' + src)
  innerAudioContext.src = src
  innerAudioContext.onPlay(() => {
    console.log('开始播放')
  })
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })
  innerAudioContext.play()
}

// var searchTime = 0
const search = content => {
  if (mApp) {
    // console.log(searchTime)
    // if (new Date().getTime() - searchTime < 3000){
    //   console.log("not search")
    //   return
    // }
    // searchTime = new Date().getTime()
    console.log(content)
    if(!content){
      return []
    }
    // console.log(mApp.globalData.movieList)
    // console.log(mApp.globalData.liveList)
    content = content.toLowerCase()
    let results = []
    let movieList = mApp.globalData.movieList
    let len = movieList.length
    for (let j = 0; j < len; j++) {
      let movies = movieList[j].movieList
      let size = movies.length
      for(let i = 0;i<size;i++){
        if (movies[i].Name['en-US'].toLowerCase().indexOf(content) != -1
          || movies[i].Name['zh-CN'].indexOf(content) != -1
          || movies[i].SearchName.toLowerCase().indexOf(content) != -1
          || movies[i].Actor['en-US'].toLowerCase().indexOf(content) != -1
          || movies[i].Actor['zh-CN'].indexOf(content) != -1
          || movies[i].Director['en-US'].indexOf(content) != -1
          || movies[i].Director['zh-CN'].toLowerCase().indexOf(content) != -1
          ){
            var result = {"type":"movie","movie":movies[i]}
            if(results.indexOf(result) == -1){
              results.push(result)
            }
          }
      }
    }
    let liveList = mApp.globalData.liveList
    len = liveList.length
    for (let i = 0; i < len; i++) {
      if (liveList[i].ChannelName['en-US'].toLowerCase().indexOf(content) != -1
        || liveList[i].ChannelName['zh-CN'].toLowerCase().indexOf(content) != -1
      ) {
        var result = { "type": "live", "channel": liveList[i] }
        result.channel.index = i
        if (results.indexOf(result) == -1) {
          results.push(result)
        }
      }
    }
    // console.log(results)
    return results
    // mApp.globalData
  }
} 

module.exports = {
  formatTime: formatTime,
  init: init,
  showToast: showToast,
  playAudio: playAudio,
  playSwipe: playSwipe,
  search: search
}
