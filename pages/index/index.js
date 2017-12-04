const emitter = require('../../common/index.js').emitter;

//获取应用实例
const app = getApp()


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
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        touchPadIsTouched: false,
        touchPadIsTaped: false,
        touchBackIsTaped: false,

    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function (options) {
        var scene = decodeURIComponent(options.scene)
        console.log(scene)
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    touchPadTap: function(e) {
        console.log('tap');
        let _this = this;
        this.setData({
            touchPadIsTaped: true
        }, function() {
            _this.setData({
                touchPadIsTaped: false
            });
        });
        // this.emitter(23);
        emitter('keyEvent',{'keyCode': 23});
    },

    touchPadMove: function(e) {
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
    touchPadMoveEnd: function(e) {
        touchOrigin.lock = 0;
    },
    moveEventTranslate: function(x, y) {
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
                console.log(direction.name);
                // this.emitter(direction.keyCode);
                emitter('keyEvent',{'keyCode': direction.keyCode});
            }
        }
    },
    touchPadSwipeStart: function(e) {
        touchOrigin.x = e.touches[0].clientX;
        touchOrigin.y = e.touches[0].clientY;
        this.setData({
            touchPadIsTouched: true
        });
    },
    touchPadSwipeEnd: function(e) {
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
            console.log(direction.name);
            wx.vibrateShort();
            wx.playVoice({
                filePath: '../../static/59b770b830d4a.mp3',
                complete: function(res) {
                    console.log(res)
                }
            });
            // this.emitter(direction.keyCode);
            emitter('keyEvent',{'keyCode': direction.keyCode});

        }
    },

    touchBackStart: function(e) {
        this.setData({ touchBackIsTaped: true });
    },

    touchBackEnd: function(e) {
        this.setData({ touchBackIsTaped: false });
    },

    touchBackTap: function(e) {
        console.log('back')
        // this.emitter(4);
        emitter('keyEvent',{'keyCode': 4});
    },
    touchBackLongPress: function(e) {
        console.log('menu')
        // this.emitter(82);
        emitter('keyEvent',{'keyCode': 82});

    },

    emitter: function(keyCode) {
      emitter('keyEvent',{'keyCode': keyCode});

    //     wx.request({
    //         url: 'https://openvod.cleartv.cn/backend_wx/v1/remote_control',
    //         data: {
    //             "regID": "100d8559097c403c504",
    //             "packageName": "com.clearcrane.vod",
    //             "project": "demo",
    //             "action": "keyEvent",
    //             "userID": 1,
    //             "data": {
    //                 "keyCode": keyCode
    //             }
    //         },
    //         method: "POST",
    //         header: {
    //             'content-type': 'application/json' // 默认值
    //         },
    //         success: function(res) {
    //             console.log(res.data)
    //         }
    //     })
    }



})