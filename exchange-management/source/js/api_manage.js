define('api_mkt_management', ['cookie'], function() {
	var basePath = 'http://172.16.33.2:8080/exchange_manager';//测试环境
	// var basePath = 'http://localhost/exchange_manager';  //本地环境
    // var basePath = '//manager.goopal.net.cn/exchange_manager';  //线上环境
	var api = {};
	var goIndex = function(useURL) {		//返回首页
		if (useURL) {
		}
		if (window.location.href.indexOf('/home.html') === -1) {
			return window.location.href = 'home.html';
		} else {
			alert('无法获得用户信息');
		}
	};
	// 方便cookie
	$.gopToken = function(token) {
		return $.cookie('gopToken', token);
	};
	/** [add 添加接口]
	 * @Author   张树垚
	 * @Date     2015-10-13
	 * @param    {[string]}		      name                     [api名称]
	 * @param    {[string]}           url                      [api地址]
	 * @param    {[json]}             options                  [api地址]
	 *           {[function]}         options.callback         [接口固定回调]
	 *           {[boolean]}          options.asyn             [是否异步请求]
	 *           {[array]}            options.ignoreStatus     [忽略状态码的默认提示]
	 * @特点:
	 *     1.同步请求, 连续请求会自动中断上一个
	 */
	var add = function(name, url, options) {
		if (name in api) {
			alert('api名称' + name + '已存在!');
			return;
		}
		for (var i in api) {
			if (api.hasOwnProperty(i) && api[i] === url) {
				alert('该接口地址' + url + '已添加!');
				return;
			}
		}
		var xhr = null;
		options = options || {};
		api[name] = function(data, success) { // 每个接口具体请求
			if (xhr && !options.asyn) {
				xhr.abort();
				xhr = null;
				return;
			}
			if (typeof data === 'function') {
				success = data;
				data = {};
			}
			// console.log(url);
			xhr = $.ajax({
				url: basePath + url,
				type: 'post',
				data: JSON.stringify(data),
				dataType: 'json',
				timeout: 30000,
				success: function(data) {
					if (!data) {
						// alert('1:' + name + ';' + $.cookie('gopToken'));
						return goIndex(true);
					}
					if (data.status == 300 && options.ignoreStatus && options.ignoreStatus.indexOf(300) === -1) { // {msg: "用户登录/验证失败，请重新登录", status: "300"}
						// alert(2);
						goIndex(true);
					} else if (data.status == 304 && options.ignoreStatus && options.ignoreStatus.indexOf(304) === -1) { // {msg: "服务器异常", status: "304"}
						//$.alert('服务器异常, 请联系后台人员!');
						alert('服务器异常');
					}else if(data.status==444){
						// alert("asfd")
						// parent.location.href="./login.html";
					}
					options.callback && options.callback.call(this, data);
					success && success.call(this, data);
				},
				error: function(xhrObj, text, err) {
					console.log('Error: ', arguments);
					if (text === 'timeout') {
						//$.alert('请求超时...<br>请检查您的网络');
						alert('请求超时...<br>请检查您的网络');
					}
				},
				complete: function() {
					xhr = null;
				}
			});
		};
	};
	/** 打印一条醒目的信息
	 * @Author   张树垚
	 * @DateTime 2015-10-29
	 * @param    {string}     msg  [信息]
	 * @return
	 */
	api.log = function(msg) {
		console.log('\n%c' + msg,
			'color: white;' +
			'background-color: red;' +
			'padding: .4em 1.5em;' +
			'font-size: 20px;' +
			'font-weight: bold;' +
			'border-radius: 8px;' +
			'border: 2px solid gray;' +
			'text-shadow: 0px 0px 1px rgba(0,0,0,1);' +
			'height: 30px;' +
			'cursor: pointer;' +
			''
		);
	};

	//后台登录
	add('login','/login/login');
	//后台登出
	add('logout','/login/logout');
	//后台重置密码
	add('setLoginPassword','/login/setLoginPassword');
	//后台创建管理员
	add('create','/login/create');
	//后台锁定管理员
	add('lockAdmin','/login/lockAdmin');
	//后台解锁管理员
	add('unlockAdmin','/login/unlockAdmin');
	//人民币充值/提现查询
	add('transfer','/cny/transfer');
	//人民币充值/提现确认
	add('confirmTransfer','/cny/confirmTransfer');
	//人民币充值/提现撤销
	add('cancelTransfer','/cny/cancelTransfer');
	//人民币提现锁定
	add('lockTransfer','/cny/lockTransfer');	
	//人民币提现解锁
	add('unlockTransfer','/cny/unlockTransfer');
	//果仁转入查询
	add('transferGopInput','/gop/transfer');
	//果仁转出查询
	add('transferGopOutput','/gop/transfer');
	//果仁转入转出查询
	add('transferGop','/gop/transfer');
	//果仁挂单查询
	add('trade','/gop/trade');
	//果仁成交查询
	add('order','/gop/order');
	add('confirmGop','/gop/confirmGop');
	//用户列表
	add('userList','/user/userList');
	//用户_基本信息
	add('userInfo','/user/userInfo');
	//用户银行卡信息
	add('userAcBank','/user/userAcBank');	
	//后台管理员列表
	add('adminList','/login/adminList');

	add('refundTransfer','/cny/refundTransfer');

	add('cibPay','/cny/cibPay');
	return api;
});