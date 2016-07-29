// skin的View模块
define(function(require){
	// 加载css
	var arr=[
		'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2015-08-25/f38093604807c2cc31a84ca4194a0f4e.jpg',
		'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2015-08-25/27fbf0ab0754745cf2b10c7e2309e9a5.jpg',
		'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2015-08-25/1f21ed37e8dd574880fcf893b0051ca9.jpg',
		'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2015-08-25/b430a1dfcea3e9053662d9f57509e731.jpg',
		'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2015-08-25/3be7d0a25df72988ca2d78b4e45aa88f.jpg',
		'https://www.hao123.com/r/image/2015-08-28/3bc7a03c8a30e719a4bab308efbe2fec.jpg',
		'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2015-10-29/5d91878107d17b97037081a312791fb5.jpg',
		'https://gss1.bdstatic.com/5eN1dDebRNRTm2_p8IuM_a/res/r/image/2015-08-25/af26c9afaa9118e3c95e6d69bdb4d68d.jpg',
		'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2015-08-25/e0557ce96599f3e9b6bcab6e6c5e0e71.jpg',
		'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2015-08-25/bef59c8e58cb93ef694290d0fef9916b.jpg',
		'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2015-08-25/0a36d2f0a8f90e1adaf788a786343fa2.jpg',
		'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2015-08-25/685c0cfe2db0de1a6b5aa3cf93650d2f.jpg'
	]
	var skin=Backbone.View.extend({
		dom:null,
		liImgId:1,
		// 最后的img idz值
		lastImgId:1,
		// unitd的总宽度
		allLength:0,
		num:0,
		// 获取文档宽
		winWidth:document.documentElement.clientWidth,
		// 最小宽度
		minWidth:0,
		// 模板html
		tpl:_.template('<li><img data-id="<%=id%>" src="<%=url%>"/></li>'),
		initialize:function(){
			var This=this;	
			// 获取数据
			this.collection.feachData();
			// 事件的监听，collection上有add事件会触发，listenTo可以模块
			this.listenTo(this.collection,"add",function(model){
				This.num++;
				if(This.num==This.collection.length){
					// 加载完成计算长度allLength和minWidth
					This.allLength=190*This.collection.length;
					This.minWidth=This.allLength-This.winWidth;
				}
				this.render(model)
			});
			// 绑定事件
			this.bindEvents();
		},
		// 抛掷算法
		bindEvents:function(){
			var This=this;
			var deltaX;
			var nowX=0;
			var moveArr=[];
			var unit=this.$("ul")[0];
			// 手指触摸开始事件
			$("#unit").on("touchstart",function(event){
				event.preventDefault();
				moveArr=[];
				// 过度取消
				unit.style.transition="none";
				// 补偿值
				deltaX=event.touches[0].clientX-nowX;
			},false);
			// touchmove事件
			$("#unit").on("touchmove",function(event){
				event.preventDefault();
				nowX=event.touches[0].clientX-deltaX;
				unit.style.left=nowX+"px";
				// 将event.touches[0].clientX的值存入数组
				moveArr.push(event.touches[0].clientX)
			},false);
			// touchend事件
			$("#unit").on("touchend",function(event){
				event.preventDefault();
				// 获取最后一次的event.touches[0].clientX得到
				var s=moveArr[moveArr.length-1]-moveArr[moveArr.length-2];
				// 放大倍数
				var targetx=nowX+s*9;
				// 根据transition的cubic-bezier来实现来回拉的效果
				if(targetx<-This.minWidth){
					targetx=-This.minWidth;
					unit.style.transition= "all 0.6s cubic-bezier(0.15, 0.85, 0.15, 2.08) 0s";
				}
				else if(targetx>0){
					targetx=0;
					unit.style.transition = "all 0.6s cubic-bezier(0.15, 0.85, 0.15, 2.08) 0s";
				}
				else{
					unit.style.transition = "all 0.4s cubic-bezier(0.18, 0.68, 0.65, 0.88) 0s";
				};
				unit.style.left = targetx +"px";
				// 变化量赋给nowX
				nowX=targetx;

			},false);

		},
		// 渲染到页面
		render:function(model){
			// 转成json数据
			var data=model.toJSON();
			this.dom=this.tpl(data);
			// 插入ul
			this.$("ul").append($(this.dom));
			// ul不为空则下降
			if(this.dom!=null){
				this.skinDown();
			}
		},
		// skin模块下降
		skinDown:function(){
			$("#skin ul").removeClass("open");
			$("#skin").css({"top":0});
			$("#list").css({"marginTop":0,"transition":".4s all 0s linear"})
		},
		// 绑定事件
		events:{
			"tap li img":"showBG",
			"tap .skin-btn .lei span":"choosePic",
			"tap .skin-btn .cancel":"cancelFn",
			"tap .skin-btn .sure":"changeBG",
		},
		// skin模块收起来
		upToTop:function(){
			$("#skin ul").removeClass("open");
			$("#skin").css("top",-161);
			$("#list").css("marginTop",-161)
		},
		// 取消换肤
		cancelFn:function(){
			this.showBGImg(this.lastImgId);
			this.upToTop();
		},
		// 改变背景
		changeBG:function(){		
			this.lastImgId=this.liImgId;
			this.showBGImg(this.lastImgId);
			this.upToTop();
		},
		// 选择图片
		choosePic:function(e){
			var id=$(e.target).attr("data-id")
			var result=this.collection.filter(function(model){
				return model.get("type")==id;
			})
			this.delresult(result);
			this.$("ul").css("left",0);
		},
		// 处理分类的结果
		delresult:function(result){
			this.clearUl();
			var This=this;
			// 遍历数组model
			result.forEach(function(model){
				This.render(model);
			})
			this.allLength=190*result.length;
			this.minWidth=this.allLength-this.winWidth;
		},
		// 清除ul的html内容
		clearUl:function(){
			this.$("ul").html("");
		},
		// 背景图片跟更换
		showBGImg:function(id){
			id--;
			$("#header").css({"background":"url("+arr[id]+")"})
		},
		// 显示背景
		showBG:function(e){
			// tap事件的隐患，tap会将其他的触摸事件都取消掉，必须重新渲染一次bindEvent事件
			this.bindEvents();
			this.liImgId=$(e.target).attr("data-id");
			this.showBGImg(this.liImgId);

		}

	})
	// 返回接口
	return skin;
})
