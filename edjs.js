(function(){
var $=window.$=function(s){return new EdJS(s);},EdJS=function(s){
	var i,n,t;
	this.length=0;
	if(typeof s==="function"){
		document.readyState==="loading" ? document.addEventListener("DOMContentLoaded",s):s();
	}else if(typeof s==="string"){
		try{
			t=document.querySelectorAll(s);n=t.length;
			for(i=0;i<n;i++) this[i]=t[i];
			this.length=n;
		}catch(e){
			var ph=$.parseHTML(s);
			if(ph.nodeType===11){
				n=ph.childNodes.length;
				for(i=0;i<n;i++) this[i]=ph.childNodes[i];
				this.length=n;
			}else{
				this[0]=ph;
				this.length=1;
			}
		}
	}else if(typeof s==="object"){
		if(s instanceof NodeList||s instanceof HTMLCollection||$.isArray(s)){
			n=s.length;
			for(i=0;i<n;i++) this[i]=s[i];
			this.length=n;
		}else{
			this[0]=s;
			this.length=1;
		}
	}
};
EdJS.prototype={
	constructor:EdJS,
	each:function(cb){
		for(var i=0;i<this.length;i++) cb.call(this[i],i,this);
		return this;
	},
	focus:function(){
		return this.each(function(){this.focus();});
	},
	text:function(a){
		if(a!==undefined){
			return this.each(function(){this.textContent=a;});
		}else{
			return this.length>0 ? this[0].textContent:"";
		}
	},
	html:function(a){
		if(a!==undefined){
			var h=null;
			if(typeof a==="object" && a instanceof EdJS){
				h=a[0] ? a[0].innerHTML:"";
			}else if(typeof a==="string"){
				h=a;
			}
			return this.each(function(){this.innerHTML=h;});
		}else{
			return this.length>0 ? this[0].innerHTML:"";
		}
	},
	val:function(v){
		if(v!==undefined){
			return this.each(function(){this.value=v;});
		}else{
			return this.length>0 ? this[0].value:undefined;
		}
	},
	attr:function(a,v){
		if(typeof a==="object"){
			return this.each(function(){for(var k in a){this.setAttribute(k,a[k]);}});
		}
		if(v!==undefined){
			return this.each(function(){this.setAttribute(a,v);});
		}else{
			return this.length>0 ? (this[0].hasAttribute(a) ? this[0].getAttribute(a):undefined):undefined;
		}
	},
	removeAttr:function(a){
		return this.each(function(){
			var i,as=a.split(" ");
			for(i=0;i<as.length;i++){if(as[i]) this.removeAttribute(as[i]);}
		});
	},
	prop:function(a,v){
		if(typeof a==="object"){
			return this.each(function(){for(var key in a){this[key]=a[key];}});
		}
		if(v!==undefined){
			return this.each(function(){this[a]=v;});
		}else{
			return this.length>0 ? this[0][a]:undefined;
		}
	},
	removeProp:function(a){
		return this.each(function(){try{delete this[a];}catch(e){}});
	},
	css:function(a,v){
		if(typeof a==='string' && v===undefined){
			return this.length>0 ? getComputedStyle(this[0])[a]:'';
		}
		if(typeof a==='object' && a!==null){
			return this.each(function(){for(var prop in a){if(a[prop]) this.style[prop]=a[prop];}});
		}
		if(typeof a==='string' && v!==undefined){
			return this.each(function(){this.style[a]=v;});
		}
		return this;
	},
	hasClass:function(a){
		for(var i=0;i<this.length;i++){if(this[i].classList.contains(a)) return true;}
		return false;
	},
	addClass:function(a){
		return this.each(function(){
			var i,cls=a.split(" ");
			for(i=0;i<cls.length;i++){if(cls[i]) this.classList.add(cls[i]);}
		});
	},
	removeClass:function(a){
		return this.each(function(){
			var i,cls=a.split(" ");
			for(i=0;i<cls.length;i++){if(cls[i]) this.classList.remove(cls[i]);}
			if(this.classList.length===0) this.removeAttribute("class");
		});
	},
	show:function(){
		return this.each(function(){
			this.style.display="";
			if(getComputedStyle(this).display==="none") this.style.display="";
		});
	},
	hide:function(){
		return this.each(function(){this.style.display="none";});
	},
	remove:function(){
		return this.each(function(){if(this.parentNode) this.parentNode.removeChild(this);});
	},
	empty:function(){
		return this.each(function(){this.innerHTML="";});
	},
	get:function(a){
		if(a===undefined){
			var i,el=[];
			for(i=0;i<this.length;i++) el.push(this[i]);
			return el;
		}
		return this[a];
	},
	is:function(a){
		if(!a) return false;
		for(var i=0;i<this.length;i++){if(this[i].matches(a)) return true;}
		return false;
	},
	append:function(a){
		return this.each(function(){
			if(typeof a==="object" && a instanceof EdJS){
				this.appendChild(a[0].cloneNode(true));
			}else if(typeof a==="object" && (a.nodeType||a instanceof NodeList)){
				if(a.nodeType){
					this.appendChild(a.cloneNode(true));
				}else if(a instanceof NodeList){
					for(var i=0;i<a.length;i++) this.appendChild(a[i].cloneNode(true));
				}
			}else if(typeof a==="string"){
				this.innerHTML+=a;
			}
		});
	},
	prepend:function(a){
		return this.each(function(){
			if(typeof a==="object" && a instanceof EdJS){
				this.insertBefore(a[0].cloneNode(true),this.firstChild);
			}else if(typeof a==="object" && (a.nodeType||a instanceof NodeList)){
				if(a.nodeType){
					this.insertBefore(a.cloneNode(true),this.firstChild);
				}else if(a instanceof NodeList){
					for(var i=a.length-1;i>=0;i--) this.insertBefore(a[i].cloneNode(true),this.firstChild);
				}
			}else if(typeof a==="string"){
				this.innerHTML=a+this.innerHTML;
			}
		});
	},
	after:function(a){
		return this.each(function(){_ins(this,a,this.nextSibling);});
	},
	before:function(a){
		return this.each(function(){_ins(this,a,this);});
	},
	insertAfter:function(a){
		var el=$(a);
		if(el.length>0){
			return this.each(function(){
				var self=this;
				el.each(function(){if(this.parentNode) this.parentNode.insertBefore(self.cloneNode(true),this.nextSibling);});
			});
		}
		return this;
	},
	insertBefore:function(a){
		var el=$(a);
		if(el.length>0){
			return this.each(function(){
				var self=this;
				el.each(function(){if(this.parentNode) this.parentNode.insertBefore(self.cloneNode(true),this);});
			});
		}
		return this;
	},
	appendTo:function(a){
		var el=$(a);
		if(el.length>0){
			return this.each(function(){
				var self=this;
				el.each(function(){this.appendChild(self.cloneNode(true));});
			});
		}
		return this;
	},
	prependTo:function(a){
		var el=$(a);
		if(el.length>0){
			return this.each(function(){
				var self=this;
				el.each(function(){this.insertBefore(self.cloneNode(true),this.firstChild);});
			});
		}
		return this;
	},
	clone:function(a){
		var el=[];
		this.each(function(){el.push(this.cloneNode(a===true));});
		return $(el);
	},
	eq:function(a){
		return $(this[a]);
	},
	find:function(a){
		return _new(this,function(){
			var el=[];
			this.each(function(){
				var i,match=this.querySelectorAll(a),n=match.length;
				for(i=0;i<n;i++){if(el.indexOf(match[i])===-1) el.push(match[i]);}
			});
			return el;
		});
	},
	first:function(){
		return _new(this,function(){return this.length>0 ? [this[0]]:[];});
	},
	last:function(){
		return _new(this,function(){return this.length>0 ? [this[this.length-1]]:[];});
	},
	has:function(a){
		return _new(this,function(){
			var el=[];
			this.each(function(){if(this.querySelectorAll(a).length>0) el.push(this);});
			return el;
		});
	},
	index:function(a){
		if(this.length===0) return -1;
		var el=this[0];
		if(a===undefined){
			var parent=el.parentNode;
			if(!parent) return -1;
			var i,sbl=parent.children;
			for(i=0;i<sbl.length;i++){if(sbl[i]===el) return i;}
			return -1;
		}
		if(typeof a==="string"){
			var j,els=$(a);
			for(j=0;j<els.length;j++){if(els[j]===el) return j;}
			return -1;
		}
		var tEl=a instanceof EdJS ? a[0]:a;
		if(tEl){
			for(var l=0;l<this.length;l++){if(this[l]===tEl) return l;}
		}
		return -1;
	},
	closest:function(a){
		return _new(this,function(){
			var cEl=[];
			this.each(function(){
				var el=this;
				while(el && el!==document){
					if(el.matches(a)){
					if(cEl.indexOf(el)===-1) cEl.push(el);
					break;
					}
					el=el.parentNode;
				}
			});
			return cEl;
		});
	},
	height:function(a){
		if(a===undefined) return this.length>0 ? this[0].offsetHeight:0;
		var v=typeof a==='number'?a+'px':a;
		return this.each(function(){this.style.height=v;});
	},
	width:function(a){
		if(a===undefined) return this.length>0 ? this[0].offsetWidth:0;
		var v=typeof a==='number'?a+'px':a;
		return this.each(function(){this.style.width=v;});
	},
	innerWidth:function(){
		if(this.length===0) return 0;
		var el=this[0];
		if(el===window) return window.innerWidth;
		if(el===document) return document.documentElement.clientWidth;
		return el.clientWidth;
	},
	innerHeight:function(){
		if(this.length===0) return 0;
		var el=this[0];
		if(el===window) return window.innerHeight;
		if(el===document) return document.documentElement.clientHeight;
		return el.clientHeight;
	},
	outerWidth:function(a){
		if(this.length===0) return 0;
		var el=this[0];
		if(el===window) return window.outerWidth;
		if(el===document) return document.documentElement.clientWidth;
		var size=el.offsetWidth;
		if(a===true){
			var style=getComputedStyle(el);
			size+=parseFloat(style.marginLeft)+parseFloat(style.marginRight);
		}
		return size;
	},
	outerHeight:function(a){
		if(this.length===0) return 0;
		var el=this[0];
		if(el===window) return window.outerHeight;
		if(el===document) return document.documentElement.clientHeight;
		var size=el.offsetHeight;
		if(a===true){
			var style=getComputedStyle(el);
			size+=parseFloat(style.marginTop)+parseFloat(style.marginBottom);
		}
		return size;
	},
	filter:function(a){
		return _new(this,function(){
			var el=[];
			if(typeof a==="function"){
				for(var i=0;i<this.length;i++){if(a.call(this[i],i,this[i])) el.push(this[i]);}
			}else if(typeof a==="string"){
				for(var i=0;i<this.length;i++){if(this[i].matches(a)) el.push(this[i]);}
			}else if(a){
				var i,tEl=a instanceof EdJS ? a[0]:a;
				for(i=0;i<this.length;i++){if(this[i]===tEl)el.push(this[i]);}
			}
			return el;
		});
	},
	not:function(a){
		return _new(this,function(){
			var el=[];
			if(typeof a==="function"){
				for(var i=0;i<this.length;i++){if(!a.call(this[i],i,this[i])) el.push(this[i]);}
			}else if(typeof a==="string"){
				for(var i=0;i<this.length;i++){if(!this[i].matches(a)) el.push(this[i]);}
			}else if(a){
				var i,tEl=a instanceof EdJS ? a[0]:a;
				for(i=0;i<this.length;i++){if(this[i]!==tEl) el.push(this[i]);}
			}else{
				for(var i=0;i<this.length;i++) el.push(this[i]);
			}
			return el;
		});
	},
	end:function(){
		return this.prevObj||$(null);
	},
	slice:function(){
		var el=this,arg=arguments;
		return _new(this,function(){
			return [].slice.apply(el,arg);
		});
	},
	delay:function(t){
		var i,el=this,o=$([]);
		o.prevObj=el;
		o.each=function(cb){
			setTimeout(function(){el.each(cb);},t);
			return o;
		};
		for(i=0;i<el.length;i++) o[i]=el[i];
		o.length=el.length;
		return o;
	},
	offset:function(){
		if(this.length===0) return{top:0,left:0};
		var el=this[0],r=el.getBoundingClientRect();
		return{top:r.top+window.scrollY,left:r.left+window.scrollX};
	},
	children:function(a){
		var el=[];
		this.each(function(){
			for(var i=0;i<this.children.length;i++){
				var child=this.children[i];
				if(!a||child.matches(a)){
					if(el.indexOf(child)===-1) el.push(child);
				}
			}
		});
		return $(el);
	},
	siblings:function(a){
		var sEl=[];
		this.each(function(){
			var el=this,prnt=el.parentNode;
			if(prnt){
				for(var i=0;i<prnt.children.length;i++){
					var sbl=prnt.children[i];
					if(sbl!==el && (!a||sbl.matches(a))){
						if(sEl.indexOf(sbl)===-1) sEl.push(sbl);
					}
				}
			}
		});
		return $(sEl);
	},
	parent:function(a){
		return _new(this,function(){
			var el=[];
			this.each(function(){
				var prnt=this.parentElement;
				if(prnt){
					if(!a||prnt.matches(a)){
						if(el.indexOf(prnt)===-1) el.push(prnt);
					}
				}
			});
			return el;
		});
	},
	parents:function(a){
		return _new(this,function(){
			var el=[];
			this.each(function(){
				var prnt=this.parentElement;
				while(prnt){
					if(!a||prnt.matches(a)){
						if(el.indexOf(prnt)===-1) el.push(prnt);
					}
					prnt=prnt.parentElement;
				}
			});
			return el;
		});
	},
	next:function(a){
		return _new(this,function(){
			var el=[];
			this.each(function(){
				var nxt=this.nextElementSibling;
				if(nxt){
					if(!a||nxt.matches(a)){
						if(el.indexOf(nxt)===-1) el.push(nxt);
					}
				}
			});
			return el;
		});
	},
	prev:function(a){
		return _new(this,function(){
			var el=[];
			this.each(function(){
				var prv=this.previousElementSibling;
				if(prv){
					if(!a||prv.matches(a)){
						if(el.indexOf(prv)===-1) el.push(prv);
					}
				}
			});
			return el;
		});
	},
	wrap:function(a){
		return this.each(function(){
			var wrp=typeof a==='string' ? $.parseHTML(a):a;
			if(wrp && this.parentNode){
				var cloneWrp=wrp.cloneNode(true);
				this.parentNode.insertBefore(cloneWrp,this);
				cloneWrp.appendChild(this);
			}
		});
	},
	wrapAll:function(a){
		if(this.length===0) return this;
		var wrp=typeof a==='string' ? $.parseHTML(a):a;
		if(wrp){
			var fEl=this[0],prnt=fEl.parentNode;
			if(prnt){
				var cloneWrp=wrp.cloneNode(true);
				prnt.insertBefore(cloneWrp,fEl);
				this.each(function(){cloneWrp.appendChild(this);});
			}
		}
		return this;
	},
	toggle:function(){
		return this.each(function(){this.style.display=getComputedStyle(this).display==="none"?"":"none";});
	},
	toggleClass:function(a){
		return this.each(function(){
			var cls=a.split(" ");
			for(var i=0;i<cls.length;i++){
				if(cls[i]) this.classList.toggle(cls[i]);
			}
		});
	},
	hover:function(fnOver,fnOut){
		return this.each(function(){this.addEventListener("mouseover",fnOver);this.addEventListener("mouseout",fnOut);});
	},
	fadeIn:function(speed=500,fn){
		return _fade.call(this,speed,fn,true);
	},
	fadeOut:function(speed=500,fn){
		return _fade.call(this,speed,fn,false);
	},
	fadeToggle:function(speed=500,fn){
		return this.each(function(){var is=getComputedStyle(this).display==="none";_fade.call($(this),speed,fn,is);});
	},
	animate:function(props,dur,eas,cb){
	var o=typeof dur==="object" ? dur:{duration:dur,complete:typeof eas==="function" ? eas:cb},d=parseFloat(o.duration)||500;
	return this.each(function(){
		var el=this,start={},end={},sTime=null,comp=getComputedStyle(el),disp=el.style.display==="none" ? "block":el.style.display||comp.display;
		for(var p in props){
			if(!props.hasOwnProperty(p)) continue;
			var val=props[p],cur=parseFloat(comp[p]||comp[p.replace(/([A-Z])/g,"-$1").toLowerCase()]);
			if(isNaN(cur)){cur=p==='width'?el.offsetWidth:p==='height'?el.offsetHeight:p==='opacity'?1:0;}
			start[p]=cur;
			if(val==="toggle"||val==="show"||val==="hide"){
				var isHide=val==="hide"||(val==="toggle" && comp.display!=="none" && cur>0),k="_anim_"+p;
				el[k]=isHide ? cur:el[k];
				end[p]={v:isHide?0:parseFloat(el[k]||(p==="opacity"?1:p==="width"?el.scrollWidth:el.scrollHeight)),u:p==='opacity'?'':'px',act:isHide?"hide":"show"};
				if(!isHide) el.style.display=disp;
			}else{
				var m=String(val).match(/^([+-]=)?([-\d.]+)(.*)$/);
				if(m){
					var tgt=parseFloat(m[2]);
					if(m[1]==="+=") tgt=cur+tgt;
					if(m[1]==="-=") tgt=cur-tgt;
					end[p]={v:tgt,u:m[3]||(p==="opacity"?"":"px")};
				}
			}
		}
		requestAnimationFrame(function step(t){
			sTime=sTime||t;
			var elapsed=t-sTime,progress=Math.min(elapsed/d,1),ease=0.5 - Math.cos(progress * Math.PI)/2;
			for(var p in props){
				if(props.hasOwnProperty(p) && end[p]){
					var now=start[p]+(end[p].v-start[p])*ease;
					if(o.step){
						var tw={elem:el,prop:p,start:start[p],end:end[p].v,unit:end[p].u,pos:ease,now:now};
						o.step.call(el,now,tw);
						now=tw.now;
					}
					p in el.style ? el.style[p]=now+end[p].u:el[p]=now;
				}
			}
			if(o.progress) o.progress.call(el,null,progress,Math.max(0,d-elapsed));
			if(progress<1){
				requestAnimationFrame(step);
			}else{
				for(var p in props){
					if(props.hasOwnProperty(p) && end[p] && end[p].act==="hide"){el.style.display="none";el.style[p]="";}
				}
				if(o.complete) o.complete.call(el);
			}
		});
	});
	},
	slideDown:function(speed,fn){
		return this.each(function(){_slide(this,"down",speed,fn);});
	},
	slideUp:function(speed,fn){
		return this.each(function(){_slide(this,"up",speed,fn);});
	},
	slideToggle:function(speed,fn){
		return this.each(function(){_slide(this,getComputedStyle(this).display==="none"?"down":"up",speed,fn);});
	},
	on:function(ev,fn){
		var evs=ev.split(" ");
		return this.each(function(){
			var el=this;
			evs.forEach(function(e){if(e) el.addEventListener(e,fn);});
		});
	},
	off:function(ev,fn){
		var evs=ev.split(" ");
		return this.each(function(){
			var el=this;
			evs.forEach(function(e){if(e) el.removeEventListener(e,fn);});
		});
	},
	load:function(url,data,cb){
		if(typeof data==="function"){cb=data;data=null;}
		var el=this;
		$.ajax({url:url,type:data?"POST":"GET",data:data,success:function(r){
			el.each(function(){this.innerHTML=r;});
			if(typeof cb==="function") cb.call(el[0],r);
		},error:function(status,xhr){
			if(typeof cb==="function") cb.call(el[0],xhr.responseText,status,xhr);
		}
		});
		return this;
	},
	serialize:function(){
		var arr=[],add=function(n,v){arr.push(encodeURIComponent(n)+"="+encodeURIComponent(v));};
		this.each(function(){
			var i,el=this,els=el.nodeName==="FORM" ? [].slice.call(el.elements):[el];
			for(i=0;i<els.length;i++){
				var field=els[i];
				if(!field.name||field.disabled||['file','reset','submit','button'].indexOf(field.type) !== -1) continue;
				var name=field.name;
				if(field.nodeName==="SELECT"){
					for(var j=0;j<field.options.length;j++){
						var opt=field.options[j];
						if(opt.selected) add(name,opt.value||opt.text);
					}
				} else if(field.type==="checkbox"||field.type==="radio"){
					if(field.checked) add(name,field.value !== undefined ? field.value:"on");
				}else{
					add(name,field.value);
				}
			}
		});
		return arr.join("&");
	}
};
$.isArray=function(v){
	return {}.toString.call(v)==='[object Array]';
}
$.inArray=function(k,v){
	return v.indexOf(k)!==-1;
};
$.isFunction=function(v){
	return typeof v==='function';
};
$.isNumeric=function(v){
	return !isNaN(parseFloat(v)) && isFinite(v);
};
$.isObj=function(v){
	return typeof v==="object" && v!==null && !$.isArray(v);
};
$.isJson=function(v){
	if(typeof v!=='string') return false;
	try{
	var jp=JSON.parse(v);
	if(jp===null||typeof jp==='undefined') return false;
	if(typeof jp!=='object' && !$.isArray(jp)) return false;
	return true;
	}catch(e){
	return false;
	}
};
$.ajax=function(opt){
	opt=opt||{};
	opt.type=(opt.type||"GET").toUpperCase();
	opt.async=opt.async!==false;
	opt.data=opt.data||{};
	opt.headers=opt.headers||{};
	opt.dataType=opt.dataType||"html";
	var xhr=new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		if(xhr.readyState===4){
		var status=xhr.status;
		if(status>=200 && status<300||status===304){
			var data=xhr.responseText;
			opt.success && opt.success((opt.dataType=='json' ? JSON.parse(data):data),xhr.responseXML,xhr);
		}else{
			opt.error && opt.error(status,xhr);
		}
		}
	};
	var qStr="";
	if($.isObj(opt.data)){
		var pr=[];
		for(var name in opt.data){
			if(opt.data.hasOwnProperty(name)) pr.push(encodeURIComponent(name)+"="+encodeURIComponent(opt.data[name]));
		}
		qStr=pr.join("&");
	}else if(typeof opt.data==="string"){
		qStr=opt.data;
	}
	if(opt.type==="GET"){
		var url=opt.url;
		if(qStr) url +=(url.indexOf("?")===-1 ? "?":"&")+qStr;
		xhr.open("GET",url,opt.async);
		for(var headerName in opt.headers){
			if(opt.headers.hasOwnProperty(headerName)) xhr.setRequestHeader(headerName,opt.headers[headerName]);
		}
		xhr.send(null);
	}else if(opt.type==="POST"){
		xhr.open("POST",opt.url,opt.async);
		xhr.setRequestHeader("Content-Type",opt.contentType||"application/x-www-form-urlencoded");
		for(var headerName in opt.headers){
			if(opt.headers.hasOwnProperty(headerName)) xhr.setRequestHeader(headerName,opt.headers[headerName]);
		}
		xhr.send(qStr);
	}
};
$.get=function(url,data,success,dataType){
	if(typeof data==="function"){dataType=success;success=data;data=null;}
	$.ajax({url:url,type:"GET",data:data,success:success,dataType:dataType});
};
$.post=function(url,data,success,dataType){
	if(typeof data==="function"){dataType=success;success=data;data=null;}
	$.ajax({url:url,type:"POST",data:data,success:success,dataType:dataType});
};
$.parseHTML=function(h){
	var d=document.createElement("div");
	d.innerHTML=h.trim();
	if(d.childNodes.length===1) return d.firstChild;
	var f=document.createDocumentFragment();
	while(d.firstChild){f.appendChild(d.firstChild);}
	return f;
}
function _new(a,fn){
	var r=$(fn.call(a));
	r.prevObj=a;
	return r;
}
function _ins(t,a,s){
	var el=null;
	if(typeof a==="object" && a instanceof EdJS){el=a[0];}
	else if(typeof a==="object" && a.nodeType){el=a;}
	else if(typeof a==="string"){el=$.parseHTML(a);}
	if(el && t.parentNode) t.parentNode.insertBefore(el.cloneNode(true),s);
}
function _slide(el,direction,speed=500,cb){
	var isDown=direction==="down";
	if(isDown) el.style.display="";
	var eH=el.scrollHeight;
	el.style.overflow="hidden";
	el.style.transition="height "+speed+"ms ease";
	el.style.height=isDown ? "0":eH+"px";
	el.offsetHeight;
	el.style.height=isDown ? eH+"px":"0";
	setTimeout(function(){
		el.style.transition="";el.style.overflow="";el.style.height=isDown ? "":"0";
		if(!isDown) el.style.display="none";
		if(typeof cb==="function") cb.call(el);
	},speed);
}
function _fade(speed=500,fn,isIn){
	return this.each(function(){
		var el=this;
		if(speed<=0){
			el.style.opacity=isIn ? "1":"0";
			el.style.display=isIn ? "":"none";
			if(typeof fn==="function") fn.call(el);
			return;
		}
		if(isIn){
			el.style.opacity="0";
			el.style.display="";
		}else{
			el.style.opacity="1";
		}
		el.offsetHeight;
		el.style.transition="opacity "+speed+"ms ease";
		el.style.opacity=isIn ? "1":"0";
		setTimeout(function(){
			el.style.transition="";
			if(!isIn) el.style.display="none";
			if(typeof fn==="function") fn.call(el);
		},speed);
	});
}
$.extend=function(v){Object.assign(this,v);};
$.fn=EdJS.prototype;
$.fn.extend=function(v){Object.assign(this,v);};
})();