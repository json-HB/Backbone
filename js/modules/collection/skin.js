define(function(require){
	// 加载skin模块
	var skinModel=require("modules/model/skin");
	var skinCollect=Backbone.Collection.extend({
		model:skinModel,
		// 构造函数,只有在new的时候执行一次
		initialize:function(){
			//...
		},
		// 请求skin数据函数
		feachData:function(callback){
			var This=this;
			// 发送get请求
			$.get("data/imgSkin.json",function(res){
				if(res.errno==0){
					This.add(res.data);
				}
			})
			// 回调函数
			callback&&callback()
		}
	})
	// 返回接口
	return skinCollect;
})
