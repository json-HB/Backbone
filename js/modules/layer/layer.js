// 大图页的模块
define(function(require){
	// 加载大图页的css
	// 获取屏幕的高
	var height = $(window).height();
	// 大图页的View
	var layer=Backbone.View.extend({
		// 模板html
		tpl:_.template($("#layer_tpl").html()),
		modelId:0,
		// 临时的容器，为点击返回时寻找上一次的图片的id
		lastModel:[],
		initialize:function(){
			// 禁止鼠标滚轮事件
			document.onmousewheel=function(){
				return false;
			};
			this.$el.css()
		},
		// 得到img集合的id
		getModelById:function(id){
			this.modelId=id;
			var model=this.collection.get(id);
			return model;
		},
		// 绑定事件，事件委托的形式绑定的
		events:{
			"swipeLeft .img-container img": "showNextImage",
			'swipeRight .img-container img': 'showPreImage',
			"tap .back":"goback",
			"tap .img-container img":"toggleNav"
		},
		// 切换title的显影
		toggleNav:function(){
			this.$(".navbar").toggleClass("hide");
		},
		// 返回上一级
		goback:function(){
			// 把数组的最后一个去掉，在去最后一个的id
			this.lastModel.pop();
			var id=this.lastModel[this.lastModel.length-1];
			if(id){
				// 有id则切换视图
				var model=this.collection.get(id);
				this.changeImage(model);
			}
			else{
				// 没有则返回列表页
				window.location.hash="#";
				$("#layer").css({"left":"100%"});
				// 滚动事件恢复
				document.onmousewheel=null;
			}
		},
		// 显示下一张图片
		showNextImage:function(){
			console.log(222);
			var model=this.collection.get(++this.modelId);
			if(model){
				this.changeImage(model);
				// 把id存入数组
				this.lastModel.push(this.modelId);
			}else{
				alert('已经是最后一张了');
				this.modelId--;
			}
		},
		// 显示上一张图片
		showPreImage:function(){
			console.log(111)
			var model = this.collection.get(--this.modelId)
			if (model) {
				this.changeImage(model);
					// 把id存入数组
				this.lastModel.push(this.modelId);
			} else {
				alert('已经是第一张了');
				this.modelId++;
			}
		},
		// 切换图片
		changeImage:function(model){
			this.$(".img-container img").attr("src",model.get("url"));
			this.$('.navbar h1').html(model.get('title'));
		},
		// 渲染大图页
		render:function(id){
			
			var model=this.getModelById(id);
			if(!model){
				// 没有则返回首页
				window.location.hash="#";
				return;
			}
			this.lastModel.push(this.modelId)
			
			//获取model的属性的集合
			var data=model.pick(["url","title"]);
			//增加style属性
			data.styles='line-height: ' + height + 'px';
			// 模板渲染
			var tpl=this.tpl(data);
			// 插入html
			this.$el.html(tpl);
			this.$el.show();
		
		}
	})
	return layer;
})
