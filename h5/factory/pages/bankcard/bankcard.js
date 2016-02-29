// 余效俭 2016-01-08 8:58:22 创建
// H5微信端 --- 银行卡信息


require(['router', 'api', 'h5-view', 'hashMap',
	'h5-bankcard-append', 'h5-ident', 'h5-text', 'h5-weixin'
], function(router, api, View, hashMap,
	bankcardAppend, bankcardIdent) {

	router.init(true);

	var gopToken = $.cookie('gopToken');

	var bankcard = $('.bankcard');
	hashMap.put('中国民生银行', 'minsheng');
	hashMap.put('中国邮政储蓄银行', 'youzheng');
	hashMap.put('中国光大银行', 'guangda');
	hashMap.put('交通银行', 'jiaotong');
	hashMap.put('上海浦东发展银行', 'pufa');
	hashMap.put('上海银行', 'shanghai');
	hashMap.put('兴业银行', 'xingye');
	hashMap.put('中国建设银行', 'zhongjian');
	hashMap.put('北京农商银行', 'beinong');
	hashMap.put('北京银行', 'beiyin');
	hashMap.put('中国工商银行', 'gongshang');
	hashMap.put('广发银行', 'guangfa');
	hashMap.put('华夏银行', 'huaxia');
	hashMap.put('平安银行', 'pingan');
	hashMap.put('招商银行', 'zhaoshang');
	hashMap.put('中国银行', 'zhongguo');
	hashMap.put('中信银行', 'zhongxin');
	hashMap.put('中国农业银行', 'zhongnong');

	var vm = avalon.define({
		$id: 'bankcard',
		list: [],
		cardNo: '',
		bankName: '',
		cardTypeStr: '',
		cardType: '',
		checked: true,
		phone: '',
		phoneStr: '',
		identifyingCode: '',
		bankcardAppendClick: function() {
			bankcardAppend.vm.callback = function() {
				bankcardInit();
			};
			router.go('/view/bankcard-append');
		},
		bankcardDetailClick: function(item) {
			$.extend(bankcardDetailViewModel, {
				cardId: item.id,
				bankName: item.bankName,
				phone: item.bankPhone,
				phoneStr: item.bankPhone,
				createTime: item.createTime,
				bankDataDic: item.bankDataDic,
				cardNo: item.cardNo,
				cardType: item.type,
				cardTypeStr: item.typeName,
				callback: function() {
					bankcardAppend.vm.cardNo = '';
					bankcardAppend.vm.phone = '';
					bankcardInit();
					window.history.back();
				},
			});
			setTimeout(function() {
				router.go('/view/bankcard-detail');
			}, 100);
		}
	});

	var bankcard_detail = new View('bankcard-detail');
	var bankcardDetailViewModel = avalon.define({
		$id: 'bankcard-detail',
		cardNo: '',
		bankName: '',
		cardTypeStr: '',
		cardType: '',
		phone: '',
		phoneStr: '',
		cardId: 0,
		createTime: '',
		bankDataDic: '',
		callback: $.noop,
		back_click: function() {
			bankcardDetailViewModel.callback();
		},
		del_click: function() {
			api.bankcardDel({
				gopToken: gopToken,
				cardId: bankcardDetailViewModel.cardId
			}, function(data) {
				if (data.status == 200) {
					$.alert('解绑成功');
					bankcardDetailViewModel.callback();
				} else {
					console.log(data);
				}
			});
		}
	});

	var bankcardInit = function() {
		vm.list.clear();
		api.bankcardSearch({
			gopToken: gopToken,
		}, function(data) {
			if (data.status == 200) {
				for (var i = 0; i < data.data.list.length; i++) {
					var item = data.data.list[i];
					item.typeName = item.cardType == 'SAVINGS_DEPOSIT_CARD' ? '储蓄卡' : '信用卡';
					item.bankDataDic = hashMap.get(item.bankName);
					vm.list.push(item);
					hashMap.put(item.id, item);
				};
			} else {
				console.log(data);
			}
		});
	};

	avalon.scan();

	bankcardInit();

	setTimeout(function() {
		bankcard.addClass('on');
	}, 100);
});