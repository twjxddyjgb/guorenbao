// 张树垚 2016-01-10 00:31:49 创建
// H5微信端 --- 账单


require(['router', 'api', 'get', 'filters', 'h5-component-bill', 'iScroll4', 'h5-view-bill','mydate',
	'h5-weixin'
], function(router, api, get, filters, H5bill, iScroll, billView,mydate) {

	router.init();
	var gopToken = $.cookie('gopToken');
	var page = 1; // 账单页数, 当返回列表长度小于当前列表长度时, 置零, 不再请求
	var size = 20; // 账单列表

	var main = $('.account'); // 主容器
	var init = function() { // 初始化
		switch (get.data.from) {
			case 'wx_info': // 来自微信消息
				billView.set(get.data.type, get.data.id);
				router.to('/view/bill');
				break;
			default:
				router.to('/');
				getList();
		}
	};

	var originList = [];
	var bottomHeight = 20; // 下拉加载的高度
	var accountScroll = new iScroll('account', {
		vScrollbar: false,
		preventDefault: true,
		click: true,
		// useTransition: true,
		onScrollMove: function() {},
		onScrollEnd: function() {
			if (this.y - bottomHeight < this.maxScrollY) {
				getList();
			}
		},
	});
	var getList = function(callback) { // 获取列表
		if (vm.loading) {
			return;
		}
		if (!page) {
			vm.loading = true;
			vm.loadingWord = '大大, 已经没有了...';
			setTimeout(function() {
				vm.loading = false;
			}, 1000);
			return;
		}
		vm.loading = true;
		api.billList({
			gopToken: gopToken,
			billListPage: page,
			billListPageSize: size
		}, function(data) {
			if (data.status == 200) {
				vm.loading = false;
				vm.list = dataHandler(originList = originList.concat(data.data.list));
				// vm.list.pushArray(dataHandler(data.data.list));
				page = data.data.list.length < size ? 0 : page + 1; // 是否停止请求
				callback && callback(data);
				!main.hasClass('on') && setTimeout(function() {
					main.addClass('on');
				}, 200);
			} else {
				$.alert(data.msg);
				console.log(data);
			}
		});
	};





	var now = new Date(); // 当前时间
	var nowMonth = now.getMonth(); // 当前月份
	var dataAdd = function(kind, bills, item) { // 添加数据
		var type = H5bill.typeClass[item.type];
		var bill = {
			id: item.businessId,
			img: '', // 头像
			name: '', // 姓名
			desc: item.businessDesc,
			status: H5bill.statusBusiness[item.status],
			type: type,
			originType: item.type,
			iconClass: '',
		};
		var types = {
			money: 'money',
			gop: 'gopNumber'
		};
		var coins = {
			money: '¥',
			gop: 'G'
		}
		if (type === 'transfer' && item.extra) {
			bill.img = item.extra.photo || ''; // 转账头像
			if (item.extra.name) { // 转账目标
				bill.desc += ' - ' + filters.omit(item.extra.name);
				bill.name = filters.omit(item.extra.name);
			}
			if (item.extra.transferOutType === 'ME_WALLET' || item.extra.transferInType === 'ME_WALLET') {
				bill.desc += ' - 我的钱包';
				bill.iconClass = 'wallet';
			}
		}
		if (type === 'phone') {
			// if (kind === 'gop') { // 修改money数据, 使其变为人民币支付金额
			// 	item.money = item.gopNumber * item.gopPrice - item.money;
			// 	Math.abs(item.money) < 0.01 && (item.money = 0);
			// }
			if (item.extra && item.extra.phoneInfo) {
				item.extra.phoneInfo.carrier && (bill.desc += ' - ' + item.extra.phoneInfo.carrier); // 运营商
			}
		}
		if (kind === 'all') {
			// console.log(item.extra);
			if (item.extra.recordList.length) {
				item.extra.recordList.forEach(function(item) {
					switch(item.payType) {
						case 'GOP_PAY':
							bill.change = numHandler(-item.payGop, coins['gop']);
							break;
						case 'UNION_PAY':
							bill.change = numHandler(-item.payMoney, coins['money']);
							break;
						default:
							console.log('err:', item);
					}
					bills.push($.extend({}, bill));
				});
			} else {
				bill.change = numHandler(item.money, coins['money']);
				bills.push(bill);
			}
		} else {
			bill.change = numHandler(item[types[kind]], coins[kind]);
			bills.push(bill);
		}
	};
	var dataHandler = function(data) {
		return data.map(function(item) { // 确定时间
			item._date = mydate.parseDate(item.status === 'SUCCESS' ? item.businessTime : item.createTime);
			item._dateTime = item._date.getTime();
			return item;
		}).sort(function(item1, item2) { // 排序
			return item2._dateTime - item1._dateTime;
		}).reduce(function(result, item) { // 提取
			var time = mydate.timeHandler(item._date);
			var type = H5bill.typeClass[item.type];
			var bills = [];
			switch (type) { // 账单类型
				case 'phone': // 消费果仁, 果仁+人民币
					dataAdd('all', bills, item);
					break;
				case 'buy': // 买果仁, 人民币
					dataAdd('money', bills, item);
					break;
				case 'transfer': // 转果仁, 果仁
					dataAdd('gop', bills, item);
					break;
				default:
					console.log(item);
			}
			var compare = mydate.timeCompare(now, item._date);
			var day = {
				id: item.businessId,
				day: compare ? compare : ('周' + time.day2),
				time: compare ? (time.hour2 + ':' + time.minute2) : (time.month2 + '-' + time.date),
				type: type,
				originType: item.type,
				bills: bills,
			};
			if (result.length > 0 && result[result.length - 1].month2 === time.month2) { // 和上个月相同
				result[result.length - 1].days.push(day);
			} else { // 没有这个月份, 创建
				result.push({
					month: nowMonth === time.month ? '本月' : (time.month2 + '月'),
					month2: time.month2,
					days: [day]
				});
			}
			return result;
		}, []);
	};
	var numHandler = function(number, unit) { // 数值处理
		return (number > 0 ? '+' : '-') + ' ' + unit + ' ' + filters.fix(Math.abs(number));
	};
	// 处理 getList 的工具方法 -- 结束

	// 账单列表
	var vm = avalon.define({
		$id: 'account',
		loading: false,
		loadingWord: '加载中...',
		list: [],
		listRepeatCallback: function() { // 循环结束回调
			setTimeout(function() {
				accountScroll.refresh();
			}, 200);
		},
		showAccount: function(ev) { // 显示账单详情(事件代理)
			var target = $(ev.target).closest('.account-item');
			if (target.length) {
				var data = target.get(0).dataset;
				var options = {};
				data.name && (options.transferName = data.name);
				data.img && (options.transferImg = data.img);
				billView.set(data.type, data.id, options);
				router.go('/view/bill');
			}
		}
	});
	avalon.scan(main.get(0), vm);

	// 帐单详情
	billView.on('hide', function() {
		if (!vm.list.length) { // 没有list长度时获取list
			getList();
		}
	});

	init();
});