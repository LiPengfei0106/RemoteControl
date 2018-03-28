const JMessage = require('../libs/jmessage-wxapplet-sdk-1.4.0.min.js')
const request = require('request.js')
const url = require('url.js')

const JIM = new JMessage({
  debug : true
});
var isInit = false
var isConn = false
var isLogin = false
var isJoinRoom = false

const init = function (userInfo,callback) {
  console.log('JIM init')
  console.log(userInfo)
  request.post(url.getAuth, { "action": "getJMessage" }, success => {
    console.log(success)
    JIM.init(success.data).onSuccess(function (data) {
      //TODO
      console.log('jim init onSuccess')
      console.log(data)
      isInit = true
      isConn = true
      JIM.login({
        'username': userInfo.unionId,
        'password': '123456'
      }).onSuccess(function (data) {
        console.log('jim login onSuccess')
        console.log(data)
        if (callback)
          callback()
      }).onFail(function (data) {
        console.log('jim login onFail')
        console.log(data)
        JIM.register({
          'username': userInfo.unionId,
          'nickname': userInfo.nickName,
          'gender': userInfo.gender,
          'password': '123456'
        }).onSuccess(function (data) {
          console.log('jim register onSuccess')
          console.log(data)
          JIM.login({
            'username': userInfo.unionId,
            'password': '123456'
          }).onSuccess(function (data) {
            console.log('jim login onSuccess')
            console.log(data)
            if (callback)
              callback()
          })
        }).onFail(function (data) {
          console.log('jim register onFail')
          console.log(data)
        });
      });
    }).onFail(function (data) {
      //TODO
      console.log('onFail')
      console.log(data)
    });
  })
}

const joinRoom = function (GroupID, ChatRoomID = 10006096){
  console.log('JIM joinRoom')
  JIM.isLogin();
  JIM.onMsgReceive(function (data) {
    console.log('jim onMsgReceive')
    console.log(data)
    for (let j = 0; j < data.messages.length; j++) {
      for (let i = 0; i < MsgListenerList.length; i++) {
        MsgListenerList[i](data.messages[j].content)
      }
    }
  });
  JIM.onRoomMsg(function (data) {
    console.log('jim onRoomMsg')
    console.log(data)
    for (let i = 0; i < MsgListenerList.length; i++) {
      MsgListenerList[i](data.content)
    }
  });
  JIM.onTransMsgRec(function (data) {
    console.log('jim onTransMsgRec')
    console.log(data)
    // data.type 会话类型
    // data.gid 群 id
    // data.from_appkey 用户所属 appkey
    // data.from_username 用户 username
    // data.cmd 透传信息
  });
  JIM.joinGroup({
    'gid': GroupID,
    'reason': 'test'
  }).onSuccess(function (data) {
    console.log('jim joinGroup onSuccess')
    console.log(data)
  }).onFail(function (data) {
    console.log('jim joinGroup onFail')
    console.log(data)
  });
  JIM.enterChatroom({
    'id': ChatRoomID
  }).onSuccess(function (data) {
    console.log('jim enterChatroom onSuccess')
    console.log(data)

  }).onFail(function (data) {
    console.log('jim enterChatroom onFail')
    console.log(data)
  });
  JIM.getSelfChatrooms().onSuccess(function (data) {
    console.log('jim getSelfChatrooms onSuccess')
    console.log(data)
    for (let i = 0; i < data.chat_rooms.length; i++) {
      if (ChatRoomID == data.chat_rooms[i].id)
        continue
      JIM.exitChatroom({
        'id': data.chat_rooms[i].id
      }).onSuccess(function (data) {
        console.log('jim exitChatroom onSuccess')
        console.log(data)
      }).onFail(function (data) {
      });
    }
  }).onFail(function (data) {
    console.log('jim getSelfChatrooms onFail')
    console.log(data)
  });
}

var MsgListenerList = []
const addMsgListener = function (MsgListener) {
  MsgListenerList.push(MsgListener)
}

const removeMsgListener = function (MsgListener) {
  var index = MsgListenerList.indexOf(MsgListener);
  if (index > -1) {
    MsgListenerList.splice(index, 1);
  }
}


module.exports = {
  isInit: isInit,
  isConn: isConn,
  isLogin: isLogin,
  isJoinRoom: isJoinRoom,
  init: init,
  joinRoom: joinRoom,
  addMsgListener: addMsgListener,
  removeMsgListener: removeMsgListener
};