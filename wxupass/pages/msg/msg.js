var app = getApp();
Page({
    data:{
        title:'',
        descr:'',
        packinfo:''
    },
    onLoad:function(obj){
        var self = this;
        console.log(obj);
        if(obj.packinfo){
            if(obj.packinfo == 'asym'){
                self.setData({
                    title:'非对称加密设计流程',
                    packinfo:'asym',
                    usepack:'use_asym',
                    godescr:'godescrasym',
                    descr:
                    "将本地微信小程序密码家用户这端定义为native环境，"+
                    "将服务器端云上的密码家相关逻辑与数据定义为remote环境。\n\n"+
                    "以下是本软件“密码家”使用的非对称加密的具体流程:\n\n"+
                    "1.用户A初次进来小程序“密码家”,获取用户微信wx-openid,选择生成非对称加密包bk-id\n\n"+
                    "2.此时会去生成 一对密钥对：公钥(pk) 私钥(sk)\n\n"+
                    "3.A输入设置访问密码p, 将p作为对sk对称加密的密钥加密得到密文x\n\n"+
                    "4. 将pk,x,wx-openid,bk-id 一起发往remote.\n"+
                    "(一个用户永远自始至终只会在此创建阶段发送一次敏感信息的公钥私钥对,"+
                    "且私钥是经过用户密码加密后的密文)\n\n"+
                    "5.A录入需要加密的信息内容con, 使用pk对con进行加密得到密文xcon,将xcon发往remote存储\n\n"+
                    "6.本地永远只存储xcon,当用户使用时才去使用用户输入的p对x解密得到sk,再使用sk对xcon进行解密得到原文con。\n\n"+
                    "每当con发生改变时，重复第5步,加密后向remote发送xcon内容。\n"+
                    "当换手机时跨平台登录时可以随时同步云端的pk,x和xcon到本地。\n\n"+
                    "保证4个过程和1点:\n\n"+
                    "1.发送出的数据永远是加密的\n\n"+
                    "2.本地文件里存在的数据永远是加密的,每次用的时候才会用sk解密,切出离开后解密的内容即在内存中彻底销毁。\n\n"+
                    "3.sk平时在本地永远以对称加密的密文存在，每次需要用户自己输入唯一密码来解密\n\n"+
                    "4.任何时候远端存在的sk和xcon永远是以密文存在的,服务器端即便被攻破也不会泄密。\n\n"+
                    "5.以及最重要的一点:	永远需要正确的用户密码才能解锁，密码是唯一的\n\n"+
                    "注意：\n"+
                    "1.为了追求安全性,本账户内每一个信息集合内只会对应一个密码,此密码绝对唯一且一旦设定永不可更改，"+
                    "这意味着无法联系管理员重置密码，当你丢失了自己对于某个信息集合的密码，"+
                    "这个世界上可能没有第二个人可以再获取到这个信息集合原本存在的任何有效数据。\n\n"+
                    "同时这也意味着您的这个密码至关重要，建议不要采取过于简单而易于被人猜到的密码。\n\n"+
                    "2.传输过程中的所有数据都经过基于https的协商加密后，在此密文基础上进行了进一层的加密。"
                });
            }
            if(obj.packinfo == 'sym'){
                self.setData({
                    title:'对称加密设计流程',
                    packinfo:'sym',
                    usepack:'use_sym',
                    godescr: 'godescrsym',
                    descr:
                    "将本地微信小程序密码家用户这端定义为native环境，"+
                    "将服务器端云上的密码家相关逻辑与数据定义为remote环境。\n\n"+
                    "以下是本软件“密码家”使用的对称加密方案的具体流程:\n\n"+
                    "1.用户A初次进来小程序“密码家”,获取用户微信wx-openid,选择生成对称加密包bk-id\n\n"+
                    "2.A输入设置访问密码p和登录密码d, 将p进行hash得到密文x\n\n"+
                    "3.生成一个随机字符串salt,将（x+salt）再进行hash得到密文cc\n\n"+
                    "4. 将cc,salt,wx-openid,bk-id 一起发往remote. "+
                    "(一个用户永远自始至终只会在此创建阶段发送一次敏感信息的对称加密密钥,"+
                    "且密钥是经过用户密码加密后和随机salt后的密文)\n\n"+
                    "5.A录入需要加密的信息内容con, 使用用户输入的访问密码P,hash计算密钥得到x,"+
                    "使用x对con进行对称加密得到密文xcon,	将xcon发往remote存储\n\n"+
                    "6.本地存储xcon和salt,当用户使用时才去使用用户输入的p计算出密钥x,使用密钥x对xcon解密得到原文con。\n\n"+
                    "每当con发生改变时，重新加密后向remote发送xcon内容。\n\n"+
                    "当换手机时跨平台登录时可以随时同步云端的pk,x和xcon到本地,\n"+
                    "此时的流程,用户输入登录密码d,向remote发送d,remote验证d通过后返回salt,\n"+
                    "用户在本地再输入p,根据p和salt计算得到cc,将cc发往remote,\n"+
                    "remote验证发送过来的cc和数据库存储的cc一致后,返回xcon同步回本地。\n\n"+
                    "保证4个过程和1点:\n\n"+
                    "1.服务器端或客户端之间发送的数据永远是经过加密的\n\n"+
                    "2.用户密钥和用户输入的访问密码p和信息内容永远不会被直接传递,比如拿d换取salt,发送加密后的信息和加密后的密钥\n\n"+
                    "3.本地文件里存在的数据永远是加密的,每次用的时候才会用用戶输入的访问密码p解密,"+
                    "切出程序离开后解密的内容在内存中彻底销毁。\n\n"+
                    "4.任何时候远端存在的cc和xcon永远是以密文存在的,服务器端即便被攻破也不会泄密。\n\n"+
                    "5.以及最重要的一点:永远需要正确的用户密码才能解锁，密码是唯一的\n\n"+
                    "注意：\n"+
                    "1.为了追求安全性,本账户内每一个信息集合内只会对应一个密码,此密码绝对唯一且一旦设定永不可更改，"+
                    "这意味着无法联系管理员重置密码，\n\n"+
                    "当你丢失了自己对于某个信息集合的密码，这个世界上目前可能没有第二个人可以再获取到这个信息集合原本存在的任何有效数据。\n\n"+
                    "同时这也意味着您的这个密码至关重要，建议不要采取过于简单而易于被人猜到的密码。\n\n"+
                    "2.传输过程中的所有数据都经过基于https的协商加密后，在此密文基础上进行了进一层的加密。"+
                    "具体的加密细节参考您选择的加密包类型详情。\n\n"
                });
            }
        }
        
    },
    onShareAppMessage: function () {
      var obj = app.gbd.shareinfo;
      return obj;
    },
    //返回选择加密包
    select_page:function(){
        wx.navigateBack();
    },
    //使用非对称加密方式
    use_asym:function(){
        console.log('使用非对称');
        var pair;
        wx.showLoading({
            title:'正在为您生成2048位的公/私钥对，该过程涉及极大数字的运算操作，具体时间取决于您的处理器性能，请稍候片刻...',mask:true,
            complete:function(){
                pair = app.gbd.rsa.keypair({bits:2048});
                wx.hideLoading();
                // console.log(pair);
                var pbkstr = pair.pbkstr;
                var pvkstr = pair.pvkstr;
                // console.log(pbkstr);console.log(pvkstr);
                app.gbd.pbk = pair.pbk;
                app.gbd.pvk = pair.pvk;
                wx.setStorage({key:'pbkstr',data:pbkstr});
                wx.setStorage({ key:'pvkstr', data: pvkstr });
                wx.setStorage({key:'enctype',data:'asym'}); //2选1 使用1种则覆盖掉使用的另一种加密方式
                wx.redirectTo({
                  url: '../setaccpwd/set?packinfo=asym'
                });
            }
        });
        
    },
    use_sym:function(){
        console.log('使用对称');
        wx.setStorage({ key: 'enctype', data: 'sym' }); //2选1 使用1种则覆盖掉使用的另一种加密方式
        wx.redirectTo({
          url: '../setaccpwd/set?packinfo=sym'
        });
    },
    godescrasym:function(){
      var self = this;
      wx.navigateTo({url:'./descr?page=p2'});
    },
    godescrsym: function () {
      var self = this;
      wx.navigateTo({ url: './descr?page=p3' });
    }
});