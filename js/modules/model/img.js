define(function(require,exports,modules){
	// 每个ul的宽度，6*3是padding值见css
	var listWidth=parseInt(($(window).width()-6*3)/2);
	var imgModel=Backbone.Model.extend({
		initialize:function(){
			// 监听add事件
			this.on("add",function(model){
				// 得到计算后图片的高度
				var h=parseInt(model.get("height")*listWidth/model.get("width"));
				// 加入到model属性中
				model.set({
					showWidth:listWidth,
					showHeight:h
				})
			})
		}
	})
	// 返回接口
	return imgModel;

})
