const _baseUrl = 'https://openvod.cleartv.cn';
// const _baseUrl = 'http://openvoddev.cleartv.cn';
module.exports = {
  login : _baseUrl + '/rc/logon',
  remoteUrl: _baseUrl + '/rc/getremoteurl',
  sendControlOld: _baseUrl + '/backend_wx/v1/remote_control',
  getAuth: _baseUrl + '/rc/weixinauth',
  getResource : _baseUrl + '/rc/controllerdata',
  sendControl : _baseUrl + '/rc/controlleraction'
};