var express = require('express');
var router = express.Router();
var https = require('https');
var fs = require('fs');
var path = require('path');
var mon = require('./mon');
var mongodb = require('mongodb');

var con_url = 'mongodb://conupass:conpassxx@localhost:27017/upass';
var mon = require('./mon');
var accmon = new mon.initmon(con_url).accmon;

// 用户在小程序上同意获取微信登录信息后，传给一个短暂的code,
// 由服务器拼接url包括appsecret到微信获取用户的wx-openid,
// 返给客户端 用户微信openid
router.get('/getwxuid', function(req, res) {
	var code = req.query.code;

	var wxurl = 'https://api.weixin.qq.com/sns/jscode2session';
	var appid = 'xxxxx';                   // 小程序的appid
	var appsecret = 'xxxxx';               // 小程序的appsecret
	var jscode = code;                     // 临时登录的code
	wxurl = (wxurl + '?appid=' + appid + '&secret=' + appsecret + '&js_code=' + jscode + '&grant_type=authorization_code');

	var reqq = https.get(wxurl, function (ress) {
		ress.setEncoding('utf8');
		var tmp = '';
		ress.on('data',function (d) {
			tmp += d;			
		});

		ress.on('end',function () {
			// console.log(tmp);
			tmp = JSON.parse(tmp);
			var data = {code:200,wxuid:tmp.openid};
			res.json(data);
		});
	});
	reqq.end();	
});

// 初始上传: wxuid , default包： bkid:包id   
//bktype:包类型对称/非对称 sym/asym bkpbk:公钥 bkpvkcipher:私钥
router.post('/initgen',function (req,res) {
	var wxuid = req.body.wxuid;
	var bkid = req.body.bkid;
	var bktype = req.body.bktype;
	var bkpbk = req.body.bkpbk;
	var bkpvkcipher = req.body.bkpvkcipher;
	var salt = req.body.salt;
	var shpwd = req.body.shpwd;
	
	var seto = {};
	if(bktype == 'asym'){
		seto = { dfbk:{bkid:bkid,bktype:bktype,bkpbk:bkpbk,bkpvkcipher:bkpvkcipher} };
	}
	if(bktype =='sym'){
		seto = { dfbk:{bkid:bkid,bktype:bktype,salt:salt,shpwd:shpwd} };
	}
	
	accmon(function (db,task) {
		var cal = db.collection('infos');
		cal.updateOne(
			{wxuid:wxuid},
			{ $set:seto },
			{upsert:true},
			function (err,resu) {
				task.done();
				var d = {code:'200'};
				if(err){ d.code = '100';d.msg = err;}
				return res.json(d);
			}
		);
	});
});

//每次编辑时上传  默认密文更新到dfbk包
router.post('/setconcipher',function (req,res) {
	var wxuid = req.body.wxuid;
	var concipher = req.body.concipher;
	accmon(function (db,task) {
		var cal = db.collection('infos');
		cal.findOneAndUpdate(
			{wxuid:wxuid},
			{ $set:{ 'dfbk.concipher':concipher } },
			{upsert:false,returnOriginal:false},
			function (err,r) {
				task.done();
				var d = {code:'200'};
				if(err){ d.code = '100';d.msg = err; return res.json(d);}
				if( (!r) && (!r.value) ){ d.code = '100',d.msg = r; }
				return res.json(d);
			}
		);
	});
});

// 同步信息回本地
router.post('/getinfo',function (req,res) {
	var wxuid = req.body.wxuid;
	var tk = req.body.tk;         // token
	if(!vertk(tk)){
		return res.json({code:'100',msg:'验证失败'});
	}
	var dfbk = {};
	accmon(function (db,task) {
		var cal = db.collection('infos');
		cal.findOne(
			{wxuid:wxuid},
			{ fields:{dfbk:1} },
			function (err,r) {
				task.done();
				var d = {code:'200'};
				if(err){ d.code = '100';d.msg = err;}
				else{
					if( (r) && (r.dfbk) && (r.dfbk.concipher) ){ d.res = r; }
					else{ d.code = '100';d.msg = '无信息'; }
				}
				return res.json(d);
			}
		);
	});
});

