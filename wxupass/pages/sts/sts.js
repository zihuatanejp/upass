// sts.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enctype:'',
  },
  csd:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    if (!app.gbd.con) {
      wx.redirectTo({
        url: '../acc/acc'
      });
    }
    var enctype = wx.getStorageSync('enctype');
    if(enctype == 'sym'){
      self.setData({ enctype: '对称', encway:'sha2+AES' });
    }
    if(enctype == 'asym'){
      self.setData({ enctype: '非对称', encway: 'RSA+AES'});
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  onShareAppMessage: function () {
    var obj = app.gbd.shareinfo;
    return obj;
  },
  donate:function(){
    wx.previewImage({ 
      urls: ['http://default.buditem.com/img/donate.jpg'], 
      complete:function(e){
        console.log(e);
      } 
    });
  }
})