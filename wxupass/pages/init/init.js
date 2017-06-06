// init.js
var app = getApp();
Page({
  data: {
  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var obj = app.gbd.shareinfo;
    return obj;
  }
})