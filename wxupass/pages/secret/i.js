// i.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cipher:'' //秘密
  },
  csd:{
    cipher: '', //秘密
    sec:'',  // 解析的密文
    ts:'',   // 解析的时间戳
    answer:'', //得到的明文
    hao:''      //输入的暗号
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
    self.setData({ answer: '' });
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
  //粘贴的密文失去焦点时
  putcipher:function(e){
    var self = this;//console.log('blur');
    self.csd.cipher = e.detail.value;
  },
  puthao:function(e){
    var self = this;
    self.csd.hao = e.detail.value; 
  },
  //解密
  decans:function(){
    var self = this;
    setTimeout(function(){ 
      var cipher = self.csd.cipher;//console.log('here');console.log(cipher);
      if(!cipher){
        wx.showToast({ title: '请输入内容！', duration: 2500, image: '../../res/img/warn.png' });
        return false;
      }
      // 解析秘密
      var ts = '';
      var sec = '';
      var cilen = cipher.length-1;
      var cnt = 0;
      for(var i=(cilen);i>=0;i--){
        ++cnt;
        if(cnt<14){
          ts = ( cipher.charAt(i) + ts );
        }
        if(cnt>13){
          sec = (cipher.charAt(i) + sec );
        }
      }
      // 判断是否已到解密时间
      var nt = app.gbd.nt;
      var isok = nt.util.bnabscomp( nt.getnowts().strts,ts );
      if(isok!='yes'){
        wx.showToast({ title: '还没到解密时间,请耐心等待', duration: 2500, image: '../../res/img/warn.png' });
        return false;
      }
      var hao = self.csd.hao;
      var hpwd = app.enchash(hao + ts); //console.log(hao); console.log(ts);console.log(hpwd);
      var text = app.decaes(sec,hpwd); //console.log(text);
      if(!text){
        wx.showToast({ title: '暗号不对，解密失败！', duration: 2500, image: '../../res/img/warn.png' });
        return false;
      } 
      //console.log(text);
      var answer = JSON.parse(text)[0];
      self.setData({answer:answer});
    },300);
  }
})