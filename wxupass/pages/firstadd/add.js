// add.js
var app = getApp();
Page({
  data: {
    con: [
      { ind: 0, title: '', con: [{ id: 0, k: '', v: '' }] }
    ]
  },
  csd:{
    con: [
      { ind: 0, title: '', con: [{ id: 0, k: '', v: '' }] }
    ]
  },
  onShareAppMessage: function () {
    var obj = app.gbd.shareinfo;
    return obj;
  },
  addsubitem: function (e) {
    var self = this; 
    var ind = parseInt(e.currentTarget.dataset.ind);
    var sid;
    var con = self.csd.con;
    var subcon = [];
    for (var i = 0; i < con.length; i++) {
      if (con[i].ind == ind) {
        subcon = con[i].con;
      }
    }
    if (subcon.length > 0) {
      var lastind = parseInt(subcon.slice(-1)[0].id);
      sid = ++lastind;
    }
    else {
      sid = 0;
    } 
    var item = { id: sid, k: '', v: '' };
    subcon.push(item);
    var strkey = '';
    var chcon = self.chcon();
    self.setData({ con: chcon });
  },
  additem: function () {
    var self = this;
    var con = self.csd.con;
    var lastind;
    if (con.length > 0) {
      lastind = parseInt(con.slice(-1)[0].ind);
      self.csd.con.push({ ind: ++lastind, title: '', con: [{ id: 0, k: '', v: '' }] });
    }
    else {
      self.csd.con.push({ ind: 0, title: '', con: [{ id: 0, k: '', v: '' }] });
    }
    var chcon = self.chcon();
    self.setData({ con: chcon });
  },
  delitem: function (e) { 
    var self = this;
    var ind = parseInt(e.currentTarget.dataset.ind);
    var con = self.csd.con;
    if (con.length <= 1) {
      self.csd.con = [];
    }
    else {
      for (var i = 0; i < con.length; i++) {
        if (con[i].ind == ind) {
          con.splice(i, 1);
        }
      }
    }
    var chcon = self.chcon();
    self.setData({ con: chcon });
  },
  delsubitem: function (e) { 
    var self = this;
    var ind = parseInt(e.currentTarget.dataset.ind);
    var sid = parseInt(e.currentTarget.dataset.sid);
    var con = self.csd.con;
    for (var i = 0; i < con.length; i++) {
      if (con[i].ind == ind) {
        for (var j = 0; j < con[i].con.length; j++) {
          var item = con[i].con[j];
          if (item.id == sid) {
            con[i].con.splice(j, 1);            
          }
        }
      }
    }
    var chcon = self.chcon();
    self.setData({ con: chcon });
  },
  //同步保存输入的标题数据
  titlesave: function (e) { 
    var self = this;
    var ind = parseInt(e.currentTarget.dataset.ind);
    var con = self.csd.con;
    var val = e.detail.value;
    if (con.length <= 1) {
      con[0].title = val;
    }
    else {
      for (var i = 0; i < con.length; i++) {
        if (con[i].ind == ind) {
          con[i].title = val;
        }
      }
    }
  },
  //同步保存键值内容
  kvsave: function (e) { 
    var self = this;
    var ind = parseInt(e.currentTarget.dataset.ind);
    var sid = parseInt(e.currentTarget.dataset.sid);
    var ty = e.currentTarget.dataset.ty;
    var con = self.csd.con;
    var val = e.detail.value;
    for (var i = 0; i < con.length; i++) {
      if (con[i].ind == ind) {
        for (var j = 0; j < con[i].con.length; j++) {
          var item = con[i].con[j];
          if (item.id == sid) {
            if (ty == 'k') {
              con[i].con[j].k = val;
            }
            if (ty == 'v') {
              con[i].con[j].v = val;
            }
          }
        }
      }
    }
  },
  submit: function () {
    var self = this;
    var con = self.csd.con;
    var wxuid = '';
    app.getUserInfo(function (r) {
      wxuid = r;
    });   
    var ispass = false;
    if (con.length > 0) {
      for (var i = 0; i < con.length; i++) {
        if (con[i].title) { ispass = true; }
        for (var j = 0; j < con[i].con.length; j++) {
          if (con[i].con[j].k) { ispass = true; }
          if (con[i].con[j].v) { ispass = true; }
        }
      }
    }
    if (!ispass) {
      wx.showToast({ title: '至少得写点儿什么!', duration: 3500, image: '../../res/img/warn.png' });
      return false;
    }
    app.gbd.con = con;
    var content = JSON.stringify(con);
    var enctype = wx.getStorageSync('enctype');
    var concipher = '';
    if(enctype == 'asym'){
      var rsa = app.gbd.rsa;
      var pbkstr = wx.getStorageSync('pbkstr');
      var pbk = rsa.convpbk(pbkstr);
      concipher = rsa.pbkenc(pbk, content);
      concipher = JSON.stringify(concipher);
    }
    if(enctype == 'sym'){
      var pwd = app.gbd.pwd;
      var hpwd = app.enchash(pwd);
      concipher = app.encaes(content,hpwd);
    }
    wx.request({
      url: 'https://ssl.buditem.com/upass/setconcipher',
      method: 'POST',
      data: {
        wxuid: wxuid,
        concipher: concipher
      },
      success: function (res) {
        // console.log(res);
      }
    });
    wx.setStorageSync('concipher', concipher);
    wx.switchTab({ url: '../index/index' });
  },
  nextfocus: function (e) {
    var self = this;
    setTimeout(function () {
      // console.log(e);        
      var ind = parseInt(e.currentTarget.dataset.ind);
      var sid = e.currentTarget.dataset.sid;
      var ty = e.currentTarget.dataset.ty;
      var con = self.csd.con;
      var chcon = self.chcon();
      self.setData({ con: chcon });// 解决安卓键盘问题先主动失焦
      if (sid == 'no') {
        for (var x in con) {
          if (con[x].ind == ind) {
            if (con[x].con.length > 0) {
              chcon[x].con[0].kfoc = true;
            }
            else {
              var tmp = parseInt(x) + 1;
              if (chcon[tmp]) {
                chcon[tmp].foc = true;
              }
            }
          }
        }
      }
      

      if ((sid != 'no') && (ty)) {
        for (var j = 0; j < con.length; j++) {
          if (con[j].ind == ind) {
            for (var m = 0; m < con[j].con.length; m++) {
              if (con[j].con[m].id == sid) {
                if (ty == 'k') {
                  chcon[j].con[m].vfoc = true;
                }
                if (ty == 'v') {
                  var tp2 = m + 1;
                  if (chcon[j].con[tp2]) {
                    chcon[j].con[tp2].kfoc = true;
                  }
                  else {
                    var tp3 = j + 1;
                    if (chcon[tp3]) {
                      chcon[tp3].foc = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
      setTimeout(function () {
        self.setData({ con: chcon });
      }, 150);

    }, 150);


  },
  chcon: function () {
    var self = this;
    var con = self.csd.con;
    var res = app.deepcp(con);

    for (var i = 0; i < res.length; i++) {
      res[i].foc = false;
      var subcon = res[i].con;
      for (var n = 0; n < subcon.length; n++) {
        res[i].con[n].kfoc = false;
        res[i].con[n].vfoc = false;
      }
    }
    return res;
  }
})