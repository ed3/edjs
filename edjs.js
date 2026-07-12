(function(){
var $=window.$=function(s){return new EdJS(s);};
var EdJS=function(s){
	var i,n,t;
	this.length=0;
	if(typeof s==="function"){
		document.readyState==="loading" ? document.addEventListener("DOMContentLoaded",s):s();
	}else if(typeof s==="string"){
		var els=s.split(/\s*,\s*/);
		var nod=[];
		for(i=0,n=els.length;i<n;i++){
			t=document.querySelectorAll(els[i]);
			for(var j=0,k=t.length;j<k;j++){if(nod.indexOf(t[j])===-1) nod.push(t[j]);}
		}
		for(i=0,n=nod.length;i<n;i++) this[i]=nod[i];
		this.length=nod.length;
	}else if(typeof s==="object"){
		if(s instanceof NodeList||s instanceof HTMLCollection||Array.isArray(s)){
			for(i=0,n=s.length;i<n;i++) this[i]=s[i];
			this.length=s.length;
		}else if(s.nodeType||s===window){
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
	prop:function(a,v){
		if(v!==undefined){
			return this.each(function(){this.setAttribute(a,v);});
		}else{
			return this.length>0 ? this[0].getAttribute(a):null;
		}
	},
	removeProp:function(a){
		return this.each(function(){this.removeAttribute(a);});
	},
	css:function(a,v){
		if(typeof a==='string' && v===undefined){
			return this.length>0 ? getComputedStyle(this[0])[a]:'';
		}
		if(typeof a==='object' && a!==null){
			return this.each(function(){
				for(var prop in a){if(a[prop]) this.style[prop]=a[prop];}
			});
		}
		if(typeof a==='string' && v!==undefined){
			return this.each(function(){this.style[a]=v;});
		}
		return this;
	},
	hasClass:function(a){
		for(var i=0;i<this.length;i++){
			if(this[i].classList.contains(a)) return true;
		}
		return false;
	},
	addClass:function(a){
		return this.each(function(){
			var classes=a.split(" ");
			for(var i=0;i<classes.length;i++){
				if(classes[i]) this.classList.add(classes[i]);
			}
		});
	},
	removeClass:function(a){
		return this.each(function(){
			var classes=a.split(" ");
			for(var i=0;i<classes.length;i++){if(classes[i]) this.classList.remove(classes[i]);}
			if(this.classList.length===0) this.removeAttribute("class");
		});
	},
	show:function(){
		return this.each(function(){
			this.style.display="";
			if(getComputedStyle(this).display==="none") this.style.display="block";
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
			var el=[];
			for(var i=0;i < this.length;i++) el.push(this[i]);
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
				this.innerHTML=a + this.innerHTML;
			}
		});
	},
	after:function(a){
		return this.each(function(){
			var target=null;
			if(typeof a==="object" && a instanceof EdJS){
				target=a[0];
			}else if(typeof a==="object" && a.nodeType){
				target=a;
			}else if(typeof a==="string"){
				target=_htmlToEl(a);
			}
			if(target && this.parentNode) this.parentNode.insertBefore(target.cloneNode(true),this.nextSibling);
		});
	},
	before:function(a){
		return this.each(function(){
			var target=null;
			if(typeof a==="object" && a instanceof EdJS){
				target=a[0];
			}else if(typeof a==="object" && a.nodeType){
				target=a;
			}else if(typeof a==="string"){
				target=_htmlToEl(a);
			}
			if(target && this.parentNode) this.parentNode.insertBefore(target.cloneNode(true),this);
		});
	},
	insertAfter:function(selector){
		var target=$(selector);
		if(target.length>0){
			return this.each(function(){
				var el=this;
				target.each(function(){if(this.parentNode) this.parentNode.insertBefore(el.cloneNode(true),this.nextSibling);});
			});
		}
		return this;
	},
	insertBefore:function(selector){
		var target=$(selector);
		if(target.length>0){
			return this.each(function(){
				var el=this;
				target.each(function(){if(this.parentNode) this.parentNode.insertBefore(el.cloneNode(true),this);});
			});
		}
		return this;
	},
	clone:function(withChildren){
		var clonedEl=[];
		this.each(function(){clonedEl.push(this.cloneNode(withChildren===true));});
		return $(clonedEl);
	},
	_new:function(fn){
		var newEl=fn.call(this),newEdJS=new EdJS(newEl);
		return newEdJS;
	},
	eq:function(a){
		return $(this[a]);
	},
	find:function(a){
		return this._new(function(){
			var el=[];
			this.each(function(){
				var matches=this.querySelectorAll(a);
				for(var i=0,n=matches.length;i<n;i++){if(el.indexOf(matches[i])===-1) el.push(matches[i]);}
			});
			return el;
		});
	},
	first:function(){
		return this._new(function(){return this.length>0 ? [this[0]]:[];});
	},
	last:function(){
		return this._new(function(){return this.length>0 ? [this[this.length-1]]:[];});
	},
	has:function(a){
		return this._new(function(){
			var el=[];
			this.each(function(){if(this.querySelectorAll(a).length > 0) el.push(this);});
			return el;
		});
	},
	index:function(selector){
		if(this.length===0) return -1;
		var el=this[0];
		if(selector===undefined){
			var parent=el.parentNode;
			if(!parent) return -1;
			var siblings=parent.children;
			for(var i=0;i < siblings.length;i++){if(siblings[i]===el) return i;}
			return -1;
		}
		if(typeof selector==="string"){
			var elements=$(selector);
			for(var j=0; j < elements.length; j++){if(elements[j]===el) return j;}
			return -1;
		}
		var targetEl=selector instanceof EdJS ? selector[0] : selector;
		if(targetEl){
			for(var l=0;l < this.length;l++){if(this[l]===targetEl) return l;}
		}
		return -1;
	},
	closest:function(a){
		return this._new(function(){
			var closestEl=[];
			this.each(function(){
				var el=this;
				while(el && el!==document){
					if(el.matches(a)){
					if(closestEl.indexOf(el)===-1) closestEl.push(el);
					break;
					}
					el=el.parentNode;
				}
			});
			return closestEl;
		});
	},
	height:function(value){
		if(value===undefined){
			return this.length>0 ? this[0].offsetHeight:0;
		}else{
			var cssValue=typeof value==='number' ? value+'px':value;
			return this.each(function(){this.style.height=cssValue;});
		}
	},
	width:function(value){
		if(value===undefined){
			return this.length>0 ? this[0].offsetWidth:0;
		}else{
			var cssValue=typeof value==='number' ? value+'px':value;
			return this.each(function(){this.style.width=cssValue;});
		}
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
	outerWidth:function(includeMargin){
		if(this.length===0) return 0;
		var el=this[0];
		if(el===window) return window.outerWidth;
		if(el===document) return document.documentElement.clientWidth;
		var size=el.offsetWidth;
		if(includeMargin===true){
			var style=getComputedStyle(el);
			size+=parseFloat(style.marginLeft)+parseFloat(style.marginRight);
		}
		return size;
	},
	outerHeight:function(includeMargin){
		if(this.length===0) return 0;
		var el=this[0];
		if(el===window) return window.outerHeight;
		if(el===document) return document.documentElement.clientHeight;
		var size=el.offsetHeight;
		if(includeMargin===true){
			var style=getComputedStyle(el);
			size+=parseFloat(style.marginTop)+parseFloat(style.marginBottom);
		}
		return size;
	},
	filter:function(selector){
		return this._new(function(){
			var el=[];
			if(typeof selector==="function"){
				for(var i=0;i < this.length;i++){if(selector.call(this[i],i,this[i])) el.push(this[i]);}
			}else if(typeof selector==="string"){
				for(var i=0;i < this.length;i++){if(this[i].matches(selector)) el.push(this[i]);}
			}else if(selector){
				var targetEl=selector instanceof EdJS ? selector[0] : selector;
				for(var i=0;i < this.length;i++){if(this[i]===targetEl)el.push(this[i]);}
			}
			return el;
		});
	},
	not:function(selector){
		return this._new(function(){
			var el=[];
			if(typeof selector==="function"){
				for(var i=0;i < this.length;i++){if(!selector.call(this[i],i,this[i])) el.push(this[i]);}
			}else if(typeof selector==="string"){
				for(var i=0;i < this.length;i++){if (!this[i].matches(selector)) el.push(this[i]);}
			}else if(selector){
				var targetEl=selector instanceof EdJS ? selector[0] : selector;
				for(var i=0;i < this.length;i++){if(this[i] !== targetEl) el.push(this[i]);}
			}else{
				for(var i=0;i < this.length;i++) el.push(this[i]);
			}
			return el;
		});
	},
	offset:function(){
		if(this.length===0) return{top:0,left:0};
		var el=this[0];
		var r=el.getBoundingClientRect();
		return{top:r.top+window.scrollY,left:r.left+window.scrollX};
	},
	parent:function(){
		return this._new(function(){
			var ps=[];
			this.each(function(){
				var p=_getClosestEl(this.parentNode);
				if(p && ps.indexOf(p)===-1) ps.push(p);
			});
			return ps;
		});
	},
	parents:function(a){
		return this._new(function(){
			var b=[];
			this.each(function(){
				var el=this;
				while(el && el!==document){
					el=_getClosestEl(el.parentNode);
					if(el && b.indexOf(el)===-1){
						if(!a||el.matches(a)) b.push(el);
					}
				}
			});
			return b;
		});
	},
	children:function(a){
		var childEl=[];
		this.each(function(){
			for(var i=0;i<this.children.length;i++){
				var child=this.children[i];
				if(!a || child.matches(a)){
					if(childEl.indexOf(child)===-1) childEl.push(child);
				}
			}
		});
		return $(childEl);
	},
	siblings:function(a){
		var sEl=[];
		this.each(function(){
			var el=this,parent=el.parentNode;
			if(parent){
				for(var i=0;i<parent.children.length;i++){
					var sibling=parent.children[i];
					if(sibling !== el && (!a || sibling.matches(a))){
						if(sEl.indexOf(sibling)===-1) sEl.push(sibling);
					}
				}
			}
		});
		return $(sEl);
	},
	next:function(){
		return this._new(function(){
			var el=[];
			this.each(function(){
				var next=_getClosestEl(this.nextSibling);
				if(next && el.indexOf(next)===-1) el.push(next);
			});
			return el;
		});
	},
	prev:function(){
		return this._new(function(){
			var el=[];
			this.each(function(){
				var prev=_getClosestEl(this.previousSibling);
				if(prev && el.indexOf(prev)===-1) el.push(prev);
			});
			return el;
		});
	},
	wrap:function(el){
		return this.each(function(){
			var wrapper=typeof el==='string' ? _htmlToEl(el):el;
			if(wrapper && this.parentNode){
				var cloneWrap=wrapper.cloneNode(true);
				this.parentNode.insertBefore(cloneWrap,this);
				cloneWrap.appendChild(this);
			}
		});
	},
	wrapAll:function(el){
		if(this.length===0) return this;
		var wrapper=typeof el==='string' ? _htmlToEl(el):el;
		if(wrapper){
			var firstEl=this[0];
			var parent=firstEl.parentNode;
			if(parent){
				var cloneWrap=wrapper.cloneNode(true);
				parent.insertBefore(cloneWrap,firstEl);
				this.each(function(){cloneWrap.appendChild(this);});
			}
		}
		return this;
	},
	toggle:function(){
		return this.each(function(){
			this.style.display=(getComputedStyle(this).display==="none" ? "":"none");
			if(getComputedStyle(this).display==="none") this.style.display="block";
		});
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
	fadeIn:function(speed,fn){
		return this.each(function(){
			var el=this;
			var d=speed||500;
			el.style.opacity=0;
			el.style.display="block";
			var startTime=null;
			function animate(currentTime){
				if(!startTime) startTime=currentTime;
				var progress=(currentTime - startTime)/d;
				el.style.opacity=progress;
				if(progress<1){
					requestAnimationFrame(animate);
				}else{
					el.style.opacity=1;
					if(typeof fn==="function") fn.call(el);
				}
			}
			requestAnimationFrame(animate);
		});
	},
	fadeOut:function(speed,fn){
		return this.each(function(){
			var el=this;
			var d=speed||500;
			el.style.opacity=1;
			var startTime=null;
			function animate(currentTime){
				if(!startTime) startTime=currentTime;
				var progress=(currentTime - startTime)/d;
				el.style.opacity=1 - progress;
				if(progress<1){
					requestAnimationFrame(animate);
				}else{
					el.style.opacity=0;
					el.style.display="none";
					if(typeof fn==="function") fn.call(el);
				}
			}
			requestAnimationFrame(animate);
		});
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
		if(typeof data==="function"){
			cb=data;
			data=null;
		}
		var el=this;
		$.ajax({url:url,type:data?"POST":"GET",data:data,success:function(rText){
			el.each(function(){this.innerHTML=rText;});
			if(typeof cb==="function") cb.call(el[0],rText);
		},error:function(status,xhr){
			if(typeof cb==="function") cb.call(el[0],xhr.responseText,status,xhr);
		}
		});
		return this;
	},
	serialize:function(){
		var arr=[];
		this.each(function(){
		var el=this;
		var add=function(name,value){
			arr.push(encodeURIComponent(name)+"="+encodeURIComponent(value));
		};
		var getForms=function(form){
			var inp=[];
			for(var i=0;i<form.elements.length;i++) inp.push(form.elements[i]);
			return inp;
		};
		var elSerial=[];
		if(el.nodeName==="FORM"){
			elSerial=getForms(el);
		}else{
			elSerial.push(el);
		}
		for(var i=0;i<elSerial.length;i++){
			var field=elSerial[i];
			if(field.name && !field.disabled){
			switch(field.nodeName){
			case "INPUT":
				if(["text","hidden","password","email","url","tel","number","range","date","month","week","time","datetime-local","color"].indexOf(field.type)!==-1){
					add(field.name,field.value);
				}else if(["checkbox","radio"].indexOf(field.type)!==-1){
					if(field.checked){add(field.name,field.value);}
				}
				break;
			case "SELECT":
				if(field.type==="select-one"){
					add(field.name,field.value);
				}else if(field.type==="select-multiple"){
					for(var j=0;j<field.options.length;j++){if(field.options[j].selected) add(field.name,field.options[j].value);}
				}
				break;
			case "TEXTAREA":
				add(field.name,field.value);
				break;
			}
			}
		}
		});
		return arr.join("&");
	},
	slideDown:function(speed,fn){
		return this.each(function(){_slide(this,"down",speed,fn);});
	},
	slideUp:function(speed,fn){
		return this.each(function(){_slide(this,"up",speed,fn);});
	},
	slideToggle:function(speed,fn){
		return this.each(function(){_slide(this,getComputedStyle(this).display==="none"?"down":"up",speed,fn);});
	}
};
$.isArray=function(o){
	return Array.isArray(o);
};
$.inArray=function(key,arr){
	return arr.indexOf(key)!==-1;
};
$.isObj=function(str){
	return typeof str==="object" && str!==null && !Array.isArray(str);
};
$.isJson=function(str){
	if(typeof str!=='string') return false;
	try{
	var parsed=JSON.parse(str);
	if(parsed===null || typeof parsed==='undefined') return false;
	if(typeof parsed!=='object' && !Array.isArray(parsed)) return false;
	return true;
	}catch(e){
	return false;
	}
};
$.ajax=function(opt){
	opt=opt||{};
	opt.type=(opt.type||"GET").toUpperCase();
	opt.async=opt.async!==false;
	opt.data=opt.data ||{};
	opt.headers=opt.headers ||{};
	opt.dataType=opt.dataType!=null ? opt.dataType:"html";
	var xhr=new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		if(xhr.readyState===4){
		var status=xhr.status;
		if(status >= 200 && status<300||status===304){
			if(opt.dataType=='json'){
				opt.success && opt.success(JSON.parse(xhr.responseText),xhr.responseXML,xhr);
			}else{
				opt.success && opt.success(xhr.responseText,xhr.responseXML,xhr);
			}
		}else{
			opt.error && opt.error(status,xhr);
		}
		}
	};
	var queryString="";
	if($.isObj(opt.data)){
		var params=[];
		for(var name in opt.data){
			if(opt.data.hasOwnProperty(name)) params.push(encodeURIComponent(name)+"="+encodeURIComponent(opt.data[name]));
		}
		queryString=params.join("&");
	}else if(typeof opt.data==="string"){
		queryString=opt.data;
	}
	if(opt.type==="GET"){
		var url=opt.url;
		if(queryString) url += (url.indexOf("?")===-1 ? "?":"&") + queryString;
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
		xhr.send(queryString);
	}
};
$.get=function(url,data,success,dataType){
	if(typeof data==="function"){
		dataType=success; success=data; data=null;
	}
	$.ajax({url:url,type:"GET",data:data,success:success,dataType:dataType});
};
$.post=function(url,data,success,dataType){
	if(typeof data==="function"){
		dataType=success; success=data; data=null;
	}
	$.ajax({url:url,type:"POST",data:data,success:success,dataType:dataType});
};
function _htmlToEl(h){
	var div=document.createElement("div");
	div.innerHTML=h.trim();
	if(div.children.length===1){
		return div.firstElementChild;
	}else{
		var frg=document.createDocumentFragment();
		while(div.firstChild){frg.appendChild(div.firstChild);}
		return frg;
	}
}
function _getClosestEl(node){
	while(node && node.nodeType!==1){node=node.nextSibling||node.previousSibling||node.parentNode;}
	return node;
}
function _slide(el,direction,speed,cb){
	var d=speed||500,isDown=direction==="down",targetHeight=el.offsetHeight,startTime=null;
	if(isDown)el.style.display="block";
	el.style.overflow="hidden";
	el.style.height=isDown ? "0":targetHeight+"px";
	requestAnimationFrame(function animate(currentTime){
		if(!startTime) startTime=currentTime;
		var progress=Math.min((currentTime - startTime) / d, 1);
		el.style.height=(isDown ? progress * targetHeight : (1 - progress) * targetHeight)+"px";
		if(progress < 1){
			requestAnimationFrame(animate);
		}else{
			el.style.height=isDown ? "":"0";
			el.style.overflow="";
			if(!isDown)el.style.display="none";
			if(typeof cb==="function")cb.call(el);
		}
	});
}
$.htmlToEl=_htmlToEl;
$.extend=function(o){Object.assign(this,o);};
$.fn=EdJS.prototype;
$.fn.extend=function(o){Object.assign(this,o);};
})();