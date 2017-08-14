'use strict';
 
var ut = {
	bnplus:bnplus,
	bnminus:bnminus,
	bnmultip:bnmultip,
	bndivis:bndivis,
	bnmod:bnmod,
	bnisnega:bnisnega,
	bnabscomp:bnabscomp
};

var ntstrts = ''; /* 时间源,如果它被设置了值的话，将会使用它作为源，每1s更新一次 */
var ntgmt = '480'; /* 当前时区与GMT时区偏移的分钟数  */

module.exports = {
	getnowts:getnowts,   
	resetnow:resetnow,
	convts:convts,
	strtstotext:strtstotext,
	objtstotext:objtstotext,
	numtstotext:numtstotext,
	strtoobjts:strtoobjts,
	objtostrts:objtostrts,
	numtostrts:numtostrts,
	timeplus:timeplus,
	timeminus:timeminus,
	timespace:timespace,
	msconv:msconv,
	msconvto:msconvto,
	rolltoms:rolltoms,
	tzset:tzset,
	tzmiset:tzmiset,
	tzcityset:tzcityset,
	util:ut
};

function getnowts() {
	var tp1 = getnow();
	var tp2;
	if(!tp1){
		tp1 = new Date().getTime().toString();
	}
	var md = tp1;
	var res = {};
	res.strts = md;
	res.numts = parseInt(md);
	res.objts = strtoobjts(md);
	return res;
}


