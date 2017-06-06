// fbk.js
var app = getApp();
Page({
  data: {
    con:''
  },
  csd:{
    con:''
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onShareAppMessage: function () {
    var obj = app.gbd.shareinfo;
    return obj;
  },
  typing: function (e) {
    var self = this;
    var con = e.detail.value;
    self.csd.con = con;
  },
  gosub:function(){
    var self = this;
    var con = self.csd.con; 
    var wxuid = '';
    app.getUserInfo(function (r) {
      wxuid = r;
    });
    if ((!con) || (con.length < 2)) {
      wx.showToast({ title: '请输入正常的回复内容！', duration: 3500, image: '../../res/img/warn.png' });
      return false;
    }
    var ts = Math.round(new Date().getTime() / 1000);
    var fid = app.genid();
    wx.request({
      url: 'https://ssl.buditem.com/upass/sendfbk',
      method: 'POST',
      data: {
        wxuid: wxuid,
        con:con,
        fid:fid,
        ts:ts
      },
      success: function (res) {
        //console.log(res);
        if ((res.data) && (res.data.code == '200') ) {
          wx.showToast({title: '提交成功!'});
          self.setData({con:''});
          self.csd.con = '';
          setTimeout(function () { wx.switchTab({ url: './find' }); }, 2500);
        }
        else{
          wx.showToast({ title: '提交失败!', duration: 3500, image: '../../res/img/warn.png' });
        }
      }
    }); 
  }
})