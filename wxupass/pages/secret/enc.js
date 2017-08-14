// enc.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inphide:true, //指定暗号的输入框
    reshide:true, // 生成好的秘密结果是否隐藏 
    day:'', //暗号的日期
  },
  csd:{
    text:'', //秘密明文
    gnum:'4', //暗号位数
    inptext:'',// 指定的暗号
    ts:'',//暗号的有效日期时间戳
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
    //初始化暗号日期
    var nt = app.gbd.nt;
    var ts = nt.timeminus(nt.getnowts().strts, nt.rolltoms({ dd: '1' })); 
    var day = nt.strtstotext(ts, { hh: false, mi: false, ss: false, ms: false});
    self.setData({day:day});
    self.csd.ts = ts;
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  typing:function(e){
    var self = this;
    self.csd.text = e.detail.value;
  },
  senum: function (e) {
    var self = this;
    var gnum = parseInt(e.detail.value);
    self.csd.gnum = gnum;
    if (gnum == 100) {
      self.setData({ inphide: false });
    }
    else {      
      self.setData({ inphide: true });
    }
  },
  // 输入框输入暗号位数时
  inputnum: function (e) {
    var self = this;
    self.csd.inptext = e.detail.value;
  },
  //处理准备秘密
  gense:function(){
    var self = this;
    var text = self.csd.text;  // 明文    
    if(!text){
      wx.showToast({ title: '请输入内容！', duration: 2500, image: '../../res/img/warn.png' });
      return false;
    }
    var textarr = [text];
    text = JSON.stringify(textarr);
    var sestr = '';//暗号
    var ts = self.csd.ts; // 13位时间戳
    if (parseInt( self.csd.gnum ) ==4){
      sestr = app.genranchars('09',4);
    }
    if (parseInt(self.csd.gnum) == 8) {
      sestr = app.genranchars('09az', 8);
    }
    if (parseInt(self.csd.gnum) == 100) {
      sestr = self.csd.inptext;
    }
    var hpwd = app.enchash(sestr+ts); //console.log(hpwd);
    var cipher = app.encaes(text,hpwd);// console.log(cipher);
    cipher = cipher+ts;
    wx.setClipboardData({
      data: cipher
    });
    wx.showToast({ title: '已将准备好的秘密复制到剪贴板，可直接去粘贴使用', duration: 2500, });
    self.setData({ reshide: false, res:sestr });
    console.log(cipher);console.log(hpwd);
  },
  daych:function(e){
    var self = this;
    var day = e.detail.value;
    var ts = app.gbd.nt.convts(day).strts;
    self.setData({ day: day });
    self.csd.ts = ts;
  }
})