const _baseUrl = 'https://openvod.cleartv.cn';
// const _baseUrl = 'http://openvoddev.cleartv.cn';
module.exports = {
  getWXUserInfoUrl () {
    return _baseUrl + '/backend_wx/v1/buildsession';
  },
  getWXUserSubsCheckUrl () {
    return _baseUrl + '/backend_wx/v1/wxusersubscheck';
  },
  getWXSubscribeUrl () {
    return _baseUrl + '/backend_wx/v1/subscribeurl';
  },
  getWXJSSDKSignUrl () {
    return _baseUrl + '/backend_wx/v1/jssdksign';
  },
  getBindTVDeviceIDUrl () {
    return _baseUrl + '/backend_wx/v1/bindtvdevice';
  },
  getGetTVDeviceIDUrl () {
    return _baseUrl + '/backend_wx/v1/gettvdeviceid';
  },
  getMainContentUrl () {
    return _baseUrl + '/backend_mgt/v1/cacheproxymovie';
  },
  getRemoteContorlUrl () {
    return _baseUrl + '/backend_wx/v1/remote_control';
  }
};