var xyutil={
	sel:function(obj, sv){
		if(obj!=undefined &&obj.options!=undefined && sv!=undefined){
			obj.value=sv;
			for(var i=0;i<obj.options.length;i++){
				if(sv==obj.options[i].value){obj.options[i].selected=true;break;}
			}
		}
	},
	getChkboxList:function(formId, name, chkFlag){
		var f=document.forms[formId];
		if(f==null){
			return [];
		}else{
			var elements=f.elements[name];
			if(!elements){return [];}
			if(!elements.length){
				var arr1=[];arr1.push(elements);
				elements=arr1;
			}
			if(chkFlag==undefined){
				return elements;
			}
			var arr1=[];
			for(var i=0;i<elements.length;i++){
				if(elements[i]["checked"]==true){
					arr1.push(elements[i]);
				}
			}
			return arr1;
		}
	},
	clearSelect:function(sel){
		if(sel!=null)while(sel.childNodes.length>0){sel.removeChild(sel.childNodes[0]);}
	},
	buildSelectOption:function(sel, text, val){
		if(sel!=null && text!=null){
			sel.options[sel.options.length] = new Option(text, val);
		}
	},
	isNull:function(obj){
		return obj==null||obj==undefined;
	},/*设置值,如果空*/
	setValueIfNull:function(obj, key, value){
		if(this.isNull(obj) || this.isNull(key) || this.isNull(value)){
			;
		}else{
			var cv=obj[key];
			if(cv==null){
				obj[key]=value;
			}
		}
	},/*param {method:GET/POST, success:function(data){}, fail:function(data){}}*/
	ajax:function(param){
		if(param!=null){
			this.setValueIfNull(param, "type", "POST");
			this.setValueIfNull(param, "error", function(st){xyutil.alert("ajax请求返回状态错误!\n"+st);});
			param.traditional=true;
			var oldSuccFunc=param.success;
			param.success=function(data, textStatus, jqXHR){
				//检查是否登录
				if(jqXHR.getResponseHeader("shop_login_expired")=="1"){
					alert("超时，请重新登录");
					document.location.href="/login.jsp";
					//xyutil.alert({"msg":"超时，请重新登录", "ok_callback":function(){document.location.href="/login.jsp";}});
				}else if(jqXHR.getResponseHeader("shop_user_no_authority")==1){
					alert("无此权限，请联系店铺管理员分配!");
					//xyutil.alert({"msg":"您没有权限进行当前操作"});
				}else{
					oldSuccFunc.apply(this, arguments);
				}
			}
			$.ajax(param);
		}
	},
	createBox:function(config){
		config["closeOnClickBgLayer"]=config["closeOnClickBgLayer"]||false;
		var wh={w:document.documentElement.clientWidth,h:document.documentElement.scrollHeight};
		if(wh["h"]<(config["height"]+document.documentElement.scrollTop+150+10)){
			wh["h"]=config["height"]+document.documentElement.scrollTop+150+20;
		}
		//页面可视区域高度
		var dh=(window.innerWidth?window:(document.documentElement||document.body))[window.innerWidth?"innerHeight":"clientHeight"];
		if(wh["h"]<dh){
			wh["h"]=dh;
		}
		var bgLayer=document.createElement("div");
		bgLayer.style.cssText="position:absolute;padding:0px;margin:0px;top:0px;left:0px;display:block;opacity:0.3;z-index:1000;background-color:#000000;-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(opacity=30)';filter:progid:DXImageTransform.Microsoft.Alpha(opacity=30);";
		//bgLayer.id="pop_bg_layer_"+config["id"];
		//document.getElementsByTagName("body")[0].appendChild(bgLayer);
		bgLayer.style.top="0px"
		bgLayer.style.left="0px";
		bgLayer.style.width=wh["w"]+"px";
		bgLayer.style.height=wh["h"]+"px";
		bgLayer.id="pop_bg_layer_"+config["id"];
		//bgLayer.lid=config["id"];
		if(config["closeOnClickBgLayer"]==true){
			bgLayer.onclick=function(){
				var bgLayer=this;
				bgLayer.parentNode.removeChild(bgLayer);
				var box=document.getElementById("pop_box_"+config["id"]);
				if(box!=null){
					box.parentNode.removeChild(box);
				}
				config["close_callback"].call(this);
			};
		}
		document.getElementsByTagName("body")[0].appendChild(bgLayer);
		
		var popBox=document.createElement("div"),titleBox=document.createElement("div");
		popBox.id="pop_box_"+config["id"];
		//popBox.lid=config["id"];
		popBox.style.cssText="position:absolute;left:"+((wh["w"]-config["width"])/2)+"px;top:"+((document.body.scrollTop||document.documentElement.scrollTop)+150)+"px;width:"+config["width"]+"px;height:"+(config["type"]=="window"?config["height"]:"auto")+"px;display:block;z-index:1100;background-color:#ffffff;padding-bottom:5px;border-radius:5px;-moz-border-radius:5px;box-shadow:0px 0px 20px #333333;";
		bgLayer.parentNode.appendChild(popBox);
		var tb1=document.createElement("div"), tb2=document.createElement("div");
		popBox.appendChild(titleBox);
		titleBox.style.cssText="width:"+config["width"]+"px;height:30px;line-height:30px;overflow:hidden;background-color:#AE111D;border-top-left-radius:5px;border-top-right-radius:5px;-moz-border-radius:5px;";
		tb1.style.cssText="width:"+(config["width"]-50)+"px;height:30px;line-height:30px;font-weight:bold;font-size:14px;text-align:left;float:left";
		var span=document.createElement("span");
		span.style.cssText="padding-left:10px;color:#FFF";
		span.innerHTML=config["title"];
		tb1.appendChild(span);
		titleBox.appendChild(tb1);
		tb2.style.cssText="width:50px;height:30px;line-height:30px;text-align:right;float:right";
		var a=document.createElement("a");
		a.innerHTML="关闭";
		a.style.cssText="color:#FFF;font-size:12px;padding-right:10px;text-decoration:none;";
		a.href="javascript:void(0);";
		tb2.appendChild(a);
		a.onclick=function(){
			var box=this.parentNode.parentNode.parentNode;
			box.parentNode.removeChild(box);
			var bgLayer=document.getElementById("pop_bg_layer_"+config["id"]);
			if(bgLayer!=null){
				bgLayer.parentNode.removeChild(bgLayer);
			}
			config["close_callback"].call(this);
		}
		titleBox.appendChild(tb2);
		var contentBox=document.createElement("div");
		contentBox.style.cssText="width:"+config["width"]+"px;height:"+((config["type"]=="window"?(config["height"]-40):"auto"))+"px;overflow:hidden;text-align:center;background-color:#fff;padding:0px;margin:0px;";
		popBox.appendChild(contentBox);
		return {"wh":wh, "bgLayer":bgLayer, "popBox":popBox, "contentBox":contentBox};
	},
	/*创建背景滤镜层*/
	alert:function(config){
		config=config||{};
		config["type"]="alert";
		config["ok_callback"] = config["ok_callback"]||function(){};
		config["close_callback"] = config["close_callback"]||config["ok_callback"];
		config["msg"] = config["msg"]||"";
		config["title"]=config["title"]||"提示";
		config["ok_text"]=config["ok_text"]||"确定";
		config["width"] = config["width"]||400;
		config["height"]=config["height"]||"auto";
		config["id"]=config["id"]||Math.random();
		var pbc=this.createBox(config), msgBox=document.createElement("div"), ctlBox=document.createElement("div"), okBtn=document.createElement("input");
		msgBox.style.cssText="height:auto;line-height:20px;margin:10px;font-size:12px;white-space:normal;word-wrap:break-word";
		msgBox.innerHTML=config["msg"];
		pbc["contentBox"].appendChild(msgBox);
		ctlBox.style.cssText="width:100%;height:30px;text-align:center;margin:10px auto 5px auto";
		pbc["contentBox"].appendChild(ctlBox);
		okBtn.type="button";
		okBtn.value=config["ok_text"];
		okBtn.style.cssText="padding:4px 18px;font-size:12px;";
		ctlBox.appendChild(okBtn);
		okBtn.onclick=function(){
			var box=this.parentNode.parentNode.parentNode;
			box.parentNode.removeChild(box);
			var bgLayer=document.getElementById("pop_bg_layer_"+config["id"]);
			if(bgLayer!=null){
				bgLayer.parentNode.removeChild(bgLayer);
			}
			config["ok_callback"].call(this);
		};
		okBtn.focus();
	},
	confirm:function(config){
		config=config||{};
		config["type"]="confirm";
		config["ok_callback"] = config["ok_callback"]||function(){};
		config["close_callback"] = config["close_callback"]||function(){};
		config["cancel_callback"] = config["cancel_callback"]||config["close_callback"];//如果没有指定取消事件回调函数,则使用关闭事件函数
		config["msg"] = config["msg"]||"";
		config["title"]=config["title"]||"确认提示";
		config["ok_text"]=config["ok_text"]||"确定";
		config["cancel_text"]=config["cancel_text"]||"取消";
		config["width"] = config["width"]||400;
		config["height"]=config["height"]||"auto";
		config["id"]=config["id"]||Math.random();
		var pbc=this.createBox(config), msgBox=document.createElement("div"), ctlBox=document.createElement("div"), okBtn=document.createElement("input"), ccBtn=document.createElement("input");
		msgBox.style.cssText="height:auto;line-height:20px;margin:10px;font-size:12px;white-space:normal;word-wrap:break-word";
		msgBox.innerHTML=config["msg"];
		pbc["contentBox"].appendChild(msgBox);
		ctlBox.style.cssText="width:100%;height:30px;text-align:center;margin:5px auto 5px auto";
		pbc["contentBox"].appendChild(ctlBox);
		okBtn.type="button";
		okBtn.value=config["ok_text"];
		var btnCss="padding:4px 18px;font-size:12px;";
		okBtn.style.cssText=btnCss;
		ctlBox.appendChild(okBtn);
		okBtn.onclick=function(){
			var box=this.parentNode.parentNode.parentNode;
			var bgLayer=document.getElementById("pop_bg_layer_"+config["id"]);
			if(bgLayer!=null){
				bgLayer.parentNode.removeChild(bgLayer);
			}
			box.parentNode.removeChild(box);
			config["ok_callback"].call(this);
		};
		okBtn.focus();
		ccBtn.type="button";
		ccBtn.value=config["cancel_text"];
		ccBtn.style.cssText=btnCss+";margin-left:10px;";
		ctlBox.appendChild(ccBtn);
		ccBtn.onclick=function(){
			var box=this.parentNode.parentNode.parentNode;
			var bgLayer=document.getElementById("pop_bg_layer_"+config["id"]);
			if(bgLayer!=null){
				bgLayer.parentNode.removeChild(bgLayer);
			}
			box.parentNode.removeChild(box);
			config["cancel_callback"].call(this);
		};
	},
	closeBox:function(lid){
		var arr=["pop_bg_layer_","pop_box_"];
		for(var k=0;k<arr.length;k++){
			var node=document.getElementById(arr[k]+lid);
			if(node!=null){
				node.parentNode.removeChild(node);
			}
		}
	},/*弹出层*/
	popBox:function(config){
		config=config||{};
		config["type"]="window";
		config["width"]=config["width"]||800;
		config["height"]=config["height"]||600;
		config["cat"]=config["cat"]||"iframe";
		config["title"]=config["title"]||"";
		config["close_callback"]=config["close_callback"]||function(){};
		config["id"]=config["id"]||Math.random();
		if(config["width"]<200){config["width"]=200;}
		if(config["height"]<100){config["height"]=100;}
		switch(config["type"]){
		case "iframe":
			if(config["url"]==null){
				alert("请指定iframe地址");return;
			}
			break;
		case "html":
		default:
			if(config["html"]==null){
				config["html"]="";
			}
			break;
		}
		var pbc=this.createBox(config);
		if("iframe"==config["cat"]){
			var iframe=document.createElement("iframe");
			iframe.scrolling="no";
			iframe.frameBorder="0px";
			iframe.border="0px";
			iframe.style.cssText="border:0px;width:"+config["width"]+"px;height:"+(config["height"]-40)+"px;padding:0px;margin:0px;";
			iframe.src=config["url"];
			pbc["contentBox"].appendChild(iframe);
		}else{
			pbc["contentBox"].innerHTML=config["html"];
		}
	}
};
