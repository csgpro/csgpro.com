function renderMarkdown(){render.innerHTML=marked(md.value)}!function(a,b,c){var d,e=a.ss||{},f=/^\s+/,g=/\s+$/,h=/[xy]/g,i=/.*(\/|\\)/,j=/.*[.]/,k=/[\t\r\n]/g,l=Object.prototype.toString.call(a.HTMLElement).indexOf("Constructor")>0,m=b.createElement("input");m.type="file",d="multiple"in m&&"undefined"!=typeof File&&"undefined"!=typeof(new XMLHttpRequest).upload,e.obj2string=function(a,b){"use strict";var c=[];for(var d in a)if(a.hasOwnProperty(d)){var f=b?b+"["+d+"]":d,g=a[d];c.push("object"==typeof g?e.obj2string(g,f):encodeURIComponent(f)+"="+encodeURIComponent(g))}return c.join("&")},e.extendObj=function(a,b){"use strict";for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c])},e.contains=function(a,b){"use strict";for(var c=a.length;c--;)if(a[c]===b)return!0;return!1},e.removeItem=function(a,b){"use strict";for(var c=a.length;c--;)if(a[c]===b){a.splice(c,1);break}},e.addEvent=function(a,b,c){"use strict";return a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent("on"+b,c),function(){e.removeEvent(a,b,c)}},e.removeEvent=function(a,b,c){"use strict";a.removeEventListener?a.removeEventListener(b,c,!1):a.detachEvent("on"+b,c)},e.newXHR=function(){"use strict";if("undefined"!=typeof XMLHttpRequest)return new a.XMLHttpRequest;if(a.ActiveXObject)try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){return!1}},e.parseJSON=function(b){"use strict";if(!b)return!1;if(b=e.trim(b),a.JSON&&a.JSON.parse)try{return a.JSON.parse(b)}catch(c){return!1}return b&&/^[\],:{}\s]*$/.test(b.replace(/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,"@").replace(/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))?new Function("return "+b)():!1},e.getBox=function(c){"use strict";var d,e,f=0,g=0;if(c.getBoundingClientRect)d=c.getBoundingClientRect(),e=b.documentElement,f=d.top+(a.pageYOffset||e.scrollTop)-(e.clientTop||0),g=d.left+(a.pageXOffset||e.scrollLeft)-(e.clientLeft||0);else do g+=c.offsetLeft,f+=c.offsetTop;while(c=c.offsetParent);return{top:Math.round(f),left:Math.round(g)}},e.addStyles=function(a,b){"use strict";for(var c in b)b.hasOwnProperty(c)&&(a.style[c]=b[c])},e.copyLayout=function(a,b){"use strict";var c=e.getBox(a);e.addStyles(b,{position:"absolute",left:c.left+"px",top:c.top+"px",width:a.offsetWidth+"px",height:a.offsetHeight+"px"})},e.toElement=function(){"use strict";var a=b.createElement("div");return function(b){a.innerHTML=b;var c=a.firstChild;return a.removeChild(c),c}}(),e.getUID=function(){"use strict";return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(h,function(a){var b=16*Math.random()|0,c="x"==a?b:3&b|8;return c.toString(16)})},e.trim=function(a){"use strict";return a.toString().replace(f,"").replace(g,"")},e.getFilename=function(a){"use strict";return a.replace(i,"")},e.getExt=function(a){"use strict";return-1!==a.indexOf(".")?a.replace(j,""):""},e.hasClass=function(a,b){"use strict";return(" "+a.className+" ").replace(k," ").indexOf(" "+b+" ")>=0},e.addClass=function(a,b){"use strict";return b&&""!==b?void(e.hasClass(a,b)||(a.className+=" "+b)):!1},e.removeClass=function(){"use strict";var a={};return function(b,c){a[c]||(a[c]=new RegExp("(?:^|\\s)"+c+"(?!\\S)")),b.className=b.className.replace(a[c],"")}}(),e.purge=function(a){"use strict";var b,c,d,f=a.attributes;if(f)for(b=f.length-1;b>=0;b-=1)d=f[b].name,"function"==typeof a[d]&&(a[d]=null);if(f=a.childNodes)for(c=f.length,b=0;c>b;b+=1)e.purge(a.childNodes[b])},e.remove=function(a){"use strict";a.parentNode&&(e.purge(a),a.parentNode.removeChild(a)),a=null},e.verifyElem=function(c){"use strict";return"undefined"!=typeof jQuery&&c instanceof jQuery?c=c[0]:"string"==typeof c&&("#"==c.charAt(0)&&(c=c.substr(1)),c=b.getElementById(c)),c&&1===c.nodeType?("A"==c.nodeName.toUpperCase()&&(c.style.cursor="pointer",e.addEvent(c,"click",function(b){b&&b.preventDefault?b.preventDefault():a.event&&(a.event.returnValue=!1)})),c):!1},e.SimpleUpload=function(a){"use strict";var b,c,f;if(this._opts={button:"",url:"",progressUrl:!1,nginxProgressUrl:!1,multiple:!1,maxUploads:3,queue:!0,checkProgressInterval:50,keyParamName:"APC_UPLOAD_PROGRESS",nginxProgressHeader:"X-Progress-ID",allowedExtensions:[],accept:"",maxSize:!1,name:"",data:{},autoSubmit:!0,multipart:!1,method:"POST",responseType:"",debug:!1,hoverClass:"",focusClass:"",disabledClass:"",onAbort:function(){},onChange:function(){},onSubmit:function(){},onProgress:function(){},onUpdateFileSize:function(){},onComplete:function(){},onExtError:function(){},onSizeError:function(){},onError:function(){},startXHR:function(){},endXHR:function(){},startNonXHR:function(){},endNonXHR:function(){}},e.extendObj(this._opts,a),a=null,this._btns=[],this._opts.button instanceof Array)for(c=this._opts.button.length,b=0;c>b;b++)f=e.verifyElem(this._opts.button[b]),f!==!1?this._btns.push(this.rerouteClicks(f)):this.log("Button with array index "+b+" is invalid");else f=e.verifyElem(this._opts.button),f!==!1&&this._btns.push(this.rerouteClicks(f));if(delete this._opts.button,this._btns.length<1||this._btns[0]===!1)throw new Error("Invalid button. Make sure the element you're passing exists.");this._opts.multiple===!1&&(this._opts.maxUploads=1),this._queue=[],this._active=0,this._disabled=!1,this._progKeys=[],this._maxFails=10,d||(this._opts.progressUrl||this._opts.nginxProgressUrl)&&(this._sizeFlags={},this._progKey=e.getUID()),this._createInput(),this.enable()},e.SimpleUpload.prototype={destroy:function(){"use strict";for(var a=this._btns.length;a--;)this._btns[a].off&&this._btns[a].off(),e.removeClass(this._btns[a],this._opts.hoverClass),e.removeClass(this._btns[a],this._opts.focusClass),e.removeClass(this._btns[a],this._opts.disabledClass),this._btns[a].disabled=!1;e.remove(this._input.parentNode);for(var b in this)this.hasOwnProperty(b)&&delete this.prop},log:function(b){"use strict";this._opts.debug&&a.console&&console.log("[uploader] "+b)},setData:function(a){"use strict";this._opts.data=a},setProgressBar:function(a){"use strict";this._progBar=e.verifyElem(a)},setPctBox:function(a){"use strict";this._pctBox=e.verifyElem(a)},setFileSizeBox:function(a){"use strict";this._sizeBox=e.verifyElem(a)},setProgressContainer:function(a){"use strict";this._progBox=e.verifyElem(a)},setAbortBtn:function(a,b){"use strict";this._abortBtn=e.verifyElem(a),this._removeAbort=!1,b&&(this._removeAbort=!0)},getQueueSize:function(){"use strict";return this._queue.length},_cycleQueue:function(){"use strict";this._queue.length>0&&this._opts.autoSubmit&&this.submit()},removeCurrent:function(){"use strict";e.removeItem(this._queue,this._file),delete this._file,this._file=null,this._cycleQueue()},disable:function(){"use strict";var a,b=this._btns.length;for(this._disabled=!0;b--;)a=this._btns[b].nodeName.toUpperCase(),e.addClass(this._btns[b],this._opts.disabledClass),("INPUT"==a||"BUTTON"==a)&&(this._btns[b].disabled=!0);this._input&&this._input.parentNode&&(this._input.parentNode.style.visibility="hidden")},enable:function(){"use strict";var a=this._btns.length;for(this._disabled=!1;a--;)e.removeClass(this._btns[a],this._opts.disabledClass),this._btns[a].disabled=!1},_createInput:function(){"use strict";var a=this,c=b.createElement("div");this._input=b.createElement("input"),this._input.type="file",this._input.name=this._opts.name,d&&!l&&(this._input.multiple=!0),"accept"in this._input&&""!==this._opts.accept&&(this._input.accept=this._opts.accept),e.addStyles(c,{display:"block",position:"absolute",overflow:"hidden",margin:0,padding:0,opacity:0,direction:"ltr",zIndex:2147483583}),e.addStyles(this._input,{position:"absolute",right:0,margin:0,padding:0,fontSize:"480px",fontFamily:"sans-serif",cursor:"pointer"}),"0"!==c.style.opacity&&(c.style.filter="alpha( opacity=0 )"),e.addEvent(this._input,"change",function(){var b,c,f,g;if(a._input&&""!==a._input.value){if(d){if(b=e.getFilename(a._input.files[0].name),c=e.getExt(b),!1===a._opts.onChange.call(a,b,c))return;for(f=a._input.files.length,a._opts.multiple||(f=1),g=0;f>g;g++)a._queue.push(a._input.files[g])}else{if(b=e.getFilename(a._input.value),c=e.getExt(b),!1===a._opts.onChange.call(a,b,c))return;a._queue.push(a._input)}e.removeClass(a._overBtn,a._opts.hoverClass),e.removeClass(a._overBtn,a._opts.focusClass),e.remove(a._input.parentNode),delete a._input,a._createInput(),a._opts.autoSubmit&&a.submit()}}),e.addEvent(this._input,"mouseover",function(){e.addClass(a._overBtn,a._opts.hoverClass)}),e.addEvent(this._input,"mouseout",function(){e.removeClass(a._overBtn,a._opts.hoverClass),e.removeClass(a._overBtn,a._opts.focusClass),a._input.parentNode.style.visibility="hidden"}),e.addEvent(this._input,"focus",function(){e.addClass(a._overBtn,a._opts.focusClass)}),e.addEvent(this._input,"blur",function(){e.removeClass(a._overBtn,a._opts.focusClass)}),b.body.appendChild(c),c.appendChild(this._input)},rerouteClicks:function(a){"use strict";var b=this;return a.off=e.addEvent(a,"mouseover",function(){b._disabled||(b._input||b._createInput(),b._overBtn=a,e.copyLayout(a,b._input.parentNode),b._input.parentNode.style.visibility="visible")}),a},_getFrame:function(){"use strict";var a=e.getUID(),c=e.toElement('<iframe src="javascript:false;" name="'+a+'" />');return b.body.appendChild(c),c.style.display="none",c.id=a,c},_getForm:function(a){"use strict";var c=e.toElement('<form method="post" enctype="multipart/form-data"></form>');return b.body.appendChild(c),c.style.display="none",c.action=this._opts.url,c.target=a.name,c},_getHidden:function(a,c){"use strict";var d=b.createElement("input");return d.type="hidden",d.name=a,d.value=c,d},_last:function(a,b,c,d,f){"use strict";a&&(a.innerHTML=""),b&&e.remove(b),c&&(c.innerHTML=""),d&&f&&e.remove(d),this._active--,a=b=c=d=f=null,this._disabled&&this.enable(),this._cycleQueue()},_errorFinish:function(a,b,c,d,e,f,g,h,i){"use strict";this.log("Upload failed: "+a+" "+b),this._opts.onError.call(this,d,c,a,b),this._last(e,f,g,h,i),a=b=c=d=e=f=g=h=i=null},_finish:function(a,b,c,d,f,g,h,i,j){"use strict";return this.log("Server response: "+c),"json"==this._opts.responseType.toLowerCase()&&(c=e.parseJSON(c),c===!1)?void this._errorFinish(a,b,"parseerror",d,f,g,i,j):(this._opts.onComplete.call(this,d,c),this._last(f,g,h,i,j),void(a=b=c=d=f=g=h=i=j=null))},_uploadXhr:function(a,b,d,f,g,h){"use strict";var i,j,k,l,m,n=this,o=this._opts,p=e.newXHR(),q={};if(!1===o.startXHR.call(this,a,b))return this._disabled&&this.enable(),void this._active--;if(k=this._abortBtn,l=this._removeAbort,this._abortBtn=this._removeAbort=null,q[o.name]=a,e.extendObj(q,o.data),i=o.url+"?"+e.obj2string(q),d&&(d.innerHTML=b+"K"),h&&(h.innerHTML="0%"),f&&(f.style.width="0%"),o.onProgress.call(this,0),j=function(e,f){var i,m;try{if(j&&(f||4===p.readyState))if(p.onreadystatechange=function(){},j=c,f)4!==p.readyState&&p.abort(),n._last(d,g,h,k,l),o.onAbort.call(n,a);else{i=p.status;try{m=p.statusText}catch(q){m=""}i>=200&&300>i?(o.endXHR.call(n,a,b),n._finish(i,m,p.responseText,a,d,g,h,k,l)):n._errorFinish(i,m,"error",a,d,g,h,k,l)}}catch(q){f||n._errorFinish(-1,q.message,"error",a,d,g,h,k,l)}},m=function(){e.removeEvent(k,"click",m),j&&j(c,!0)},k&&e.addEvent(k,"click",m),p.onreadystatechange=j,p.open(o.method.toUpperCase(),i,!0),e.addEvent(p.upload,"progress",function(a){if(a.lengthComputable){var b=Math.round(a.loaded/a.total*100);o.onProgress.call(n,b),h&&(h.innerHTML=b+"%"),f&&(f.style.width=b+"%")}}),p.setRequestHeader("X-Requested-With","XMLHttpRequest"),p.setRequestHeader("X-File-Name",encodeURIComponent(a)),"json"==o.responseType.toLowerCase()&&p.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01"),o.multipart===!0){var r=new FormData;for(var s in o.data)o.data.hasOwnProperty(s)&&r.append(s,o.data[s]);r.append(o.name,this._file),this.log("Commencing upload using multipart form"),p.send(r)}else p.setRequestHeader("Content-Type","application/octet-stream"),this.log("Commencing upload using binary stream"),p.send(this._file);this.removeCurrent()},_uploadIframe:function(b,c,d,f,g){"use strict";var h,i,j=this,k=this._opts,l=this._progKey,m=this._getFrame(),n=this._getForm(m);if(!1===k.startNonXHR.call(this,b))return this._disabled&&this.enable(),void this._active--;if(this._opts.nginxProgressUrl&&(n.action=this._opts.url+"?"+this._opts.nginxProgressHeader+"="+l),k.progressUrl!==!1){var o=this._getHidden(k.keyParamName,l);n.appendChild(o),o=null}for(var p in k.data)k.data.hasOwnProperty(p)&&(i=this._getHidden(p,k.data[p]),n.appendChild(i));n.appendChild(this._file),k.onProgress.call(this,0),g&&(g.innerHTML="0%"),d&&(d.style.width="0%"),h=e.addEvent(m,"load",function(){try{var a=m.contentDocument?m.contentDocument:m.contentWindow.document,d=a.body.innerHTML;e.removeItem(j._progKeys,l),k.endNonXHR.call(j,b),j._finish("","",d,b,c,f,g)}catch(i){j._errorFinish("",i.message,"error",b,c,f,g)}j._sizeFlags[l]&&delete j._sizeFlags.key,h(),e.remove(m),k=l=m=c=f=g=null}),j.log("Commencing upload using iframe"),n.submit(),e.remove(n),n=i=null,(this._opts.progressUrl||this._opts.nginxProgressUrl)&&(this._progKeys.push(l),a.setTimeout(function(){j._getProg(l,d,c,g,1),d=c=g=null},j._opts.checkProgressInterval),this._progKey=e.getUID()),this.removeCurrent()},_getProg:function(b,d,f,g,h){"use strict";var i,j,k=this,l=e.newXHR(),m=(new Date).getTime();b&&(this._opts.nginxProgressUrl?i=k._opts.nginxProgressUrl+"?_="+m:this._opts.progressUrl&&(i=k._opts.progressUrl+"?progresskey="+encodeURIComponent(b)+"&_="+m),j=function(){var i,m,n,o,p;try{if(j&&4===l.readyState){l.onreadystatechange=function(){},j=c,o=l.status;try{p=l.statusText}catch(q){p=""}if(o>=200&&300>o){if(i=e.parseJSON(l.responseText),h++,i===!1)return void k.log("Error parsing progress response (expecting JSON)");if(k._opts.nginxProgressUrl){if("uploading"==i.state)m=i.size,m>0&&(n=Math.round(i.received/m*100),m=Math.round(m/1024));else if("done"==i.state)n=100;else if("error"==i.state)return void k.log("Error requesting upload progress: "+i.status)}else k._opts.progressUrl&&i.success===!0&&(m=i.size,n=i.pct);if(n&&(g&&(g.innerHTML=n+"%"),d&&(d.style.width=n+"%"),k._opts.onProgress.call(k,n)),m&&!k._sizeFlags[b]&&(k._sizeFlags[b]=1,f&&(f.innerHTML=m+"K"),k._opts.onUpdateFileSize.call(k,m)),!n&&!m&&h>=k._maxFails)return void k.log("Failed progress request limit reached");100>n&&e.contains(k._progKeys,b)&&a.setTimeout(function(){k._getProg(b,d,f,g,h),b=d=f=g=h=null},k._opts.checkProgressInterval)}else e.removeItem(k._progKeys,b),k.log("Error requesting upload progress: "+o+" "+p);l=m=n=o=p=i=null}}catch(q){k.log("Error requesting upload progress: "+q.message)}},l.onreadystatechange=j,l.open("GET",i,!0),k._opts.nginxProgressUrl&&l.setRequestHeader(k._opts.nginxProgressHeader,b),l.setRequestHeader("X-Requested-With","XMLHttpRequest"),l.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01"),l.send())},_checkFile:function(a,b,c){"use strict";var d=this._opts.allowedExtensions,e=d.length,f=!1;if(e>0){for(b=b.toLowerCase();e--;)if(d[e].toLowerCase()==b){f=!0;break}if(!f)return this.removeCurrent(),this.log("File extension not permitted"),this._opts.onExtError.call(this,a,b),!1}return c&&this._opts.maxSize!==!1&&c>this._opts.maxSize?(this.removeCurrent(),this.log(a+" exceeds "+this._opts.maxSize+"K limit"),this._opts.onSizeError.call(this,a,c),!1):!0},submit:function(){"use strict";var a,b,c;this._disabled||this._active>=this._opts.maxUploads||this._queue.length<1||(this._file=this._queue[0],d?(a=e.getFilename(this._file.name),c=Math.round(this._file.size/1024)):a=e.getFilename(this._file.value),b=e.getExt(a),this._checkFile(a,b,c)&&!1!==this._opts.onSubmit.call(this,a,b)&&(this._active++,(this._opts.multiple===!1||this._opts.queue===!1&&this._active>=this._opts.maxUploads)&&this.disable(),d?this._uploadXhr(a,c,this._sizeBox,this._progBar,this._progBox,this._pctBox):this._uploadIframe(a,this._sizeBox,this._progBar,this._progBox,this._pctBox),this._sizeBox=this._progBar=this._progBox=this._pctBox=null))}},a.ss=e}(window,document),marked.setOptions({gfm:!0,tables:!0,breaks:!1,pedantic:!1,sanitize:!0,smartLists:!0,smartypants:!1,langPrefix:"lang-"});var md=document.getElementById("markdown"),target=document.getElementById("render");render.innerHTML=marked(md.value),md.addEventListener("keyup",renderMarkdown);var uploader=new ss.SimpleUpload({button:"upload",url:"/admin/image-upload",name:"image",multipart:!0,onComplete:function(a,b){if(b=JSON.parse(b),b.hasOwnProperty("error"))alert("File upload failed. Error : "+b.error);else{var c=$("#uploads"),d=$(document.createElement("li")),e=$(document.createElement("input")),f=$("#markdown"),g="!["+a+"]("+b.url+")";e.attr("type","text"),e.attr("value",g),e.attr("disabled","true"),e.addClass("form-control"),c.removeClass("hidden"),e.appendTo(d),d.appendTo(c),f.val(g+"\n\n"+f.val()),renderMarkdown()}}});