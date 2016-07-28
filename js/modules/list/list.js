// skin模块
define(function(require){
	// 加载节流函数模块
	var Throttle=require("tools/Throttle");
	// 加载skin集合
	var skinCollect=require("modules/collection/skin");
	// 加载 skin View模块
	var skinView=require("modules/skin/skin");
	var list=Backbone.View.extend({
		// 列表模板
	tpl: _.template('<a href="#layer/<%=id%>"><img style="<%=style%>" src="<%=url%>" alt="" /></a>'),
	// 左边ul的高度
	leftHeight:0,
	// 右边ul的高度
	rightHeight:0,
	// 构造函数，初始化时用
	initialize:function(){
		// 获取数据
		this.getData();
		// 初始化DOM.获取元素
		this.initDom();
		// 事件的监听，collection上有add事件会触发，listenTo可以模块***
		this.listenTo(this.collection,"add",function(model){
			//渲染模块
			this.render(model);
		})
		// 绑定事件
		this.bindEvents();
	},
	bindEvents:function(){
		var This=this;
		var lock=true;
		var lock1=true;
		// scroll事件的处理
		$(window).scroll(function(){
			// 返回顶部函数，当scroll大于200的offset高度触发，lock让他值触发一次，节流作用
			if($(window).scrollTop()>200&&lock1){
				lock1=false;
				$(".list .go-top").show();

			}
			if($(window).scrollTop()<200&&!lock1){
				lock1=true;
				$(".list .go-top").hide();
			}
			// navBar的处理函数，滚动距离大于navBar的offset高度的是触发，并有节流，防止高并发
			if($(window).scrollTop()>120&&lock){
				lock=false;
				// 定位设置为fixed;
				$(".list .nav").css({"position":"fixed",
									"left":0,
									"top":0
									})
			}
			if($(window).scrollTop()<=120&&!lock){
				lock=true;
				
				$(".list .nav").css({"position":"relative"})
			}
			// 当滚动的距离大于  scroll的高度/(document的高减去窗口的高度)的比值则触发，
			// scale 我设置为0.7
			var scale=$(window).scrollTop()/($(document).height()-$(window).height());	
			if(scale>0.7){
				// 节流函数，$(window).scroll为高频触发事件
				Throttle(This.getData,{time:350,context:This})			
			}	
		})
		// 搜索框事件，按下enter键并有value 才触发
		$(window).keydown(function(event){
			// 获取input 的value
			var value=This.$(".search-input").val();;
			if(event.keyCode==13&&value){
				This.showSearch();
			}
		})
	},
	// 绑定事件
	events:{
		"click .search-click":"showSearch",
		"click .nav li":"showListItem",
		"click .list .back":"showListBack",
		"tap .list .go-top":"showTop",
		"tap .list .image-list img":"animationLayer",
		"tap .list .login":"showSkin"
	},
	// 显示换肤模块
	showSkin:function(){
		$("#skin").css("display","block")
			if($("#skin ul").html()==""){
			var skinview=new skinView({
			collection:new skinCollect(),
			el:"#skin"
		})
		}
		// 打开关闭的条件判断，根据是否有open类
		if($("#skin ul").hasClass("open")){
				
			$("#skin ul").removeClass("open");
			$("#skin").css("top",-161);
			$("#list").css("marginTop",-161)
		}
		else{
			$("#skin ul").addClass("open");
			$("#skin").css({"top":0});
			$("#list").css({"marginTop":0,"transition":".4s all 0s linear"})
		}
	
		
		
	},
	// 大图页的动画
	animationLayer:function(){
		$("#layer").css({"left":"0%"})
	},
	// 返回顶部
	showTop:function(){
		$(window).scrollTop(0,0)
	},
	// 重新加载列表页
	showListBack:function(){
		this.clearSearch();

		this.renderSearch(this.collection)

	},
	// nav的条件选择，图片分类
	showListItem:function(e){
		var dom=e.target;
		var Id=this.getLiId(dom);
		var result=this.getClickData(Id,"type");
		this.renderModelFromTouch(result);
	},
	// 得到点击的value，并返回过滤的集合
	getClickData:function(val,key){
		 key=key||"title";
		var result=this.collection.filter(function(model){
			return model.get(key)==val;
		})
		return result;
	},
	// 渲染选择的结果
	renderModelFromTouch:function(data){
		this.clearSearch();
		this.renderSearch(data);

	},
	// 获取id
	getLiId:function(dom){
		return $(dom).data("id");
	},
	// 显示搜索的结果
	showSearch:function(){
		var value=this.getSearchValue();
		if(value){	
		var result=this.getSearchData(value);
		this.resetView(result);
		};
		
	},
	// 重置list列表
	resetView:function(result){
		this.clearSearch();
		this.renderSearch(result);
	},
	// 渲染search列表
	renderSearch:function(result){
		var This=this;
		result.forEach(function(model){
			This.render(model)
		})
	},
	// 清除ul里面的html内容
	clearSearch:function(){
		this.leftHeight=0;
		this.rightHeight=0;
		this.leftContainer.html("");
		this.rightContainer.html("");
	},
	// 得到search里面的内容并返回过滤的集合
	getSearchData:function(val,key){
			 key=key||"title";
		var result=this.collection.filter(function(model){
			return model.get(key).indexOf(val)!=-1;
		})
		return result;
	},
	// 得到search的value
	getSearchValue:function(){
		var value=this.$(".search-input").val();
		if(/^\s*$/.test(value)){
			alert("请输入query")
			return;
		}
		return value.replace(/^\s+|\s+$/g,"");
	},
	// 得到collection的数据
	getData:function(){
		this.collection.feachData();
	},
	// 初始化DOM
	initDom:function(){
		this.leftContainer=this.$(".left-list");
		this.rightContainer=this.$(".right-list");
	},
	// 渲染model到ul里面
	render:function(model){
		//数据分离
		
		var data={
			id:model.get("id"),
			style:["width:",model.get("showWidth"),"px;height:",model.get("showHeight"),"px;"].join(""),
			url:model.get("url")
		};
		//模板渲染
		var tpl=this.tpl(data)
		//ul的高度大小判断，谁小查到谁里面
		if (this.leftHeight > this.rightHeight) {
				this.renderRight(tpl, model.get('showHeight'));
			} else {
				this.renderLeft(tpl, model.get('showHeight'));
			}
	},
	// 渲染左边的ul
	renderLeft:function(tpl,height){
		// 加6是li 的下margin
		this.leftHeight+=height+6;
		this.leftContainer.append($(tpl))
	},
	// 渲染右边的ul
	renderRight: function (tpl, height) {
			this.rightHeight += height + 6;
			this.rightContainer.append($(tpl))
		}
	})
	return list;
})
