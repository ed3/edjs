(function (){
	var $=window.$=function(s){
		return new EdJS(s);
	};
	EdJS=function(s){
		var i,n,t;
		if(typeof s==='string'){
			var sels=s.split(/\s*,\s*/);
			var nod=[];
			for(i=0,n=sels.length;i<n;i++){
			t=document.querySelectorAll(sels[i]);
			for(var j=0,k=t.length;j<k;j++) nod.push(t[j]);
			}
			for(i=0,n=nod.length;i<n;i++) this[i]=nod[i];
			if(!this[0]) this[0]=s;
			this.length=nod.length;
		}else if(typeof s==='object'){
			if(s instanceof Array){
			for(i=0,n=s.length;i<n;i++) this[i]=s[i];
			this.length=s.length;
			}else{
			this[0]=s;
			this.length=1;
			}
		}
	};
	EdJS.prototype={
	ready:function(fn){
		if(document.attachEvent && document.readyState != 'loading'){
		document.attachEvent('onreadystatechange',function(){fn()});
		} else {
		document.addEventListener('DOMContentLoaded',fn);
		}
	},
	each:function(cb){
		for(var i=0;i<this.length;i++){
		cb.call(this[i],i,this);
		}
		return this;
	},
	focus:function(){
		return this[0].focus();
	},
	text:function(txt){
		if(typeof txt === 'string') return this.each(function(){this.firstChild.nodeValue=txt;});
		else return this[0].firstChild.nodeValue;
	},
	html:function(html){
		var htm=null;
		if(typeof html==='object') htm=html[0].innerHTML;
		else if(typeof html==='string') htm=html;
		else return this[0].innerHTML;
		return this.each(function(){this.innerHTML+=htm;});
	},
	val:function(v){
		if(typeof v !== "undefined") return this.each(function(){this.value=v;});
		else return this[0].value;
	},
	prop:function(atr,v){
		if(typeof v !== 'undefined') return this.each(function(){this.setAttribute(atr,v);});
		else return this[0].getAttribute(atr);
	},
	css:function(name,v){
		if(typeof v !== 'undefined') return this.each(function(){this.style[name]=v;});
		else return this[0].style[name];
	},
	hasClass:function(cls){
		var cs=[];
		this.each(function(){
		cs=cs.concat(this.className.split(' '));
		});
		return $.inArray(cls,cs);
	},
	addClass:function(cls){
		return this.each(function(){
		var cs=this.className.split(' '),ar=[];
		for(var c in cs) {
		if(cs[c]!="") ar.push(cs[c]);
		}
		ar.push(cls);
		this.className=ar.join(' ');
		});
	},
	removeClass:function(cls){
		return this.each(function(){
		var cs=this.className.split(' '),cl=cls.split(' '),ar=[];
		for(var c in cs) {
		if(cs[c]!="" && !$.inArray(cs[c],cl)) ar.push(cs[c]);
		}
		this.className=ar.join(' ');
		});
	},
	show:function(){
		return this.each(function(){this.style.display='block';});
	},
	hide:function(){
		return this.each(function(){this.style.display='none';});
	},
	remove:function(){
		return this.each(function(){this.parentNode.removeChild(this);});
	},
	append:function(a){
		return this.each(function(){
		if(typeof a==='object') this.appendChild(a[0].cloneNode(true));
		else this.innerHTML=this.innerHTML+a;
		});
	},
	prepend:function(a){
		return this.each(function(){
		if(typeof a==='object') this.insertBefore(a[0].cloneNode(true),this.firstChild);
		else this.innerHTML=a+this.innerHTML;
		});
	},
	after:function(a){
		return this.each(function(){
		if(typeof a==='object') a=a[0];
		else if(typeof a==='string') a=_htmlToEl(a);
		this.parentNode.insertBefore(a.cloneNode(true), this.nextSibling);
		});
	},
	before:function(a){
		return this.each(function(){
		if(typeof a==='object') a=a[0];
		else if(typeof a==='string') a=_htmlToEl(a);
		this.parentNode.insertBefore(a.cloneNode(true), this);
		});
	},
	insertAfter:function(a){
		return this.each(function(){
		a=document.querySelector(a);
		a.parentNode.insertBefore(this.cloneNode(true), a.nextSibling);
		});
	},
	insertBefore:function(a){
		return this.each(function(){
		a=document.querySelector(a);
		this.parentNode.insertBefore(a.cloneNode(true), this);
		});
	},
	clone:function(v){
		return this.each(function(){this.cloneNode(v===true);});
	},
	_new:function(fn){
		var i,n,obj=fn.call(this);
		for(i=0;i<this.length;i++) delete this[i];
		this.length=obj.length;
		for(i=0,n=this.length;i<n;i++) this[i]=obj[i];
		return this;
	},
	eq:function(idx){
		return this._new(function(){
		return [this[idx]];
		});
	},
	find:function(v){
		return this._new(function(){
		var arr=[];
		this.each(function(){
		var t=document.querySelectorAll(v);
		for(var j=0,k=t.length;j<k;j++) arr.push(t[j]);
		});
		return arr;
		});
	},
	parent:function(){
		return this._new(function(){
		var arr=[];
		this.each(function(){
		var o=_in(this,'parentNode');
		if(o) arr.push(o);
		});
		return arr;
		});
	},
	parents:function(s){
		return this._new(function(){
		var els=[];
		this.each(function(){
		if(typeof s === 'undefined'){
		var el=this;
		for(;el && el !== document;el=_in(el,'parentNode')){
		if(el!=this && !$.inArray(el,els)) els.push(el);
		}
		}else{els=document.querySelectorAll(s);}
		});
		return els;
		});
	},
	next:function(){
		return this._new(function(){
		var arr=[];
		this.each(function(){
		var o=_in(this,'nextSibling');
		if(o) arr.push(o);
		});
		return arr;
		});
	},
	prev:function(){
		return this._new(function(){
		var arr=[];
		this.each(function(){
		var o=_in(this,'previousSibling');
		if(o) arr.push(o);
		});
		return arr;
		});
	},
	toggle:function(){
		return this.each(function(){this.style.display=(this.style.display==='none'?'block':'none');});
	},
	toggleClass:function(cls){
		return this.each(function(){
		var cs=this.className.split(' '),ar=[];
		if($.inArray(cls,cs)){
			for(var c in cs){if(cs[c]!="" && cs[c]!=cls) ar.push(cs[c]);}
		}else{
			for(var c in cs){if(cs[c]!="") ar.push(cs[c]);}
			ar.push(cls);
		}
		this.className=ar.join(' ');
		});
	},
	hover:function(fnOver,fnOut){
		this.on('mouseover',fnOver);
		this.on('mouseout',fnOut);
	},
	fadeIn:function(speed,fn){
		return this.each(function(){
		var op=0.1,el=this.style;
		el.display='block';
		if(typeof speed==='undefined') speed=500;
		var timer=setInterval(function(){
		if(op >= 1) {clearInterval(timer);if(typeof fn!=='undefined') fn.call(this);}
		el.opacity=op;
		el.filter='alpha(opacity='+op*100+')';
		op += op*0.1;
		}, speed/50);
		});
	},
	fadeOut:function(speed,fn) {
		return this.each(function(){
		var op=1,el=this.style;
		if(typeof speed==='undefined') speed=500;
		var timer=setInterval(function(){
		if(op <= 0.1){clearInterval(timer);el.display='none';if(typeof fn!=='undefined') fn.call(this);}
		el.opacity=op;
		el.filter='alpha(opacity='+op*100+')';
		op -= op*0.1;
		}, speed/50);
		});
	},
	on:function(ev,fn){
		return this.each(function(){this["on" + ev]=fn;});
	},
	off:function(ev,fn){
		return this.each(function(){this["on" + ev]=null;});
	}
	};
	$.isArray=function(o){
		return (o instanceof Array);
	};
	$.inArray=function(key, arr){
		for(var i=0;i<arr.length;i++){
		if(arr[i] === key) return true;
		}
		return false;
	};
	$.isJson=function(str){
	try {JSON.parse(JSON.stringify(str));} catch(e) {return false;}
	return true;
	}
	$.ajax=function(opt){
		opt.type=(opt.type || 'GET').toUpperCase();
		opt.async=opt.async != null ? opt.async : true;
		var xhr=window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
		var status = xhr.status;
		if (status >= 200 && status < 300) {
			opt.success && opt.success(xhr.responseText, xhr.responseXML);
		} else {
			opt.fail && opt.fail(status);
		}
		}
		}
		if($.isJson(opt.data)){
		var arr=[];
		for (var name in opt.data) arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(opt.data[name]));
		opt.data = arr.join("&");
		}
		if (opt.type == "GET") {
			xhr.open("GET", opt.url + "?" + opt.data, opt.async);
			xhr.send(null);
			} else if (opt.type == "POST") {
			xhr.open("POST", opt.url, opt.async);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(opt.data);
		}
	};
	$.get=function(url, data, success) {
		$.ajax({url:url,type:'GET',data:data,success:success});
	},
	$.post=function(url, data, success) {
		$.ajax({url:url,type:'POST',data:data,success:success});
	}
	function _htmlToEl(tag){
		var d=document.createElement('div');
		d.innerHTML=tag;
		return d.firstChild;
	}
	function _in(el,rel){
		el=el[rel];
		while(el && el.nodeType !== 1) el=el[rel];
		if(el) return el;
		return false;
	}
})();