// 获取绑定的手机号
router.post('/getphone',function (req,res) {
	var wxuid = req.body.wxuid;
	accmon(function (db,task) {
		var cal = db.collection('infos');
		cal.findOne(
			{wxuid:wxuid},
			{ fields:{tel:1} },
			function (err,r) {
				task.done();
				var d = {code:'200'};
				if(err){ d.code = '100';d.msg = err;}
				else{
					if( (r) && (r.tel) ){ d.res = r; }
					else{ d.code = '100';d.msg = '无信息'; }
				}
				return res.json(d);
			}
		);
	});
});

// 设置绑定手机
router.post('/setphone',function (req,res) {
	var wxuid = req.body.wxuid;
	var tel = req.body.tel;
	accmon(function (db,task) {
		var cal = db.collection('infos');
		cal.findOneAndUpdate(
			{wxuid:wxuid},
			{ $set:{ tel:tel } },
			{upsert:false,returnOriginal:false},
			function (err,r) {
				task.done();
				var d = {code:'200'};
				if(err){ d.code = '100';d.msg = err; return res.json(d);}
				if(!r.value){ d.code = '100',d.msg = r; }
				return res.json(d);
			}
		);
	});
});

//重置密码家 清空加密数据
router.post('/clearcon',function (req,res) {
	var wxuid = req.body.wxuid;
	var tk = req.body.tk;         // token
	if(!vertk(tk)){
		return res.json({code:'100',msg:'验证失败'});
	}
	accmon(function (db,task) {
		var cal = db.collection('infos');
		cal.findOneAndUpdate(
			{wxuid:wxuid},
			{ $set:{ dfbk:'' } },
			{upsert:false,returnOriginal:false},
			function (err,r) {
				task.done();
				var d = {code:'200'};
				if(err){ d.code = '100';d.msg = err; return res.json(d);}
				if(!r.value){ d.code = '100',d.msg = r; }
				return res.json(d);
			}
		);
	});
});

// 用户发送意见反馈
router.post('/sendfbk',function (req,res) {
	var wxuid = req.body.wxuid;
	var con = req.body.con;
	var fid = req.body.fid;
	var ts = parseInt(req.body.ts);
	var item = {fid:fid,con:con,ts:ts};

	accmon(function (db,task) {
		var cal = db.collection('infos');
		cal.findOneAndUpdate(
			{wxuid:wxuid},
			{ $push:{feedback: item },$set:{lastfbkts:ts} },
			{upsert:false,returnOriginal:false},
			function (err,r) {
				task.done();
				var d = {code:'200'};
				if(err){ d.code = '100';d.msg = err; return res.json(d);}
				if(!r.value){ d.code = '100',d.msg = r; }
				return res.json(d);
			}
		);
	});
});

// 获取该用户的消息
router.post('/getmsg',function (req,res) {
	var wxuid = req.body.wxuid;
	var tk = req.body.tk;         // token
	if(!vertk(tk)){
		return res.json({code:'100',msg:'验证失败'});
	}
	accmon(function (db,task) {
		var cal = db.collection('infos');
		cal.findOne(
			{wxuid:wxuid},
			{ fields:{ feedback:1,msg:1 } },
			function (err,r) {
				task.done();
				var d = {code:'200'};
				if(err){ d.code = '100';d.msg = err;}
				else{
					if( r ){ d.res = r; }
					else{ d.code = '100';d.msg = '无信息'; }
				}
				return res.json(d);
			}
		);
	});
});

// 改变消息已读/未读状态
router.post('/changemsgs',function (req,res) {
	var wxuid = req.body.wxuid;
		
	accmon(function (db,task) {
		var cal = db.collection('infos');
		cal.findOne(
			{wxuid:wxuid},
			{ fields:{ msg:1 } },
			function (err,r) {
				task.done();
				if(err){ return res.json({code:100,msg:'findOne错误'}); }
				var doc = r;
				if(!doc.msg){ return res.json({code:100,msg:'无消息'}); }
				if(doc.msg){
					for(var i = 0;i<doc.msg.length;i++){
						if(!doc.msg[i].isread){
							doc.msg[i].isread = true;
						}
					}
					accmon(function (db,task) {
						var cal = db.collection('infos');
						cal.updateOne(
							{wxuid:wxuid},
							{ $set:{msg:doc.msg} },
							function (err2,r2) {
								task.done();
								if(err2){ return res.json({code:100,msg:'updateOne错误'}); }
								return res.json({code:200,res:r2});
							}
						);	
					});
				}
			}
		);
	});
});

