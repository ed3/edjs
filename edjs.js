(function(){
var $=window.$=function(s){
	return new Edjs(s);
};
var Edjs=function(s){
	var i,n,t;
	this.length=0;
	if(typeof s==="function"){
		document.readyState==="loading" ? document.addEventListener("DOMContentLoaded",s):s();
	}else if(typeof s==="string"){
		var els=s.split(/\s*,\s*/);
		var nod=[];
		for(i=0,n=els.length;i<n;i++){
			t=document.querySelectorAll(els[i]);
			for(var j=0,k=t.length;j<k;j++){
				if(nod.indexOf(t[j])===-1) nod.push(t[j]);
			}
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
Edjs.prototype={
	constructor:Edjs,
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
			if(typeof a==="object" && a instanceof Edjs){
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
	css:function(a,v){
		if(typeof a==='string' && v===undefined){
			return this.length>0 ? getComputedStyle(this[0])[a]:'';
		}
		if(typeof a==='object' && a!==null){
			return this.each(function(){
				for(var prop in a){
					if(a[prop]) this.style[prop]=a[prop];
				}
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
			for(var i=0;i<classes.length;i++){
				if(classes[i]) this.classList.remove(classes[i]);
			}
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
		return this.each(function(){
			if(this.parentNode) this.parentNode.removeChild(this);
		});
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
		for(var i=0;i<this.length;i++){
			if(this[i].matches(a)) return true;
		}
		return false;
	},
	append:function(a){
		return this.each(function(){
			if(typeof a==="object" && a instanceof Edjs){
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
			if(typeof a==="object" && a instanceof Edjs){
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
			if(typeof a==="object" && a instanceof Edjs){
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
			if(typeof a==="object" && a instanceof Edjs){
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
				target.each(function(){
					if(this.parentNode) this.parentNode.insertBefore(el.cloneNode(true),this.nextSibling);
				});
			});
		}
		return this;
	},
	insertBefore:function(selector){
		var target=$(selector);
		if(target.length>0){
			return this.each(function(){
				var el=this;
				target.each(function(){
					if(this.parentNode) this.parentNode.insertBefore(el.cloneNode(true),this);
				});
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
		var newEl=fn.call(this),newEdjs=new Edjs(newEl);
		return newEdjs;
	},
	eq:function(a){
		return $(this[a]);
	},
	find:function(a){
		return this._new(function(){
			var foundEl=[];
			this.each(function(){
				var matches=this.querySelectorAll(a);
				for(var i=0,n=matches.length;i<n;i++){
					if(foundEl.indexOf(matches[i])===-1) foundEl.push(matches[i]);
				}
			});
			return foundEl;
		});
	},
	first:function(){
		return this._new(function(){
			return this.length>0 ? [this[0]]:[];
		});
	},
	last:function(){
		return this._new(function(){
			return this.length>0 ? [this[this.length-1]]:[];
		});
	},
	has:function(a){
		return this._new(function(){
			var el=[];
			this.each(function(){
				if(this.querySelectorAll(a).length > 0) el.push(this);
			});
			return el;
		});
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
	parent:function(){
		return this._new(function(){
			var ps=[];
			this.each(function(){
				var p=_getClosestElement(this.parentNode);
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
					el=_getClosestElement(el.parentNode);
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
		var siblingEl=[];
		this.each(function(){
			var el=this,parent=el.parentNode;
			if(parent){
				for(var i=0;i<parent.children.length;i++){
					var sibling=parent.children[i];
					if(sibling !== el && (!a || sibling.matches(a))){
						if(siblingEl.indexOf(sibling)===-1) siblingEl.push(sibling);
					}
				}
			}
		});
		return $(siblingEl);
	},
	next:function(){
		return this._new(function(){
			var el=[];
			this.each(function(){
				var next=_getClosestElement(this.nextSibling);
				if(next && el.indexOf(next)===-1) el.push(next);
			});
			return el;
		});
	},
	prev:function(){
		return this._new(function(){
			var el=[];
			this.each(function(){
				var prev=_getClosestElement(this.previousSibling);
				if(prev && el.indexOf(prev)===-1) el.push(prev);
			});
			return el;
		});
	},
	wrap:function(wrapEl){
		return this.each(function(){
			var wrapper=typeof wrapEl==='string' ? _htmlToEl(wrapEl):wrapEl;
			if(wrapper && this.parentNode){
				var cloneWrap=wrapper.cloneNode(true);
				this.parentNode.insertBefore(cloneWrap,this);
				cloneWrap.appendChild(this);
			}
		});
	},
	wrapAll:function(wrapEl){
		if(this.length === 0) return this;
		var wrapper=typeof wrapEl==='string' ? _htmlToEl(wrapEl):wrapEl;
		if(wrapper){
			var firstElement=this[0];
			var parent=firstElement.parentNode;
			if(parent){
				var cloneWrap=wrapper.cloneNode(true);
				parent.insertBefore(cloneWrap,firstElement);
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
			evs.forEach(function(e){
				if(e) el.addEventListener(e,fn);
			});
		});
	},
	off:function(ev,fn){
		var evs=ev.split(" ");
		return this.each(function(){
			var el=this;
			evs.forEach(function(e){
				if(e) el.removeEventListener(e,fn);
			});
		});
	},
	load:function(url,data,complete){
		if(typeof data==="function"){
			complete=data;
			data=null;
		}
		var el=this;
		$.ajax({url:url,type:data?"POST":"GET",data:data,success:function(rText){
				el.each(function(){this.innerHTML=rText;});
				if(typeof complete==="function") complete.call(el[0],rText);
			},
			error:function(status,xhr){
				if(typeof complete==="function") complete.call(el[0],xhr.responseText,status,xhr);
			}
		});
		return this;
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
$.ajax=function(opt){
	opt=opt||{};
	opt.type=(opt.type||"GET").toUpperCase();
	opt.async=opt.async!==false;
	opt.data=opt.data ||{};
	opt.headers=opt.headers ||{};
	var xhr=new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		if(xhr.readyState===4){
			var status=xhr.status;
			if(status >= 200 && status<300||status===304){
				opt.success && opt.success(xhr.responseText,xhr.responseXML,xhr);
			}else{
				opt.error && opt.error(status,xhr);
			}
		}
	};
	var queryString="";
	if($.isObj(opt.data)){
		var params=[];
		for(var name in opt.data){
			if(opt.data.hasOwnProperty(name)) params.push(encodeURIComponent(name) + "=" + encodeURIComponent(opt.data[name]));
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
		dataType=success;
		success=data;
		data=null;
	}
	$.ajax({url:url,type:"GET",data:data,success:success,dataType:dataType});
};
$.post=function(url,data,success,dataType){
	if(typeof data==="function"){
		dataType=success;
		success=data;
		data=null;
	}
	$.ajax({url:url,type:"POST",data:data,success:success,dataType:dataType});
};
function _htmlToEl(h){
	var div=document.createElement("div");
	div.innerHTML=h.trim();
	if(div.children.length===1){
		return div.firstElementChild;
	}else{
		var fragment=document.createDocumentFragment();
		while(div.firstChild){
			fragment.appendChild(div.firstChild);
		}
		return fragment;
	}
}
function _getClosestElement(node){
	while(node && node.nodeType!==1){
		node=node.nextSibling||node.previousSibling||node.parentNode;
	}
	return node;
}
$.extend=function(o){
	Object.assign(this,o);
};
$.fn=Edjs.prototype;
$.fn.extend=function(o){
	Object.assign(this,o);
};
})();