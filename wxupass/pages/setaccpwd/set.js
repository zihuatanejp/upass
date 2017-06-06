var app = getApp();
Page({
    data:{
        v_int:'hide',
        v_rep:'hide',
        isvinp:false,
        isverify:false
    },
    csd:{
        isverify:false, // 重复输入确认是否通过
        isvinp:false    // 第一个是否通过
    },
    onLoad:function(obj){
        var self = this;
        if(obj.packinfo){
            if(obj.packinfo == 'asym'){
                
            }
            self.csd.packinfo = obj.packinfo;
        }
        app.getUserInfo(function (wxuid) {
          self.csd.wxuid = wxuid;
        });
        var bkid = self.genbkid();
        self.csd.bkid = bkid;
    },
    onShareAppMessage: function () {
      var obj = app.gbd.shareinfo;
      return obj;
    },
    setpwd: function () {
        var self = this;        
        if(!self.csd.wxuid){
          return false;
        }

        var bktype = self.csd.packinfo;
        var bkid = self.csd.bkid;
        var wxuid = self.csd.wxuid;        
        var postd = {};

        if(bktype == 'asym'){
          if (!self.csd.isvinp) {
            return false;
          }
          if (!self.csd.isverify) {
            return false;
          }
          var pvkcipher = self.encpvk();
          var pbkstr = wx.getStorageSync('pbkstr');

          postd = { 
            wxuid: wxuid, 
            bkid: bkid, 
            bktype: bktype, 
            bkpbk: pbkstr,
            bkpvkcipher: pvkcipher
          };
        }
        if(bktype == 'sym'){
          var salt = app.gensalt(12);
          var shpwd = self.csd.pwd+salt;
          shpwd = app.enchash( shpwd );
          app.gbd.pwd = self.csd.pwd;
          postd = {
            wxuid: wxuid,
            bkid: bkid,
            bktype: bktype,
            salt:salt,
            shpwd:shpwd
          };
        }
        wx.request({
          url: 'https://ssl.buditem.com/upass/initgen',
          data: postd,
          method: 'POST',
          success: function (res) {
            // console.log(res);
            if (res.data.code == '200') {
              wx.redirectTo({ url:"../firstadd/add"});
            }
          }
        });

        
        //wx.showToast({title:'yes!',duration:1500});
    },
    genbkid:function(){
        var self = this;
        var ts = new Date().getTime();
        var ranchar = self.ran(100,999)+'';
        return ts+ranchar;
    },
    ran:function(a,b){
        var n = Math.abs(a - b );
        var base_n = a;
        if(a > b){ base_n = b; }
        var res = Math.floor(Math.random()*n) + base_n;
        return res;
    },
    verify_input:function(e){
        var self = this;
        if(e && e.detail ){
            var pwd = e.detail.value;
            var rexp = /[a-zA-Z0-9]/;
            if( (!pwd) || (!rexp.test(pwd)) || (pwd.length < 6) ){
                wx.showToast({title:'请输入6位以上数字或字母!',duration:3500,image:'../../res/img/warn.png'});
                self.setData({v_int:'',v_rep:'hide',isvinp:false});
                self.csd.isvinp = false;
                return false;
            }
            self.csd.isvinp = true;
            self.csd.pwd = pwd;
            self.setData({v_int:'',isvinp:true});
            return true;
        }        
    },
    verify_repeat:function(e){
        var self = this;
        var pwd = e.detail.value;
        var old = self.csd.pwd;
        if(old == pwd ){
            self.csd.isverify = true;
            self.setData({v_int:'',v_rep:'',isverify:true});
            return true;
        }
        self.csd.isverify = false;
        self.setData({v_rep:'',isverify:false});
        return false;
    },
    encpvk:function(){
      var self = this;
      
      
      var pwd = self.csd.pwd;  //访问密码
      
      // 加密rsa私钥
      var pvkstr = wx.getStorageSync('pvkstr');
      var pvkcipher = app.gbd.crypt.AES.encrypt(pvkstr, pwd);
      pvkcipher = pvkcipher.toString();
      wx.setStorage({ key: 'pvkcipher', data: pvkcipher });
      wx.removeStorage({ key: 'pvkstr' });
      return pvkcipher;
    },
    inp1change:function(e){
      console.log(e);
    }
});