// 管理捐献人集合
router.get('/donateman',function (req,res) {
	accmon(function (db,task) {
		var cal = db.collection('tmoney');
		cal.find({}).toArray(function (err,docs) {
	      	task.done();
	      	if(err){ return res.json({code:100,msg:'查找报错'}); }	      
		  	return res.render('upass/donateman',{data:docs});
	    });
	});
});

// 添加捐献人
router.post('/addtmoney',function (req,res) {
	var uname = req.body.uname;
	var umoney = parseFloat(req.body.umoney);
	var ts = parseInt(req.body.ts);

	accmon(function (db,task) {
		var cal = db.collection('tmoney');
		cal.insertOne(
			{uname:uname,umoney:umoney,ts:ts},
			function (err,r) {
				task.done();
				if(err){ return res.json({code:100,msg:'插入失败'}); }
			    return res.json({ code:200 });
			}
		);		
	})
});

// 更新指定捐献人信息
router.post('/uptmoney',function (req,res) {
	var uname = req.body.uname;
	var umoney = parseFloat(req.body.umoney);
	var id = req.body.id;
	id = new mongodb.ObjectID(id);

	accmon(function (db,task) {
		var cal = db.collection('tmoney');
		cal.updateOne(
			{_id:id},
			{ $set:{ uname:uname,umoney:umoney } },
			function (err,r) {
				task.done();
				if(err){ return res.json({code:100,msg:'更新失败'}); }
			    return res.json({ code:200 });
			}
		);		
	});
});

// 获取捐献人列表
router.post('/tmoney',function (req,res) {
	accmon(function (db,task) {
		var cal = db.collection('tmoney');
		cal.find({}).sort({'umoney':-1}).toArray(function (err,docs) {
	      task.done();
	      if(err){ return res.json({code:100,msg:'查找报错'}); }
	      return res.json({ code:200, res:docs });
	    });
	});
});

// 管理意见反馈
router.get('/replyuser',function (req,res) {
	accmon(function (db,task) {
		var cal = db.collection('infos');
		cal.find({})
		.project({feedback:1,msg:1,lastfbkts:1,wxuid:1})
		.sort({'lastfbkts':-1})
		.toArray(function (err,r) {
			task.done();
			if(err){ return res.json({code:'100'}); }
			res.render('upass/replyuser',{data:r});
		});
	});
});

// 回复用户消息
router.post('/replyuser',function (req,res) {
	var wxuid = req.body.wxuid;
	var it = req.body;
	var isread = it.isread;
	if( isread == 'false'){ isread = false;}
	if( isread == 'true'){ isread = true;}
	if( typeof(it.ts) == 'string' ){ it.ts = parseInt(it.ts);}
	var item = { mid:it.mid, con:it.con, ts:it.ts, relfid:it.relfid, isread:isread }; console.log(item);

	accmon(function (db,task) {
		var cal = db.collection('infos');
		cal.findOneAndUpdate(
			{wxuid:wxuid},
			{ $push:{msg: item } },
			{upsert:false,returnOriginal:false},
			function (err,r) {
				task.done();
				if(err){ return res.json({code:'100',msg:err}); }
				if(!r.value){ return res.json({code:'100',msg:'失败'}); }
				return res.json({code:200});
			}
		);
	});
});

function dectk(str) {
	var tk = new String(str);
	var biao = 'xxxxx';  // token表
	var arr = tk.split('');
	var ts = '';
	for(var x in arr){
		var tmp = '';
		var index = biao.indexOf(arr[x]);
		if(index == 0){
			tmp = 0;
		}
		else{
			tmp = (index+1)/4;
		}
		ts += ( tmp.toString() );
	}
	return ts;
}

function vertk(tk){
	if(!tk){
		return false;
	}
	var time_a = Math.round(new Date().getTime()/1000).toString();
	var time_b =  parseInt( dectk(tk) );

	if( (time_b <= (time_a+30) ) && (time_b >= (time_a-30) ) ){
		return true;
	}
	else{
		return false;
	}
}

module.exports = router;
