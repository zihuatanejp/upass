//index.js
//获取应用实例
var app = getApp();
Page({
  // mvvm 对应的数据-视图模型对象
  data: {
    wxuid:'',
    inputShowed: false,
    inputVal: "",
    scroitem:"",
    showhis:false,
    srtotal:'0',
    srind:'0',
    showtip:false
  },
  // 页面中当前使用的内存对象
  csd:{}, 
  //事件处理函数
  // 一个页面只会调用一次，
  onLoad: function () {
  },
  // 页面初次渲染完成
  // 一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
  // 对界面的设置如wx.setNavigationBarTitle请在onReady之后设置
  onReady:function(){},  
  // 页面隐藏时  当navigateTo或底部tab切换时调用
  onHide: function(){

  },
  // 每次打开页面都会调用一次。
  onShow:function(){
    var self = this;

    app.getUserInfo(function(wxuid){
      self.csd.wxuid = wxuid;
    });
    
    var con = app.gbd.con;
    if( (con) && (con.length>0) ){
      var csdcon = app.deepcp(con);
      for (var x in csdcon) {
        csdcon[x].ind = 'i' + csdcon[x].ind;
      }
      self.csd.con = csdcon;

      self.setData({ con: csdcon });
    }
    
    
    // 是否提醒
    var tip = wx.getStorageSync('tip') ;

    if(tip){
      tip = JSON.parse(tip);
      tip.count = parseInt(tip.count);
      if (tip.count < 5) {
        var time = Math.round(new Date().getTime() / 1000);
        if (!tip.time) {
          tip.count++;
          tip.time = time;
          self.setData({ showtip: true });
        }
        else {
          if (time - parseInt(tip.time) > 86400) {
            tip.count++;
            self.setData({ showtip: true });
          }
        }
        wx.setStorageSync('tip', JSON.stringify(tip));
      }
    }
    
    // setTimeout(function(){ self.setData({scroitem:'a5'}) },3000);
  },
  // 页面卸载
  // 当redirectTo或navigateBack的时候调用
  onUnload:function(){},
  showInput: function () {
    var self = this;
    var shistory = wx.getStorageSync('shistory');
    var showhis = false; 
    if(shistory){
      shistory = JSON.parse(shistory);
      if(shistory.length > 0){
        showhis = true;
      }
    }
    if(showhis){
      self.setData({inputShowed:true,showhis:true,shistory:shistory});
      return false;
    }
    else{
      self.setData({
        inputShowed: true,
        showhis:false
      });
    }
    
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      showhis:false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      showhis:true
    });
  },
  inputTyping: function (e) {
    var self = this;
    var inp = e.detail.value;
    inp = inp.toLowerCase();
    self.setData({inputVal:inp});
    setTimeout(function(){
      if ((inp) && (inp.length >= 2) && (inp != ' ')) {
        var res = self.gosearch(inp);
        if (!res.sris) {
          self.setData({ showhis: false, sris: false });
          return false;
        }
        var havenext = true;
        if (res.srcon.length == 1) { havenext = false; };
        self.setData({
          showhis: false, sris: true, srtotal: res.srtotal,
          srind: 1, scroitem: res.srcon[0].v, havenext: havenext
        });
        return false;
      }
      if ((!inp) || (inp.length <= 0)) {
        self.setData({
          showhis: true
        });
        return false;
      }

    },10);
  },
  searchblur:function(e){
    var self = this;
    var inp = e.detail.value;
    var arr = [];
    if( (inp)&& (inp.length>=2) ) {
      var shistory = wx.getStorageSync('shistory');
      if(shistory){
        arr = JSON.parse(shistory);
        if(arr.length < 5){
          var isunique = true;
          for (var x in arr) {
            if (inp == arr[x]) { isunique = false; }
          }
          if (isunique) { arr.unshift(inp);}          
        }
        else{
          var isunique = true;
          for(var x in arr){
            if(inp == arr[x]){ isunique = false;}
          }
          if(isunique){
            arr.unshift(inp);
            arr.length = 5;
          }
        }
      }
      else{
        arr.unshift(inp);
      }
      var arrstr = JSON.stringify(arr);
      wx.setStorageSync('shistory',arrstr);          
    }
  },
  gonext:function(e){
    var self = this;
    var ind = e.currentTarget.dataset.srind; 
    var srcon = self.csd.srcon; 
    var len = srcon.length;
    for(var x in srcon){
      if( srcon[x].k == ind){   
        var nextind = parseInt(x)+1;             
        var srind = nextind+1;  
        if( nextind < len ){ 
          var scroitem = srcon[nextind].v; 
          self.setData({ srind:srind, scroitem:scroitem });
        }
        else{ 
          self.setData({ srind: 1, scroitem: srcon[0].v });
        }
      }
    }
  },
  quicks:function(e){
    var self = this;
    var stext = e.currentTarget.dataset.stext;
    stext = stext.toLowerCase();
    var res = self.gosearch(stext);
    if(!res.sris){
      self.setData({ inputVal: stext, showhis: false, sris: false });
      return false;
    }
    var havenext = true;
    if (res.srcon.length == 1) { havenext= false; };
    self.csd.srind = 1;
    self.setData({
      inputVal: stext, showhis: false, sris: true, srtotal: res.srtotal,
      srind: 1, scroitem: res.srcon[0].v,havenext:havenext
    });
  },
  gosearch:function(inp){
    var self = this;
    var con = self.csd.con;
    var srtotal = 0;
    var srcon = [];
    var sris = false;
      
    leva: for (var x in con) {
      if (con[x].title.toLowerCase().indexOf(inp) >= 0) {
        sris = true;
        srtotal++;
        srcon.push({ k: srtotal, v: con[x].ind });
        continue leva;
      }
      levb: for (var y in con[x].con) {
        var it = con[x].con[y];
        if (it.k.toLowerCase().indexOf(inp) >= 0) {
          sris = true;
          srtotal++;
          srcon.push({ k: srtotal, v: con[x].ind });
          break levb;
        }
        if (it.v.toLowerCase().indexOf(inp) >= 0) {
          sris = true;
          srtotal++;
          srcon.push({ k: srtotal, v: con[x].ind });
          break levb;
        }
      }
    }
    self.csd.srcon = srcon;
    self.csd.srtotal = srtotal;
    self.csd.sris = sris;
    self.csd.srind = 1;
    var res = { srtotal: srtotal, sris: sris, srcon: srcon };
    return res;
  },
  canceltext:function(){
    var self = this;
    self.setData({showtip:false});
  }
});
