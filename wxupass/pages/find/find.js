// find.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgcnt:0
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
    app.getUserInfo(function (wxuid) {
      self.csd.wxuid = wxuid;
    });
    var wxuid = self.csd.wxuid;

    var ts = Math.round(new Date().getTime() / 1000);
    var tk = app.gentk();
    var mymsg = app.gbd.mymsg;
    var msgres = {};
    if( (mymsg) && ( (ts-2)< mymsg.lastreq) &&(app.gbd.msgres) ){
      msgres = app.gbd.msgres;
      self.setData({ msgcnt: msgres.msgcnt });
    }
    else{
      wx.request({
        url: 'https://ssl.buditem.com/upass/getmsg',
        method: 'POST',
        data: {
          wxuid: wxuid,
          tk:tk
        },
        success: function (res) {
          // console.log(res);
          if( (res.data) && (res.data.code=='200') ){
            var r = res.data.res;
            var ts2 = Math.round(new Date().getTime() / 1000);
            var feedback = r.feedback || [];
            var msg = r.msg || [];
            mymsg = app.gbd.mymsg = { lastreq:ts2, feedback:feedback, msg:msg };
            var msgres = self.handmsg(mymsg);
            app.gbd.msgres = msgres;
            self.setData({msgcnt:msgres.msgcnt});
          }
        }
      }); 
    }
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  resetapp:function(){
    var self = this;
    var tk = '';
    var wxuid = self.csd.wxuid;
    wx.showModal({
      title: '重置本程序',
      content: '注意:本操作将清空您保存的所有数据信息,是否继续？',
      confirmText: "确认重置",
      cancelText: "取消",
      success: function (res) {
        // console.log(res);
        if (res.confirm) {
          console.log('用户点击主操作');
          wx.removeStorageSync('concipher');
          wx.removeStorageSync('tip');
          app.gbd.con ='';
          app.gbd.enctype='';
          app.gbd.pwd='';
          tk = app.gentk();
          wx.request({
            url: 'https://ssl.buditem.com/upass/clearcon',
            method: 'POST',
            data: {
              wxuid: wxuid,
              tk:tk
            },
            success: function (res) {
              // console.log(res);              
            }
          });
          wx.redirectTo({
            url: '../acc/acc',
          });
        }
      }
    });
  },
  handmsg:function(msg){
    var self = this;
    var msgcnt = 0;
    var msgs = app.deepcp( msg.msg );
    var msglen = msg.msg.length;
    
    var feeds = app.deepcp( msg.feedback );
    var feedlen = feeds.length;
    var res = { msgcnt:0, msgs:[], feeds:[] };  
    
    for(var i = 0;i<msglen;i++){
      if(!msgs[i].isread){
        msgcnt++; 
      }
      var its = { id:msgs[i].mid,con:msgs[i].con, ts:msgs[i].ts, isread:msgs[i].isread };

      if(msgs[i].relfid){
        for(var j=0;j<feedlen;j++){
          if(feeds[j].fid == msgs[i].relfid){
            its.refcon = feeds[j].con;
            its.refts = feeds[j].ts;
          }
        }
      }
      res.msgs.unshift(its);
    }

    for(var k = 0; k<feedlen;k++){
      var itd = { id:feeds[k].fid,con:feeds[k].con, ts:feeds[k].ts, refcon:[] };
      
      for(var m = 0;m<msglen;m++){
        if ( msgs[m].relfid == feeds[k].fid ){
          itd.refcon.push({ id:msgs[m].mid, con:msgs[m].con, ts:msgs[m].ts });
        }
      }
      res.feeds.unshift(itd);
    } 
    res.msgcnt = msgcnt;
    return res;
  }
})