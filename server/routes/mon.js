var seqqueue = require('seq-queue');


var obj = {
	initmon:initmon
};

// 连接mongo数据库
function initmon(con_url) {
	var self = this || {};
	self.mon = require('mongodb').MongoClient;
	self.queue = seqqueue.createQueue(30000);

	self.mon_db_sts = false;  // false:数据库不可用状态   true:数据库当前已可用
	self.mon_db;
	self.sync_lock = false; // 是否有同步锁存在
	self.mon.connect(con_url, function(err, db) {
	  if(err){ console.log(err); return;}
	  console.log(con_url+" Connected successfully to server");
	  self.mon_db = db;
	  self.mon_db_sts = true;
	});

	setInterval(function(){
		self.mon_db_sts = false;
		self.mon_db.close(function (err,result) {   console.log(con_url+' pre close mon ');
			if(err){ console.log(err);}        console.log(con_url+'env closed mon ');
			self.mon.connect(con_url,function(err,db){
				console.log(con_url+ "Connected successfully to server");
				self.mon_db = db;
			  	self.mon_db_sts = true;
			});
		});
	},1000*60*120);

	self.wait_db_open = function(callback){
		setTimeout(function(){
			if(self.mon_db_sts){
				self.use_db(callback);
			}
			else{
				self.wait_db_open(callback);
			}
		}, 500);
	}

	self.use_db = function(callback){
		if(self.mon_db_sts){
			self.queue.push(function (task) {
				callback(self.mon_db,task);
			});
		}
		else{
			self.wait_db_open(callback);
		}	
	}

	self.accmon = function (callback){
		self.use_db(callback);
	}

	return self;
}




module.exports = obj;
