const emitter = (action, data) => {
    wx.request({
        url: 'https://openvod.cleartv.cn/backend_wx/v1/remote_control',
        data: {
            "regID": "100d8559097c403c504",
            "packageName": "com.clearcrane.vod",
            "project": "demo",
            "action": action,
            "userID": 1,
            "data": data
        },
        method: "POST",
        header: {
            'content-type': 'application/json' // 默认值
        },
        success: function(res) {
            console.log(res.data)
        }
    });

}

module.exports = {
    emitter: emitter
}