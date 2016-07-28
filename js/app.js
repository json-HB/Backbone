define(function(require){
	// 引用模块
	var list=require("modules/list/list");
	var layer=require("modules/layer/layer");
	var collection=require("modules/collection/img");
	// 加载img的collection,避免在每次new的时候重复调用
	var ImgCollection=new collection(); 
	// 渲染大图页
	var layerView=new layer({
				el:$("#layer"),
				collection:ImgCollection
			})
	// 渲染列表页
	var listView=new list({
			el:$("#list"),
			collection:ImgCollection
		})
	// 开启backbone的路由功能
	var Router=Backbone.Router.extend({
		routes:{
			// 跳转到大图页面/num是跳转到id,通过传参过去
			"layer/:num":"showlayer",
			// 其他的hash值都跳转到大图页面
			"*other":"showlist"
		},
		// 显示列表页
		showlist:function(){
			$("#list").show();
			
		},
		// 显示大图页
		showlayer:function(num){
			//返回顶部
			$(window).scrollTop(0,0);
			// 渲染大图页
			layerView.render(num);
			// 动画形式展现
			$("#layer").css({"left":0});
			
		}

		});
	// 返回接口
	return function(){
		var route=new Router();
		// 开启history
		Backbone.history.start();
	}

	})
