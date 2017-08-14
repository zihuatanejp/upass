// pages/ranchars/ran.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inphide:true, //生成位数的输入框是否显示
    respan:true, // 随机密码的结果面板是否显示
    res:''        //生成的结果
  },
  csd:{
    range:['09'],
    gnum:'6', // 生成的位数
    inputnum: '' // 生成位数的输入框的值
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
  //选择位数时
  senum:function(e){
    var self = this;
    var gnum = parseInt(e.detail.value);
    if(gnum == 100){
      self.csd.gnum = self.csd.inputnum;
      self.setData({inphide:false});
    }
    else{
      self.csd.gnum = gnum;
      self.setData({ inphide: true });
    }
  },
  // 输入框输入位数时
  inputnum:function(e){
    var self = this;
    self.csd.inputnum = e.detail.value;
    self.csd.gnum = e.detail.value;
  },
  // 选择范围时
  serange:function(e){
    var self = this;
    var arr =  e.detail.value;
    self.csd.range = arr;
  },
  //点击生成时
  vpwd:function(){
    var self = this;
    var num = parseInt( self.csd.gnum );
    if(!num){
      wx.showToast({ title: '请选择或输入合理的位数', duration: 2500, image: '../../res/img/warn.png' });
      return false;
    }
    var range = self.csd.range
    var ranges = '';
    if( range.length < 1 ){
      wx.showToast({ title: '请选择随机的范围', duration: 2500, image: '../../res/img/warn.png' });
      return false;
    }
    for(var x in range){
      ranges += (range[x]);
    }
    var res = app.genranchars(ranges,num);
    self.setData({ respan:false, res:res });
    wx.setClipboardData({
      data: res
    });
  }
})