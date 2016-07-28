
// img的集合
define(function(require,exports,modules){
	// 引用img模块
	var imgModel=require("modules/model/img");

	var imgCollection=Backbone.Collection.extend({
		model:imgModel,
		imageId:0,
		// 请求img数据
		feachData:function(callback,data){
			var that=this;
			// 发送ajax请求
			$.get("data/imageList.json",function(res){
				//console.log(res)
				if(res.errno===0){
						// 打乱图片排序
						res.data.sort(function(){
						return Math.random()-0.5;
					})
						// 给每个图片加上id
					res.data.map(function(value){
						value.id=that.imageId++;
					})
					//console.log(res.data)
					that.add(res.data);
					// 回调函数
					callback&&callback();
					}			
			})

		}
	})
	return imgCollection;
})
