// descr.js
var app = getApp();
Page({
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (obj) {
    var self = this;
    var page = obj.page;
    switch (page) {
      case 'p1':
        wx.setNavigationBarTitle({title:'查看密文'});
        var concipher = wx.getStorageSync('concipher');
        self.setData({view:'p1',text:concipher});
        break;
      case 'p2':
        wx.setNavigationBarTitle({ title: '了解非对称加密算法' });
        self.setData({ view: 'p2', text: '非对称' });
        break;
      case 'p3':
        wx.setNavigationBarTitle({ title: '了解对称加密算法' });
        self.setData({ view: 'p3', text: '对称' });
        break;
      default:
        break;
    }
  },
  onShareAppMessage: function () {
    var obj = app.gbd.shareinfo;
    return obj;
  }
})