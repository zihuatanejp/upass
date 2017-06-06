// msgd.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showreply:false,
    showtop:false,
    top:'',
    mid:[],
    replycon:''
  },
  csd:{
    replycon:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (obj) {
    var self = this;
    if( (obj) && (obj.dtype =='msg') ){
      self.setData({showreply:true});
    }
    var msgres = app.gbd.msgres;
    var top = {};
    var mid = [];
    var showtop = false;
    if( obj ){
      if(obj.dtype == 'msg'){ // 上面放意见反馈 下面是这条消息
        for(var i = 0;i<msgres.msgs.length;i++){
          if(obj.did == msgres.msgs[i].id){
            showtop =true;
            top = { con: msgres.msgs[i].refcon,ts:msgres.msgs[i].refts };
            mid.push({ con: msgres.msgs[i].con, ts: msgres.msgs[i].ts });
          }
        }        
      }
      if(obj.dtype == 'fbk'){
        for(var j = 0;j<msgres.feeds.length;j++){
          if(obj.did == msgres.feeds[j].id){
            showtop = true;
            top = {con: msgres.feeds[j].con};
            mid = msgres.feeds[j].refcon;
          }
        }
      }
      self.setData({top:top,mid:mid,showtop:showtop});
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var obj = app.gbd.shareinfo;
    return obj;
  },
  goreply:function(){
    var self = this;
    var con = self.csd.replycon;
    var wxuid = '';
    app.getUserInfo(function (r) {
      wxuid = r;
    });
    if( (!con) || (con.length<2) ){
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
        con: con,
        fid: fid,
        ts: ts
      },
      success: function (res) {
        if ((res.data) && (res.data.code == '200')) {
          wx.showToast({ title: '回复成功!' });
          self.setData({ replycon: '' });
          self.csd.replycon = '';
        }
        else {
          wx.showToast({ title: '回复失败!', duration: 3500, image: '../../res/img/warn.png' });
        }
      }
    }); 
  },
  typing: function (e) {
    var self = this;
    var con = e.detail.value;
    self.csd.replycon = con;
  },
})