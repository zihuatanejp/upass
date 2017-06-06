// bindtel.js
var app = getApp();
Page({
  data: {
    tel:''
  },
  csd:{
    tel:''
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onShow: function () {
    var self = this;
    var wxuid = '';
    app.getUserInfo(function (r) {
      wxuid = r;
    });
    self.csd.wxuid = wxuid;
    wx.request({
      url: 'https://ssl.buditem.com/upass/getphone',
      method: 'POST',
      data: {
        wxuid: wxuid
      },
      success: function (res) {
        if(res.data){
          if(res.data.code == '200'){
            var r = res.data.res;
            if(r.tel){
              self.setData({tel:r.tel});
            }
          }
        }
      }
    });
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onShareAppMessage: function () {
    var obj = app.gbd.shareinfo;
    return obj;
  },
  gobindtel:function(){
    var self = this;
    var tel = self.csd.tel;
    var wxuid = self.csd.wxuid;
    var re = /^1\d{10}$/;
    if (!(re.test(tel))) {
      wx.showToast({ title: '请输入正确的手机号码!', duration: 3500, image: '../../res/img/warn.png' });
      return false;
    }
    wx.request({
      url: 'https://ssl.buditem.com/upass/setphone',
      method: 'POST',
      data: {
        wxuid: wxuid,
        tel: tel
      },
      success: function (res) {
        // console.log(res);
        if(res.data && (res.data.code =='200') ){
          self.setData({tel:tel});
          wx.showToast({
            title: '绑定成功!',
          });
          setTimeout(function(){ wx.switchTab({ url: './find' }); },2500);
        }
        else{
          wx.showToast({ title: '绑定失败!', duration: 3500, image: '../../res/img/warn.png' });
        }
      }
    });
  },
  typing:function(e){
    var self = this;
    var tel = e.detail.value;
    self.csd.tel = tel;
  }
})