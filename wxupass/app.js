//app.js
var rsa = require('lib/rsa.js'); // 引入rsa库
var crypt = require('lib/cryptojs'); //引入aes,hash库
App({
  // globalData对象 小程序的全局数据访问对象
  gbd:{
    user_info:{},
    rsa:rsa,
    crypt:crypt,
    sha2: crypt.SHA256,
    shareinfo:{
      title:'密码家--不愁记密码',path:'../acc/acc',
      success: function (res) { /*console.log(res);*/ },
      fail: function (res) { /*console.log(res);*/ },
      complete: function (res) { /*console.log(res);*/ },
    }
  },
  // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch: function () {    
    
  },
  // 当小程序启动，或从后台进入前台显示，会触发 onShow
  onShow :function(){
    var self = this;
    
    var tip = { count: 0, time: '' };
    tip = JSON.stringify(tip);
    wx.getStorage({
      key: 'tip',
      fail: function () {
        wx.setStorage({ key: 'tip', data: tip });
      }
    });
    
  },
  // 监听小程序隐藏 	当小程序从前台进入后台，会触发 onHide
  onHide:function(){ },
  // 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  onError:function(e){
    console.log(e);
    wx.showToast({title:e,duration:8000});
  },
  // 获取用户信息 标识当前用户
  getUserInfo:function(cb){
    var self = this;  
    if(self.gbd.user_info.wxuid){
      var wxuid = self.gbd.user_info.wxuid;
      cb(wxuid);
      return false;
    }
    var wxuid = wx.getStorageSync('wxuid');
    if(wxuid){
      self.gbd.user_info.wxuid = wxuid;
      cb(wxuid);
      return false;
    }
    else{
      wx.login({
        success: function(res){          
          if(res.code){
            wx.request({
              url: 'https://ssl.buditem.com/upass/getwxuid',
              data: { code:res.code},
              method: 'GET', 
              success: function(ress){
                if(ress.data.code == '200' ){
                  self.gbd.user_info.wxuid = ress.data.wxuid;
                  wx.setStorageSync('wxuid', ress.data.wxuid);
                  cb(ress.data.wxuid);
                  return false;
                }                
              }
            });
          }
        }
      });
    }
  },
  // 异步拿取指定key数据 取到为止返回 默认超时时间8s 
  // intv:每次获取的间隔  dura:超时时间 6000
  // key 获取值的key callback:获取到后的回调函数
  getgd:function(obj){
    var self = this;
    var intv = obj.intv || 200;
    var count = 0;
    var count_total = parseInt(( obj.dura || 6000 )/intv);
    var inter = setInterval(function(){
      count++;
      if(count < count_total){
        var tmp = self.gbd[obj.key];
        if( (tmp) && (tmp != 'nodata') ){
          clearInterval(inter);
          obj.callback(tmp);
        }
      }
      else{
        clearInterval(inter);
        obj.callback('nodata');
      }
    },intv);
  },
  getStorData:function(obj){
    var self = this;
    var intv = obj.intv || 200;
    var count = 0;
    var count_total = parseInt(( obj.dura || 6000 )/intv);
    var inter = setInterval(function(){
      count++;
      if(count < count_total){
        wx.getStorage({
          key:obj.key,
          success:function(res){
            clearInterval(inter);
            obj.callback(res.data);
          }
        });
      }
      else{
        clearInterval(inter);
        obj.callback('nodata');
      }
    },intv);
  },
  decryptrsa:function(pwd,concipher){
    var self = this;
    var rsa = self.gbd.rsa;
    var crypt = self.gbd.crypt;

    // 解密得到私钥
    var pvkcipher = wx.getStorageSync('pvkcipher');
    var pvkstr = '';
    var isright = false;
    try{
      pvkstr = crypt.AES.decrypt(pvkcipher, pwd);
      pvkstr = pvkstr.toString(crypt.enc.Utf8);
      isright = true; 
    }
    catch(err){
      isright = false;
    }
    if(isright){ 
      if ( (pvkstr.charAt(0) == '{')  && (pvkstr.charAt(pvkstr.length-1) == '}')  ){
        isright = true;
      }
      else{
        isright = false;
      }
    }
    if(!isright){
      return false;
    } 
    var pvk = rsa.convpvk(pvkstr);  

    //解密得到原文
    concipher = JSON.parse(concipher);
    var plaintext = rsa.pvkdec(pvk, concipher);
    var jsont = JSON.parse(plaintext); 
    return jsont;
  },
  //深拷贝数组
  deepcp:function(obj){
    var self = this;
    var sc = obj instanceof Array ? [] : {};
    for(var x in obj){
      sc[x] = typeof obj[x] === 'object' ? self.deepcp(obj[x]) : obj[x];
    }
    return sc;
  },
  enchash:function(str){
    var self = this;
    var sha2 = self.gbd.sha2;
    var crypt = self.gbd.crypt;
    var hashx = sha2(str);
    hashx = hashx.toString(crypt.enc.Hex);
    return hashx;
  },
  encaes:function(str,pwd){
    var self = this;
    var cipher = self.gbd.crypt.AES.encrypt(str, pwd);
    cipher = cipher.toString();
    return cipher;
  },
  decaes:function(str,pwd){
    var self = this;
    var crypt = self.gbd.crypt;
    var plain = crypt.AES.decrypt(str, pwd); 
    var isright = false;
    try {
      plain = plain.toString(crypt.enc.Utf8); 
      isright = true;
    }
    catch (err) { 
      isright = false;
    }
    if (isright) {
      if ((plain.charAt(0) == '[') && (plain.charAt(plain.length - 1) == ']')) {
        isright = true;
      }
      else {
        isright = false;
      }
    }
    if (!isright) {
      return false;
    }
    return plain;
  },
  gensalt:function(cnt){
    var self = this;
    var t = '';
    var res = '';
    var biao = 'abcdefghijklmnopqrstuvwxyz0123456789'
    for(var i = 0;i<cnt;i++){
      var rani = self.ran(0,36);
      t = biao.charAt(rani);
      res +=t;
    }
    return res;
  },
  genid:function(){
    var self = this;
    var ts = new Date().getTime();
    var ranchar = self.ran(100, 999) + '';
    return ts + ranchar;
  },
  gentk:function(){
    var self = this;
    var tk = '';
    var ts = Math.round(new Date().getTime() / 1000).toString();
    var biao = 'xxxxx';   // token
    var arr = ts.split('');
    var ind = 0;
    for(var x in arr){
      var i = parseInt(arr[x]);
      if(i == 0){
        ind = 0;
      }
      else{
        ind = (4 * i) - 1;
      }      
      tk += biao.charAt(ind);
    }
    return tk;
  },
  ran: function (a, b) {
    var n = Math.abs(a - b);
    var base_n = a;
    if (a > b) { base_n = b; }
    var res = Math.floor(Math.random() * n) + base_n;
    return res;
  }
});