function strtoobjts(ts) {
	ts = tzaddoffset(ts,ntgmt); 

	var res = {yy:'0000',mm:'00',dd:'00',hh:'00',mi:'00',ss:'00',ms:'000'};
	var tsnega = false;

	if( ut.bnisnega(ts) ){
		ts = ts.slice(1);
		tsnega = true;
	}

	var obj = msconvto(ts,'dd'); 
	var cnt = obj.cnt;
	var ret = obj.ret;
	var tp1,tp2,tp3,tp4,tp5,tp6,tp7,tp8,tp9,tp10,tp11,tp12;
	if(cnt == '0'){ 
		if(!tsnega){ 
			res.yy = '1970';
			res.mm = '01';
			res.dd = '01';
			
			tp11 = shifenmiao(ret);			
		}
		else{
			res.yy = '1969';
			res.mm = '12';
			res.dd = '31';
			tp11 = shifenmiao( ut.bnminus('86400000',ret) );
		}
		res.hh = tp11.hh;
		res.mi = tp11.mi;
		res.ss = tp11.ss;
		res.ms = tp11.ms;
	}
	if( (ut.bnabscomp(cnt,'365')=='no') && (ut.bnabscomp(cnt,'0')=='yes') ){
		if(tsnega){
			res.yy = '1969';
			obj = msconvto( ut.bnminus('31536000000',ts) ,'dd'); 
			cnt = obj.cnt;
			ret = obj.ret;
		}
		else{
			res.yy = '1970';
		}
		tp1 = daxiaoyueri(cnt,false,false);
		
		res.mm = tp1.mm;
		res.dd = tp1.dd;

		tp11 = shifenmiao(ret);
		
		res.hh = tp11.hh;
		res.mi = tp11.mi;
		res.ss = tp11.ss;
		res.ms = tp11.ms;
	}
	if( ut.bnabscomp(cnt,'365')=='eq' ){
		if(!tsnega){
			res.yy = '1971';
			res.mm = '01';
			res.dd = '01';

			tp11 = shifenmiao(ret);
		}
		if(tsnega){
			res.yy = '1968';
			res.mm = '12';
			res.dd = '31';
			tp11 = shifenmiao( ut.bnminus('86400000',ret) );
		}
		res.hh = tp11.hh;
		res.mi = tp11.mi;
		res.ss = tp11.ss;
		res.ms = tp11.ms;
	}

	if( ut.bnabscomp(cnt,'365')=='yes' ){ 
		var flag = true;
		var yyms = '31536000000'; 
		tp1 = '0'; 
		tp2 = '0'; 
		tp3 = '1970';
		tp4 = '0'; 
		var xxtp ;
		while(flag){

			yyms = '31536000000';
			tp9 = false;
			tp10 = false;
			
			if(!tsnega){
				if( iszhenbai(tp3)=='no' ){ 
					if( tp4=='4' ){ 
						yyms = '31622400000';
						tp9 = true;
					}
				}
				if( iszhenbai(tp3)=='yes' ){ 
					if( ut.bnmod(tp3,'400')=='0' ){ 
						yyms = '31622400000'; 
						tp9 = true;
					}
				}
			}

			if(tsnega){
				xxtp = ut.bnminus(tp3,'1');
				if( iszhenbai( xxtp )=='no' ){
					if( tp4=='4' ){
						yyms = '31622400000';
						tp9 = true;
					}
				}
				if( iszhenbai( xxtp )=='yes' ){ 
					if( ut.bnmod(xxtp,'400')=='0' ){ 
						yyms = '31622400000'; 
						tp9 = true;
					}
				}
			}
			if(!tsnega){
				if(tp2=='2'){
					yyms = '31622400000';  
					tp4 ='0';
					tp9 = true;
				}
			}
			if(tsnega){
				if(tp2=='1'){
					tp4='0';
					yyms = '31622400000'; 
					tp9 = true;
				}
			}
			
			if( ut.bnabscomp(tp2,'3499')=='yes' ){
				if( ut.bnmod(tp1,'3500') == '0' ){
					yyms = ut.bnminus(yyms,'86400000');
					tp10 = true;
				}
			}
			tp8 = tp1;
			tp1 = ut.bnplus(tp1,yyms); 

			if( ut.bnabscomp(tp1, ut.bnplus(ts,'1') ) =='no' ){
				if(tp4== '4'){
					tp4 = '0';
				} 
				tp2 = ut.bnplus(tp2,'1');
				if(tsnega){
					tp3 = ut.bnminus(tp3,'1');
				}
				else{
					tp3 = ut.bnplus(tp3,'1');
				}				
				tp4 = ut.bnplus(tp4,'1'); 
				
			}
			else{
				flag = false;
			}
		}
		if (!tsnega) {
			res.yy = tp3;  
			tp5 = ut.bnminus(ts,tp8);
		}

		if(tsnega){
			res.yy = ut.bnminus(tp3,'1');
			tp5 = ut.bnminus(tp1,ts);
		}

		if(tp5 == '0'){
			res.mm = '01';
			res.dd = '01';
		}
		else{
			tp6 = msconvto(tp5,'dd'); 
			tp7 = daxiaoyueri(tp6.cnt,tp9,tp10);
			res.mm = tp7.mm;
			res.dd = tp7.dd;

			tp11 = shifenmiao(tp6.ret);
			res.hh = tp11.hh;
			res.mi = tp11.mi;
			res.ss = tp11.ss;
			res.ms = tp11.ms;
		}
	}

	function iszhenbai(str) {
		if(str.length<3){
			return 'no';
		}
		if( str.slice(-2) == '00' ){
			return 'yes';
		}
		return 'no';
	}

	function shifenmiao(tss) {
		var r = {hh:'00',mi:'00',ss:'00',ms:'000'};
		var tp1,tp2,tp3,tp4,tp5;
		if(tss=='0'){
			return r;
		}
		tp1 = msconvto(tss,'hh');
		r.hh = tp1.cnt;
		if(r.hh.length<2){
			r.hh = '0'+r.hh;
		}
		tp2 = msconvto(tp1.ret,'mi');
		r.mi = tp2.cnt;
		if(r.mi.length<2){
			r.mi = '0'+r.mi;
		}
		tp3 = msconvto(tp2.ret,'ss');
		r.ss = tp3.cnt;
		if(r.ss.length<2){
			r.ss = '0'+r.ss;
		}
		r.ms = tp3.ret;
		if(r.ms.length==1){
			r.ms = '00'+r.ms;
		}
		if(r.ms.length==2){
			r.ms = '0'+r.ms;
		}
		return r;
	}

	function daxiaoyueri(day,isleapyear,isjianri) {
		var d = parseInt(day);
		var r = {mm:'00',dd:'00'};
		var leap = 0;
		if(isleapyear){ ++leap; }
		if(isjianri){ --leap; } 

		if(d<31){
			r.mm = '01';
			r.dd = (d+1).toString();
			if(r.dd.length<2){ r.dd = '0'+r.dd; }
		}
		if( (d>=31)&&(d<(59+leap)) ){
			r.mm = '02';
			r.dd = (d-31+1).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		if( (d>=(59+leap)) && (d<(90+leap)) ){
			r.mm = '03';
			r.dd = (1+d-(59+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		if( (d>=(90+leap)) && (d<(120+leap)) ){
			r.mm = '04';
			r.dd = (1+d-(90+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		if( (d>=(120+leap)) && (d<(151+leap)) ){
			r.mm = '05';
			r.dd = (1+d-(120+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		if( (d>=(151+leap)) && (d<(181+leap)) ){
			r.mm = '06';
			r.dd = (1+d-(151+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		if( (d>=(181+leap)) && (d<(212+leap)) ){
			r.mm = '07';
			r.dd = (1+d-(181+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		if( (d>=(212+leap)) && (d<(243+leap)) ){
			r.mm = '08';
			r.dd = (1+d-(212+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		if( (d>=(243+leap)) && (d<(273+leap)) ){
			r.mm = '09';
			r.dd = (1+d-(243+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		if( (d>=(273+leap)) && (d<(304+leap)) ){
			r.mm = '10';
			r.dd = (1+d-(273+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		if( (d>=(304+leap)) && (d<(334+leap)) ){
			r.mm = '11';
			r.dd = (1+d-(304+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		if( (d>=(334+leap)) && (d<(365+leap)) ){
			r.mm = '12';
			r.dd = (1+d-(334+leap)).toString();
			if(r.dd.length<2){
				r.dd = '0'+r.dd;
			}
		}
		return r;
	}
	return res;
}


function convts(units) {
	var ymd =     /^(\d{1,})\D(\d{2})\D(\d{2})$/i;
	var ymdhm=    /^(\d{1,})\D(\d{2})\D(\d{2})\s(\d{2})\D(\d{2})$/i;
	var ymdhms=   /^(\d{1,})\D(\d{2})\D(\d{2})\s(\d{2})\D(\d{2})\D(\d{2})$/i;
	var ymdhmsms= /^(\d{1,})\D(\d{2})\D(\d{2})\s(\d{2})\D(\d{2})\D(\d{2})\D(\d{3})$/i;

	var objts = {yy:'0000',mm:'00',dd:'00',hh:'00',mi:'00',ss:'00',ms:'000'};
	var arr = [];
	var strts = '';
	var res = {};

	if( ymd.test(units) ){
		arr = units.split(ymd);
		objts.yy = arr[1];
		objts.mm = arr[2];
		objts.dd = arr[3];
		strts = objtostrts(objts);
		res.objts= objts;
		res.strts = strts;
		res.numts = parseInt(strts);
		return res;
	}
	if( ymdhm.test(units) ){
		arr = units.split(ymdhm); 
		objts.yy = arr[1];
		objts.mm = arr[2];
		objts.dd = arr[3];
		objts.hh = arr[4];
		objts.mi = arr[5];
		strts = objtostrts(objts);
		res.objts= objts;
		res.strts = strts;
		res.numts = parseInt(strts);
		return res;
	}
	if( ymdhms.test(units) ){
		arr = units.split(ymdhms); 
		objts.yy = arr[1];
		objts.mm = arr[2];
		objts.dd = arr[3];
		objts.hh = arr[4];
		objts.mi = arr[5];
		objts.ss = arr[6];
		strts = objtostrts(objts);
		res.objts= objts;
		res.strts = strts;
		res.numts = parseInt(strts);
		return res;
	}
	if( ymdhmsms.test(units) ){
		arr = units.split(ymdhmsms);
		objts.yy = arr[1];
		objts.mm = arr[2];
		objts.dd = arr[3];
		objts.hh = arr[4];
		objts.mi = arr[5];
		objts.ss = arr[6];
		objts.ms = arr[7];
		strts = objtostrts(objts);
		res.objts= objts;
		res.strts = strts;
		res.numts = parseInt(strts);
		return res;
	}
	return 'no';
}

function strtstotext(ts,fmt) {
	var dft = {yy:true,mm:true,dd:true,hh:true,mi:true,ss:true,ms:true,ymdf:'-',hmsf:':'};
	for(var kk in fmt){
		dft[kk] = fmt[kk];
	}
	var objts = strtoobjts(ts);
	var units = '';
	if(dft.yy){
		units = units+objts.yy+dft.ymdf;
	}
	if(dft.mm){
		units = units+objts.mm+dft.ymdf;
	}
	if(dft.dd){
		units = units+objts.dd;
	}
	if(dft.hh){
		if(dft.dd){
			units = units+' '+objts.hh;
		}
		else{
			units = units+objts.hh;
		}
	}
	if(dft.mi){
		units = units+dft.hmsf+objts.mi;
	}
	if(dft.ss){
		units = units+dft.hmsf+objts.ss;
	}
	if(dft.ms){
		units = units+dft.hmsf+objts.ms;
	}
	return units;
}

function objtstotext(objts,fmt) {
	var dft = {yy:true,mm:true,dd:true,hh:true,mi:true,ss:true,ms:true,ymdf:'-',hmsf:':'};
	for(var kk in fmt){
		dft[kk] = fmt[kk];
	}
	var units = '';
	if(dft.yy){
		units = units+objts.yy+dft.ymdf;
	}
	if(dft.mm){
		units = units+objts.mm+dft.ymdf;
	}
	if(dft.dd){
		units = units+objts.dd;
	}
	if(dft.hh){
		if(dft.dd){
			units = units+' '+objts.hh;
		}
		else{
			units = units+objts.hh;
		}
	}
	if(dft.mi){
		units = units+dft.hmsf+objts.mi;
	}
	if(dft.ss){
		units = units+dft.hmsf+objts.ss;
	}
	if(dft.ms){
		units = units+dft.hmsf+objts.ms;
	}
	return units;
}

function numtstotext(numts,fmt) {
	var dft = {yy:true,mm:true,dd:true,hh:true,mi:true,ss:true,ms:true,ymdf:'-',hmsf:':'};
	for(var kk in fmt){
		dft[kk] = fmt[kk];
	}
	var units = '';
	var md = new Date(numts);

	if(dft.yy){
		units = units+md.getFullYear()+dft.ymdf;
	}
	if(dft.mm){
		var mdmm = (md.getMonth()+1).toString();
		if(mdmm.length<2){mdmm = '0'+mdmm; }
		units = units+mdmm+dft.ymdf;
	}
	if(dft.dd){
		var mddd = md.getDate().toString();
		if(mddd.length<2){
			mddd = '0'+mddd;
		}
		units = units+mddd;
	}
	if(dft.hh){
		var mdhh = md.getHours().toString();
		if(mdhh.length<2){
			mdhh = '0'+mdhh;
		}
		if(dft.dd){
			units = units+' '+mdhh;
		}
		else{
			units = units+mdhh;
		}
	}
	if(dft.mi){
		var mdmi = md.getMinutes().toString();
		if(mdmi.length<2){
			mdmi = '0'+mdmi;
		}
		units = units+dft.hmsf+mdmi;
	}
	if(dft.ss){
		var mdss = md.getSeconds().toString();
		if(mdss.length<2){
			mdss = '0'+mdss;
		}
		units = units+dft.hmsf+mdss;
	}
	if(dft.ms){
		var mdms = md.getMilliseconds().toString();
		if(mdms.length<2){
			mdms = '0'+mdms;
		}
		units = units+dft.hmsf+mdms;
	}
	return units;
}

function objtostrts(objts) { 
	var oyy = '1970';
	var omm = '01';
	var strts = '0';
	var tsnega = false;

	var flag = true;
	var cuyy = '1970'; 
	var cucnt = '0';
	var runcnt = 0;
	var yyms = '31536000000';
	var xxtp= '0';
	var xxmm ='0';
	var xxdh = '0';
	var xxxmdh = '0';

	if(  ut.bnabscomp(objts.yy,oyy)=='yes'  ){
		
		while(flag){
			yyms = '31536000000';
			
			if(cucnt=='2'){ 
				yyms = '31622400000'; 
				runcnt = 0;
			}
			
			if( iszhenbai(cuyy)=='no' ){ 
				if( runcnt == 4 ){ 
					yyms = '31622400000';
				}
			}
			if( iszhenbai(cuyy)=='yes' ){  
				if( ut.bnmod(cuyy,'400')=='0' ){ 
					yyms = '31622400000'; 
				}
			}
			if( ut.bnabscomp(cucnt,'3499')=='yes' ){
				if( ut.bnmod(cucnt,'3500') == '0' ){ 
					yyms = ut.bnminus(yyms,'86400000');
				}
			}
			if(runcnt==4){runcnt =0}
			++runcnt;
			cucnt = ut.bnplus(cucnt,'1');
			cuyy = ut.bnplus(cuyy,'1'); 
			strts = ut.bnplus(strts,yyms); 
			if( ut.bnabscomp(cuyy,objts.yy)=='eq' ){
				flag = false;
			}
		}
	}

	if( ut.bnabscomp(objts.yy,oyy)=='no' ){
		tsnega = true;

		while(flag){
			yyms = '31536000000';

			if(cucnt=='1'){ 
				yyms = '31622400000'; 
				runcnt = 0;
			}
			if( iszhenbai( xxtp )=='no' ){ 
				if( runcnt == 4 ){ 
					yyms = '31622400000';
				}
			}
			if( iszhenbai(xxtp)=='yes' ){  
				if( ut.bnmod(xxtp,'400')=='0' ){ 
					yyms = '31622400000'; 
				}
			}
			if( ut.bnabscomp(cucnt,'3499')=='yes' ){
				if( ut.bnmod(cucnt,'3500') == '0' ){ 
					yyms = ut.bnminus(yyms,'86400000');
				}
			}

			++runcnt;
			cucnt = ut.bnplus(cucnt,'1');
			cuyy = ut.bnminus(cuyy,'1');
			xxtp = ut.bnminus(cuyy,'1');
			strts = ut.bnplus(strts,yyms);
			if( ut.bnabscomp( xxtp, objts.yy )=='eq' ){
				flag = false;
			}
		}
	}

	var mm02 = '2678400000';
	var mm03 = '5097600000';
	var mm04 = '7776000000';
	var mm05 = '10368000000';
	var mm06 = '13046400000';
	var mm07 = '15638400000';
	var mm08 = '18316800000';
	var mm09 = '20995200000';
	var mm10 = '23587200000';
	var mm11 = '26265600000';
	var mm12 = '28857600000';
	var isrunxxyy = isrunyy(objts.yy);
	if( isrunxxyy ){
		mm03 = ut.bnplus(mm03,'86400000');
		mm04 = ut.bnplus(mm04,'86400000');
		mm05 = ut.bnplus(mm05,'86400000');
		mm06 = ut.bnplus(mm06,'86400000');
		mm07 = ut.bnplus(mm07,'86400000');
		mm08 = ut.bnplus(mm08,'86400000');
		mm09 = ut.bnplus(mm09,'86400000');
		mm10 = ut.bnplus(mm10,'86400000');
		mm11 = ut.bnplus(mm11,'86400000');
		mm12 = ut.bnplus(mm12,'86400000');
	}
	switch(objts.mm){
		case '02':
			xxmm = mm02;
			break;
		case '03':
			xxmm = mm03;
			break;
		case '04':
			xxmm = mm04;
			break;
		case '05':
			xxmm = mm05;
			break;
		case '06':
			xxmm = mm06;
			break;
		case '07':
			xxmm = mm07;
			break;
		case '08':
			xxmm = mm08;
			break;
		case '09':
			xxmm = mm09;
			break;
		case '10':
			xxmm = mm10;
			break;
		case '11':
			xxmm = mm11;
			break;
		case '12':
			xxmm = mm12;
			break;
	}

	if( (objts.dd) && (objts.dd!='00') ){
		objts.dd = ( parseInt(objts.dd)-1).toString();
		if(objts.dd.length==1){
			objts.dd = '0'+objts.dd; 
		}

		xxxmdh = { dd:objts.dd, hh:objts.hh, mi:objts.mi, ss:objts.ss, ms:objts.ms }; 
		xxdh = rolltoms(xxxmdh);
		xxxmdh = ut.bnplus(xxmm,xxdh); 
		if(tsnega){
			if(isrunxxyy){
				xxxmdh = ut.bnminus('31622400000',xxxmdh);
			}
			else{
				xxxmdh = ut.bnminus('31536000000',xxxmdh);
			}
		}
		strts = ut.bnplus(strts,xxxmdh);
	}
	if(tsnega){
		strts = '-'+strts;
	}
	if(ntgmt){
		strts = tzminoffset(strts,ntgmt);
	}

	function iszhenbai(str) {
		if(str.length<3){
			return 'no';
		}
		if( str.slice(-2) == '00' ){
			return 'yes';
		}
		return 'no';
	}
	function isrunyy(yy) {
		var runyy = false;
		if ( iszhenbai(cuyy)=='no' ){
			if( ut.bnmod(yy,'4')=='0' ){
				runyy = true;
			}
		}
		else{
			if( ut.bnmod(cuyy,'400')=='0' ){
				runyy = true;
			}
		}
		return runyy;
	}

	return strts;
}

function numtostrts(numts) {
	return numts.toString();
}

function timeplus(ts,ms) {
	if( ut.bnisnega(ms) ){
		ms = ms.slice(1);
	}
	var r = ut.bnplus(ts,ms);
	return r;
}

function timeminus(ts,ms) {
	var r ;
	if( ut.bnisnega(ms) ){
		ms = ms.slice(1);
	}
	if( ut.bnisnega(ts) ){
		ts = ts.slice(1);
		r = '-'+ut.bnplus(ts,ms);
	}
	else{
		r = ut.bnminus(ts,ms);
	}
	return r; 
}

function timespace(ts1,ts2) {
	var ts = '0';
	var negaflag = 0;
	
	if( ut.bnisnega(ts1) ){
		++negaflag;
		ts1 =ts1.slice(1);
	}
	if( ut.bnisnega(ts2) ){
		++negaflag;
		ts2 =ts2.slice(1);
	}

	var res;
	if(negaflag ==0 || negaflag ==2){
		res = ut.bnabscomp(ts1,ts2);
		if( res=='yes' ){
			ts = ut.bnminus(ts1,ts2);
		}
		if(res =='no'){
			ts = ut.bnminus(ts2,ts1);
		}
	}
	if(negaflag ==1){
		ts = ut.bnplus(ts1,ts2);
	}
	return ts;
}

function msconv(ts) {
    var res = {yy:'0000',mm:'00',dd:'00',hh:'00',mi:'00',ss:'00',ms:'000'};
    var tsnega = false;
    var tp1,tp2,tp3,tp4,tp5,tp6,tp7,tp8,tp9,tp10,tp11,tp12;
    if( ut.bnisnega(ts) ){
    	ts = ts.slice(1);
    	tsnega = true;
    } 
    if( ut.bnabscomp(ts,'1000') == 'no' ){
    	res.ms = ts;
    }
    if( (ut.bnabscomp(ts,'60000') == 'no') && (ut.bnabscomp(ts,'999')=='yes' ) ){
        res.ss = ut.bndivis(ts,'1000');
        res.ms = ut.bnmod(ts,'1000');
        
    }
    if( (ut.bnabscomp(ts,'3600000')=='no') && (ut.bnabscomp(ts,'59999')=='yes') ){
    	res.mi = ut.bndivis(ts,'60000');
    	tp1 = ut.bnmod(ts,'60000'); 
    	if( ut.bnabscomp(tp1,'999') =='yes'){
    		res.ss = ut.bndivis( tp1,'1000');
    	}
    	if( tp1!='0' ){
    		if( ut.bnabscomp(tp1,'999')=='yes'){
    			res.ms = ut.bnmod( tp1,'1000');
    		}
    		else{
    			res.ms = tp1;
    		}
    	}
    }

    if( (ut.bnabscomp(ts,'86400000')=='no') && (ut.bnabscomp(ts,'3599999')=='yes') ){
    	res.hh = ut.bndivis(ts,'3600000');
    	tp1 = ut.bnmod(ts,'3600000');
    	tp2 = ut.bnmod(tp1,'60000'); 
    	res.mi = ut.bndivis( tp1,'60000');
    	res.ss = ut.bndivis(tp2,'1000');
    	res.ms = ut.bnmod(tp2,'1000');
    }
    if( (ut.bnabscomp(ts,'2592000000')=='no') && (ut.bnabscomp(ts,'86399999')=='yes') ){
    	res.dd = ut.bndivis(ts,'86400000');
    	tp1 = ut.bnmod(ts,'86400000');
    	tp2 = ut.bnmod(tp1,'3600000');
    	tp3 = ut.bnmod(tp2,'60000'); 
    	res.hh = ut.bndivis(tp1,'3600000');
    	res.mi = ut.bndivis(tp2,'60000');
    	res.ss = ut.bndivis(tp3,'1000');
    	res.ms = ut.bnmod(tp3,'1000');

    }
    if( (ut.bnabscomp(ts,'31104000000')=='no') && (ut.bnabscomp(ts,'2591999999')=='yes') ){
    	res.mm = ut.bndivis(ts,'2592000000');
    	tp1 = ut.bnmod(ts,'2592000000'); 
    	tp2 = ut.bnmod(tp1,'86400000'); 
    	tp3 = ut.bnmod(tp2,'3600000'); 
    	tp4 = ut.bnmod(tp3,'60000');  
    	res.dd = ut.bndivis(tp1,'86400000');
    	res.hh = ut.bndivis(tp2,'3600000');
    	res.mi = ut.bndivis(tp3,'60000');
    	res.ss = ut.bndivis(tp4,'1000');
    	res.ms = ut.bnmod(tp4,'1000');
    }
    if( (ut.bnabscomp(ts,'31536000000')=='yes') ){
    	res.yy = ut.bndivis(ts,'31536000000');
    	tp5 = ut.bnmod(ts,'31536000000');
    	tp1 = ut.bnmod(tp5,'2592000000');
    	tp2 = ut.bnmod(tp1,'86400000'); 
    	tp3 = ut.bnmod(tp2,'3600000');
    	tp4 = ut.bnmod(tp3,'60000'); 
    	res.mm = ut.bndivis(tp5,'2592000000');
    	res.dd = ut.bndivis(tp1,'86400000');
    	res.hh = ut.bndivis(tp2,'3600000');
    	res.mi = ut.bndivis(tp3,'60000');
    	res.ss = ut.bndivis(tp4,'1000');
    	res.ms = ut.bnmod(tp4,'1000');
    }
    if(res.yy.length==1){
    	res.yy = '000'+res.yy;
    }
    if(res.yy.length==2){
    	res.yy = '00'+res.yy;
    }
    if(res.yy.length==3){
    	res.yy = '0'+res.yy;
    }
    if(res.mm.length<2){
		res.mm = '0'+res.mm;
	}
    if(res.dd.length<2){
		res.dd = '0'+res.dd;
	}
    if(res.hh.length<2){
		res.hh = '0'+res.hh;
	}
    if(res.mi.length<2){
		res.mi = '0'+res.mi;
	}
    if(res.ss.length<2){
    	res.ss = '0'+res.ss;
    }
    if(res.ms.length==1){
    	res.ms = '00'+res.ms;
    }
    if(res.ms.length==2){
    	res.ms = '0'+res.ms;
    }
    return res;
}


function msconvto(ts,fmt) {
	var res = {cnt:'0',ret:'0',code:'yes'};

	if(fmt =='ss'){
		if( ut.bnabscomp(ts,'999') =='yes'){
    		res.cnt = ut.bndivis( ts,'1000');
    		res.ret = ut.bnmod(ts,'1000');
    	}
    	else{
    		res.ret = ts;
    	}
	}

	if(fmt == 'mi'){
		if( ut.bnabscomp(ts,'59999')=='yes' ){
			res.cnt = ut.bndivis( ts,'60000');
    		res.ret = ut.bnmod(ts,'60000');
		}
		else{
			res.ret = ts;
		}
	}

	if(fmt == 'hh'){
		if(ut.bnabscomp(ts,'3599999')=='yes'){
			res.cnt = ut.bndivis( ts,'3600000');
    		res.ret = ut.bnmod(ts,'3600000');
		}
		else{
			res.ret = ts;
		}
	}

	if(fmt == 'dd'){
		if( ut.bnabscomp(ts,'86399999')=='yes' ){
			res.cnt = ut.bndivis(ts,'86400000');
			res.ret = ut.bnmod(ts,'86400000');
		}
		else{
			res.ret = ts;
		}
	}

	if(fmt == 'mm'){
		if( ut.bnabscomp(ts,'2591999999')=='yes' ){
			res.cnt = ut.bndivis(ts,'2592000000');
			res.ret = ut.bnmod(ts,'2592000000');
		}
		else{
			res.ret = ts;
		}
	}

	if(fmt == 'yy'){
		if( ut.bnabscomp(ts,'31535999999')=='yes' ){
			res.cnt = ut.bndivis(ts,'31536000000');
			res.ret = ut.bnmod(ts,'31536000000');
		}
		else{
			res.ret = ts;
		}
	}
	return res;
}


function rolltoms(o) {
	var strts = '0';
	var yyms='0',mmms='0',ddms='0',hhms='0',mims='0',ssms='0',msms='0';
	if(o.yy){
		o.yy = cutzero(o.yy);
		yyms = ut.bnmultip(o.yy,'31536000000');
	}
	if(o.mm){
		o.mm = cutzero(o.mm);
		mmms = ut.bnmultip(o.mm,'2592000000');
	}
	if(o.dd){
		o.dd = cutzero(o.dd);
		ddms = ut.bnmultip(o.dd,'86400000'); 
	}
	if(o.hh){
		o.hh = cutzero(o.hh);
		hhms = ut.bnmultip(o.hh,'3600000');
	}
	if(o.mi){
		o.mi = cutzero(o.mi);
		mims = ut.bnmultip(o.mi,'60000');
	}
	if(o.ss){
		o.ss = cutzero(o.ss); 
		ssms = ut.bnmultip(o.ss,'1000');
	}
	if(o.ms){
		o.ms = cutzero(o.ms);
		msms = o.ms;
	}

	strts = ut.bnplus(strts,yyms);
	strts = ut.bnplus(strts,mmms);
	strts = ut.bnplus(strts,ddms);
	strts = ut.bnplus(strts,hhms);
	strts = ut.bnplus(strts,mims);
	strts = ut.bnplus(strts,ssms);
	strts = ut.bnplus(strts,msms);

	function cutzero(numtr) {		
		if( (numtr.length>1)&&( numtr.charAt(0)=='0' ) ){
			var ind =0;
			for (var k = 0; k < numtr.length; k++) {
				if( numtr.charAt(k) != '0'){
					ind = k;
					break;
				}
			}
			numtr = numtr.substr(ind);
		}
		return numtr;	
	}
	return strts;
}

//设置时区
function tzset(tz) {
	switch(tz){
		case 'WE0':
			ntgmt = '0';
			break;
		case 'E1':
			ntgmt = '60';
			break;
		case 'E2':
			ntgmt = '120';
			break;
		case 'E3':
			ntgmt = '180';
			break;
		case 'E4':
			ntgmt = '240';
			break;
		case 'E5':
			ntgmt = '300';
			break;
		case 'E6':
			ntgmt = '360';
			break;
		case 'E7':
			ntgmt = '420';
			break;
		case 'E8':
			ntgmt = '480';
			break;
		case 'E9':
			ntgmt = '540';
			break;
		case 'E10':
			ntgmt = '600';
			break;
		case 'E11':
			ntgmt = '660';
			break;
		case 'E12':
			ntgmt = '720';
			break;
		case 'W1':
			ntgmt = '-60';
			break;
		case 'W2':
			ntgmt = '-120';
			break;
		case 'W3':
			ntgmt = '-180';
			break;
		case 'W4':
			ntgmt = '-240';
			break;
		case 'W5':
			ntgmt = '-300';
			break;
		case 'W6':
			ntgmt = '-360';
			break;
		case 'W7':
			ntgmt = '-420';
			break;
		case 'W8':
			ntgmt = '-480';
			break;
		case 'W9':
			ntgmt = '-540';
			break;
		case 'W10':
			ntgmt = '-600';
			break;
		case 'W11':
			ntgmt = '-660';
			break;
		case 'W12':
			ntgmt = '-720';
			break;		
	}
}


function tzmiset(offset) {
	ntgmt = offset;
}

function tzcityset(city) {
	var arr = [
		{city:'beijing',offset:'480'},
		{city:'hongkong',offset:'480'},
		{city:'honolulu',offset:'-600'},
		{city:'alaska',offset:'-480'},
		{city:'sanfrancisco',offset:'-480'},
		{city:'henei',offset:'420'},
		{city:'huzhiming',offset:'420'},
		{city:'dubai',offset:'240'},
		{city:'kabul',offset:'240'},
		{city:'cairo',offset:'120'},
		{city:'seoul',offset:'540'},
		{city:'moscow',offset:'180'}
	];

	for (var i = 0; i < arr.length; i++) {
		if(city == arr[i].city){
			ntgmt = arr[i].offset;
		}
	}
}



/* 工具函数 */
// 自己设置时间源
function resetnow(strts) {
	ntstrts = strts;
}

function getnow(){
	if(ntstrts){
		return false;
	}
	else{
		return ntstrts;
	}	
}

//处理加上应有的 gmt时区偏移
function tzaddoffset(ts,gmt) {
	var tp2;
	if(gmt){
		var negaflag = false;
		if( ut.bnisnega(gmt) ){
			gmt = gmt.slice(1);
			negaflag = true;
		}
		tp2 = rolltoms({mi:gmt});
		if(negaflag){ tp2 = '-'+tp2; }
		tp2 = ut.bnplus(ts,tp2);
	}
	else{ tp2 = ts; }
	return tp2;
}

//去掉gmt时区的影响
function tzminoffset(ts,gmt) {
	var res;
	var tp;
	if(gmt){
		var negaflag = false;
		if( ut.bnisnega(gmt) ){
			gmt = gmt.slice(1);
			negaflag = true;
		}
		tp = rolltoms({mi:gmt});
		if(negaflag){
			res = ut.bnplus(ts,tp);
		}
		else{
			res = ut.bnminus(ts,tp);
		}
	}
	else{ res = ts; }
	return res;
}

// 匿名函数 用来启用时间的记时器
;(function () {
	var interts = setInterval(function () {
		if( getnow() ){
			ntstrts = ut.bnplus( getnow(),'500' );
		}
	}, 500);
})();


// 大数加法
function bnplus(a1,a2){

	var negaflag = 0;
	var a1nega = false;
	var a2nega = false;
	if( bnisnega(a1) ){
		++negaflag;
		a1 = a1.slice(1);
		a1nega = true;
	}
	if( bnisnega(a2) ){
		++negaflag;
		a2 = a2.slice(1);
		a2nega = true;
	}

	if(negaflag == 1){
		if( bnabscomp(a1,a2) =='eq' ){
			return '0';
		}
		if (bnabscomp(a1,a2) =='yes'){
			if(a1nega){
				return '-'+bnminus(a1,a2);
			}
			else{
				return bnminus(a1,a2);
			}
		}
		if( bnabscomp(a1,a2)=='no' ){
			if(a1nega){
				return bnminus(a2,a1);
			}
			else{
				return '-'+bnminus(a2,a1);
			}
		}
	}

	if ( a1.length > a2.length ){
		var tp1 = a1;
		a1 = a2;
		a2 = tp1;
	}
	var ar1 = a1.split('');
	var ar2 = a2.split('');
	var carryflag = 0; 
	var rstr = ''; 
	var secnum; 
	var secstr; 
	(function () {
	var tp2 = 0; 
	for(var i = (a1.length-1);i>=0;i-- ){
		++tp2;	
		(function () {
		var tp3 = 0;
		var tp4 = false; 
		var tp5 = false; 
		for(var j = (a2.length-1);j>=0;j--){
			++tp3;
			if(tp2 == tp3){
				if(i==0){
					tp4 = true;
				}
				else{
					secnum = parseInt(ar1[i])+parseInt(ar2[j])+carryflag;
					secstr = secnum.toString();
					if(secstr.length>1){
						secstr = secstr.substr(-1);
						carryflag = 1;
					}
					else{
						carryflag = 0;
					}
					rstr = secstr+rstr;
				}
			}
			if(tp4){
				if(tp5){
					secnum = parseInt(ar2[j])+carryflag;
				}
				else{
					secnum = parseInt(ar1[i])+parseInt(ar2[j])+carryflag;
					tp5 = true;
				}
				secstr = secnum.toString();
				if(j == 0){ 
					rstr = secstr+rstr;
				}
				else{
					if(secstr.length>1){
						secstr = secstr.substr(-1);
						carryflag = 1;
					}
					else{
						carryflag = 0;
					}
					rstr = secstr+rstr;
				}	
			}
		}
		})();
	}
	})();

	if(negaflag==2){
		return '-'+rstr;
	}
	else{
		return rstr;
	}	
}


//大数减法
function bnminus(a1,a2) {

	var negaflag = 0;
	var a1nega = false;
	var a2nega = false;
	if( bnisnega(a1) ){
		++negaflag;
		a1 = a1.slice(1);
		a1nega = true;
	}
	if( bnisnega(a2) ){
		++negaflag;
		a2 = a2.slice(1);
		a2nega = true;
	}

	if(negaflag==0){
	 	if( bnabscomp(a1,a2)=='eq' ){
	 		return '0';
	 	}
	 	if( bnabscomp(a1,a2)=='no' ){
	 		return '-'+bnminus(a2,a1);
	 	}
	}

	
	if(negaflag ==1){
		return '-'+bnplus(a1,a2);
	}
 
	if( negaflag ==2 ){
		if( bnabscomp(a1,a2)=='eq' ){
			return '0';
		}
		if( bnabscomp(a1,a2)=='yes' ){
			return '-'+bnminus(a1,a2);
		}
		if( bnabscomp(a1,a2)=='no' ){
			return bnminus(a2,a1);
		}
	}
	
	var ar1 = a1.split('');
	var ar2 = a2.split('');
	var carryflag = 0; 
	var rstr = '';
	var secnum;
	var secstr;
	(function () {
		var tp2 = 0;
		for(var i = (a2.length-1);i>=0;i-- ){
			++tp2;
			(function () {
				var tp3 =0;
				var tp4 = false; 
				var tp5 = false; 
				var tpa1,tpa2; 
				for(var j = (a1.length-1);j>=0;j--){
					++tp3;
					if(tp3 == tp2){ 
						if(i==0){
							tp4 = true;
						}
						else{
							tpa1 = parseInt(ar1[j])-carryflag;
							tpa2 = parseInt(ar2[i]);
							if(tpa1>=tpa2){
								secnum = tpa1-tpa2;
								carryflag = 0;
							}
							else{
								secnum = tpa1+10-tpa2;
								carryflag = 1;
							}
							secstr = secnum.toString(); 
							rstr = secstr+rstr;
						}
					}
					if(tp4){	
						tpa1 = parseInt(ar1[j])-carryflag;					
						tpa2 = parseInt(ar2[i]); 
						if(tp5){
							if(tpa1<0){
								secnum = 9;
								carryflag = 1;
							}
							else{
								secnum = tpa1;
								carryflag = 0;
							}
						}
						else{							
							if(tpa1>=tpa2){ 
								secnum = tpa1-tpa2;
								carryflag = 0;
							}
							else{
								secnum = tpa1+10-tpa2;
								carryflag = 1;
							}
							tp5 = true;
						}

						secstr = secnum.toString();
						if(j==0){
							if(secstr != '0'){
								rstr = secstr+rstr;
							}
						}
						else{
							rstr = secstr+rstr;
						}
					}
				}
			})();
		}
	})();
	if( (rstr.length>1)&&( rstr.charAt(0)=='0' ) ){
		var ind =0;
		for (var k = 0; k < rstr.length; k++) {
			if( rstr.charAt(k) != '0'){
				ind = k;
				break;
			}
		}
		rstr = rstr.substr(ind);
	}	
	return rstr;
}

// 大数乘法  //不支持乘以小数
function bnmultip(a1,a2){

	var regexp = /^0+$/;
	if( regexp.test(a1) || regexp.test(a2) ){
		return '0';
	}

	var comp = bnabscomp(a1,a2);
	if(comp == 'no'){
		var tp1 = a1;
		a1 = a2;
		a2 = tp1;
	}

	var ar1 = a1.split('');
	var ar2 = a2.split('');

	var carryflag = 0; 
	var rstr = ''; 
	var secstr = '';
	var cellnum; 
	var cellstr; 
	var tp2 =0;

	(function () {
		for (var i = (ar2.length-1);i>=0;i--) {
			++tp2;
			secstr = '';

			for(var j = (ar1.length-1);j>=0;j--){
				if( parseInt(ar2[i]) ==0 ){
					secstr = '0';
				}
				else{
					cellnum = parseInt(ar2[i])*parseInt(ar1[j])+parseInt(carryflag);
					cellstr = cellnum.toString();
					carryflag = 0;
					if(cellstr.length>1){
						if(j==0){
							carryflag = 0;
						}
						else{
							carryflag = cellstr.substr(0,1);
							cellstr = cellstr.substr(-1);
						}
					}
					secstr = cellstr+secstr;
					if(j==0){
						for (var k = 0; k < (tp2-1); k++) {
							secstr = secstr+'0';
						}
					}
				}
			}
			if(secstr!='0'){
				if(rstr){
					rstr = bnplus(rstr,secstr);					
				}
				else{
					rstr = secstr;
				}
				
			}
		}
	})();

	return rstr;
}

function bndivis(a1,a2) {
	var comp = bnabscomp(a1,a2); 
	if(comp=='no'){
		return '0';
	}
	if(comp =='eq'){
		return '1';
	}
	var flag = true; 
	var cnt = '0';
	var tp; 
	while(flag){
		if(!tp){
			tp = bnminus(a1,a2);
		}
		else{
			tp = bnminus(tp,a2);
		}
		
		cnt = bnplus(cnt,'1');
		if( bnabscomp(tp,a2) == 'no' ){
			flag = false;
		}
	}
	return cnt;
}

function bnmod(a1,a2) {
	var comp = bnabscomp(a1,a2); 
	if(comp=='no'){
		return a1;
	}
	if(comp =='eq'){
		return '0';
	}
	var flag = true;
	var tp; 
	while(flag){
		if(!tp){
			tp = bnminus(a1,a2);
		}
		else{
			tp = bnminus(tp,a2);
		}
		if( bnabscomp(tp,a2) == 'no' ){
			flag = false;
		}
		if( bnabscomp(tp,a2) == 'eq' ){
			tp = '0';
			flag = false;
		}
	}
	return tp;
}

function bnisnega(str){
	var res = false;
	if( str.charAt(0) == '-' ){
		res = true;
	}
	return res;
}

function bnabscomp(a1,a2){
	var res;
	if( bnisnega(a1) ){
		a1 = a1.slice(1);
	}
	if( bnisnega(a2) ){
		a2 = a2.slice(1);
	} 
	if(a1.length>a2.length){
		res = 'yes';
	}
	if(a1.length<a2.length){
		res = 'no';
	}
	if(a1.length == a2.length){
		var ar1 = a1.split('');
		var ar2 = a2.split('');
		var tpa1,tpa2; 
		for(var i =0;i<(ar1.length);i++){
			tpa1 = parseInt(ar1[i]);
			tpa2 = parseInt(ar2[i])
			if( tpa1 > tpa2 ){
				res = 'yes';
				break;
			}
			if(tpa1 < tpa2){
				res = 'no';
				break;
			}
			if(tpa1 == tpa2){
				res = 'eq';
				continue;
			}
		}
	}
	return res;
}
