// do.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

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
    wx.request({
      url: 'https://ssl.buditem.com/upass/tmoney',
      method: 'POST',
      success: function (res) {
        console.log(res);
        if ((res.data) && (res.data.code == '200')) {
          var r = res.data.res;
          self.setData({list:r});
        }
      }
    }); 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  donate: function () {
    wx.previewImage({
      urls: ['http://default.buditem.com/img/donate3.jpg'],
      complete: function (e) {
        console.log(e);
      }
    });
  }
})