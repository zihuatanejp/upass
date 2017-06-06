// mymsg.js
var app = getApp();
var sliderWidth = 110; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["我的消息", "我发出的"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  csd:{},
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onShow: function () {
    var self = this;
    var msgres = app.gbd.msgres;
    if(msgres){
      self.setData({msgs:msgres.msgs,feeds:msgres.feeds});
    }
  },
  onHide: function () {
  
  },
  onUnload: function () {
    var self = this;
    var wxuid = '';
    app.getUserInfo(function (r) {
      wxuid = r;
    });
    var msgres = app.gbd.msgres;
    var msgs = msgres.msgs;
    for(var i = 0; i<msgs.length;i++){
      if(!msgs[i].isread){
        msgs[i].isread = true;
      }
    }
    if(msgres.msgcnt>0){
      msgres.msgcnt = 0;
      //发送请求 同步远端消息的状态
      wx.request({
        url: 'https://ssl.buditem.com/upass/changemsgs',
        method: 'POST',
        data: {
          wxuid: wxuid
        },
        success: function (res) {
          console.log(res);
        }
      }); 
    }
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
    var obj = app.gbd.shareinfo;
    return obj;
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
})