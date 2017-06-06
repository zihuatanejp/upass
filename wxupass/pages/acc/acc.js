// acc.js
var app = getApp();
Page({
  data: {
    ishide:true,
    isright:false,
    pwd:''
  },
  csd:{
    pwd:''
  },
  onLoad: function (options) {
    var self = this;
    app.getUserInfo(function (wxuid) {
      self.csd.wxuid = wxuid;
    });
  },
  onShow: function () {
    var self = this;
    if (app.gbd.con) {
      wx.switchTab({
        url: '../index/index'
      });
    }
    else {
      var concipher = wx.getStorageSync('concipher');
      var enctype = wx.getStorageSync('enctype');
      if(!concipher){
        var wxuid = '';
        app.getUserInfo(function(r){
          wxuid = r;
          self.csd.wxuid = r;
        });
        var tk = app.gentk();
        wx.request({
          url: 'https://ssl.buditem.com/upass/getinfo',
          method: 'POST',
          data: {
            wxuid: wxuid,
            tk: tk
          },
          success: function (res) {
            // console.log(res);
            if(res.data.code == '200'){
              var dfbk = res.data.res.dfbk;

              wx.setStorageSync('enctype', dfbk.bktype);
              wx.setStorageSync('concipher', dfbk.concipher);
              if (dfbk.bktype == 'asym') {
                wx.setStorageSync('pvkcipher', dfbk.bkpvkcipher);
                wx.setStorageSync('pbkstr', dfbk.bkpbk);
              }
              self.csd.concipher = dfbk.concipher;
              self.csd.enctype = dfbk.bktype;
              app.gbd.enctype = dfbk.bktype;
            }
            else{
              wx.redirectTo({
                url: '../init/init'
              });
            }
          }
        });        
      }
      else{  // 本地存在密文
        self.csd.concipher = concipher;
        self.csd.enctype = enctype;
        app.gbd.enctype = enctype;
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var obj = app.gbd.shareinfo;
    obj.path = './acc';
    return obj;
  },
  // 输入框失去焦点时
  vinput:function(e){
    var self = this;
    var pwd = e.detail.value;
    self.csd.pwd = pwd;
    self.setData({ ishide:false,pwd:pwd });
  },
  // 提交密码
  vpwd:function(){
    var self = this;
    setTimeout(function(){
      wx.showLoading({
        title: '请稍候,正在解密..',
      });
      var pwd = self.csd.pwd;
      var enctype = self.csd.enctype;
      var concipher = self.csd.concipher;
      var isright = false;
      if (!pwd) {
        wx.hideLoading();
        self.setData({ ishide: false, isright: false });        
        wx.showToast({ title: '请输入6位以上数字或字母!', duration: 2500, image: '../../res/img/warn.png' });
        return false;
      }
      if (enctype == 'asym') {
        // console.log(concipher);console.log(pwd);
        var pndata = app.decryptrsa(pwd, concipher);
        if (pndata) {
          app.gbd.con = pndata;
          app.gbd.enctype = enctype;
          isright = true;
        }
      }
      if(enctype == 'sym'){
        var hpwd = app.enchash(pwd);
        var plain = app.decaes(concipher,hpwd);
        if(plain){
          var conjs = JSON.parse(plain);
          app.gbd.con = conjs;
          app.gbd.enctype = enctype;
          app.gbd.pwd = pwd;
          isright = true;
        }        
      }
      if (!isright) {
        wx.hideLoading();
        self.setData({ ishide: false, isright: false, pwd: '' });
        wx.showToast({ title: '很明显,尼密码打错了,重试下!', duration: 2500, image: '../../res/img/warn.png' });
        return false;
      }
      self.setData({ ishide: false, isright: true });
      wx.hideLoading();
      wx.switchTab({
        url: '../index/index'
      });
    },200);
    
  },
  resetapp: function () {
    var self = this;
    var tk = '';
    var wxuid = '';
    app.getUserInfo(function (r) {
      wxuid = r;
    });
    wx.showModal({
      title: '重置本程序',
      content: '注意:本操作将清空您保存的所有数据信息,是否继续？',
      confirmText: "确认重置",
      cancelText: "取消",
      success: function (res) {
        // console.log(res);
        if (res.confirm) {
          //console.log('用户点击主操作');
          wx.removeStorageSync('concipher');
          wx.removeStorageSync('tip');
          app.gbd.con = '';
          app.gbd.enctype = '';
          app.gbd.pwd = '';
          tk = app.gentk();
          wx.request({
            url: 'https://ssl.buditem.com/upass/clearcon',
            method: 'POST',
            data: {
              wxuid: wxuid,
              tk: tk
            },
            success: function (res) {
              // console.log(res);              
            }
          });
          if (wx.reLaunch) {
            wx.reLaunch({
              url: '../acc/acc',
            });
          }
          else {
            wx.redirectTo({
              url: '../acc/acc',
            });
          }
        }
      }
    });
  }
})