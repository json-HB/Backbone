define(function(){
	var Throttle = function () {
	// isClear 表示是否清除操作，
	// fn 表示函数的名称
	var isClear = arguments[0], fn;
	// if表示判断执行上面的哪个操作
	if (isClear === true) {
		// 此时是取消操作，那么，fn就是第二个参数
		fn = arguments[1];
		// 清除fn计时器的句柄
		if (fn.__Throttle) {
			clearTimeout(fn.__Throttle);
		}

	// 第一种情况，第一个参数是函数名称，那么执行触发操作的业务逻辑 
	} else {
		// 因为第一个参数已经保存在isClear变量里面，触发操作中。，第一个参数表示的是函数的名称，
		// fn = isClear;
		fn = arguments[0];
		// o表示选项，里面保存用户使用时添加的计时器的时间， 以及函数的作用域，以及fn执行值传递的数据
		var o = arguments[1] || {};
		var param = {
			time: o.time || 200,
			context: o.context || null,
			data: o.data || {}
		}
		// 清除前面的计时器
		clearTimeout(fn.__Throttle);
		// 重新执行一遍清除计时器的操作
		arguments.callee(true, fn)
		fn.__Throttle = setTimeout(function () {
			// 函数在param.context作用域U下执行，并传递进来param.data数据作为参数
			fn.call(param.context, param.data)
		}, param.time)
	}
}
return Throttle;

})
