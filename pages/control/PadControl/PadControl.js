const app = getApp()
const request = require('../../../common/request.js')
const controller = require('../../../common/controller.js')

let touchOrigin = {
  x: 0,
  y: 0,
  lock: 0
}

let touchConfig = {
  moveAccuracy: 60
}
Page({
  data: {
    touchPadIsTouched: false,
    touchPadIsTaped: false,
    touchBackIsTaped: false,
    hasMovie: 0,
    hasLive:0
  },
  onLoad(){
    this.setData({
      hasMovie: app.globalData.hasMovie,
      hasLive: app.globalData.hasLive
    })
  },
  touchPadTap: function (e) {
    // console.log('tap');
    let _this = this;
    this.setData({
      touchPadIsTaped: true
    }, function () {
      _this.setData({
        touchPadIsTaped: false
      });
    });
    controller.sendKeyEvent(23)
  },
  touchPadMove: function (e) {
    // this.setData({
    //     touchPad: {
    //         location: {
    //             x: e.touches[0].clientX,
    //             y: e.touches[0].clientY
    //         }
    //     }
    // });
    this.moveEventTranslate(e.touches[0].clientX, e.touches[0].clientY)
  },
  touchPadMoveEnd: function (e) {
    touchOrigin.lock = 0;
  },
  moveEventTranslate: function (x, y) {
    if (touchOrigin.lock == 0) {
      touchOrigin.x = x;
      touchOrigin.y = y;
      touchOrigin.lock = 1;
    } else {
      let rangeX = x - touchOrigin.x;
      let rangeY = -(y - touchOrigin.y);
      let range = Math.sqrt(Math.pow(rangeX, 2) + Math.pow(rangeY, 2));
      if (range >= touchConfig.moveAccuracy) {
        touchOrigin.lock = 0;
        let direction = {
          name: null,
          keyCode: null
        };
        switch (true) {
          case rangeY >= -rangeX && rangeY >= rangeX:
            direction.name = 'up';
            direction.keyCode = 19;
            break;
          case rangeY >= -rangeX && rangeY <= rangeX:
            direction.name = 'left';
            direction.keyCode = 22;
            break;
          case rangeY <= -rangeX && rangeY <= rangeX:
            direction.name = 'down';
            direction.keyCode = 20;
            break;
          case rangeY <= -rangeX && rangeY >= rangeX:
            direction.name = 'right';
            direction.keyCode = 21;
            break;
          default:
        }
        // console.log(direction.name);
        controller.sendKeyEvent(direction.keyCode)
      }
    }
  },
  touchPadSwipeStart: function (e) {
    touchOrigin.x = e.touches[0].clientX;
    touchOrigin.y = e.touches[0].clientY;
    this.setData({
      touchPadIsTouched: true
    });
  },
  touchPadSwipeEnd: function (e) {
    this.setData({
      touchPadIsTouched: false
    });
    // console.log(e)
    let rangeX = e.changedTouches[0].clientX - touchOrigin.x;
    let rangeY = -(e.changedTouches[0].clientY - touchOrigin.y);
    let range = Math.sqrt(Math.pow(rangeX, 2) + Math.pow(rangeY, 2));
    if (range >= touchConfig.moveAccuracy) {
      touchOrigin.lock = 0;
      let direction = {
        name: null,
        keyCode: null
      };
      switch (true) {
        case rangeY >= -rangeX && rangeY >= rangeX:
          direction.name = 'up';
          direction.keyCode = 19;
          break;
        case rangeY >= -rangeX && rangeY <= rangeX:
          direction.name = 'left';
          direction.keyCode = 22;
          break;
        case rangeY <= -rangeX && rangeY <= rangeX:
          direction.name = 'down';
          direction.keyCode = 20;
          break;
        case rangeY <= -rangeX && rangeY >= rangeX:
          direction.name = 'right';
          direction.keyCode = 21;
          break;
        default:
      }
      // console.log(direction.name);
      controller.sendKeyEvent(direction.keyCode)

    }
  },

  touchBackStart: function (e) {
    this.setData({ touchBackIsTaped: true });
  },

  touchBackEnd: function (e) {
    this.setData({ touchBackIsTaped: false });
  },

  touchBackTap: function (e) {
    // console.log('back')
    controller.sendKeyEvent(4)
  },
  touchBackLongPress: function (e) {
    // console.log('menu')
    controller.sendKeyEvent(82)
  },
  sendkeyEvent(e){
    console.log(e)
    controller.sendKeyEvent(e.currentTarget.dataset.keycode)
  }
})