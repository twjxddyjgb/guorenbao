define('mkt_trade', ['api_mkt'], function(api_mkt) {
	var trade = {
		interval: 1000, // 请求间隔
		timer: null, // 定时器
		stop: function() {
			clearTimeout(trade.timer);
		},
		onChange: updatebuy_sell, // 价格改变时回调, 传参(当前价格, 上一次价格, 改变大小)
	};
	var once = trade.once = function(callback) {
		api_mkt.polltrade(function(data) {
			callback && callback(data);
		});
	};
	//首页轮询更新买入委托、卖出委托
	var updatebuy_sell = function(haha){
		//console.log(haha);
        var list_sell = JSON.parse(haha['sell']);
        var list_buy = JSON.parse(haha['buy']);
        var sell_list_html = "";
        var buy_list_html = "";
        var buyaprice = "";
        var sellaprice = "";

        var listsell_array = [];
        for (var i = 0; i < list_sell.length; i++) {
        	listsell_array.push(list_sell[i][1]);
        }
        for (var i = 0; i < list_sell.length; i++) {
        	sellaprice = list_sell[0][0];
        	sell_list_html += "<div class='table_row'>"+
        	"<div class='table_con'>卖"+(i+1)+"</div><div class='table_con'>"+list_sell[i][0]+"</div>"+
        	"<div class='table_con'>"+list_sell[i][1]+"</div><progress value='"+list_sell[i][1]+"' max='100'></progress></div></div>";
        }
        var listbuy_arry = [];
        for (var i = 0; i < list_buy.length; i++) {
        	listbuy_arry.push(list_buy[i][1]);
        }
        console.log(listsell_array); //
        console.log(Math.max.apply(null, listbuy_arry));     //求买入最大值
        console.log(Math.max.apply(null, listsell_array));   //求卖出最大值
        for (var i = 0; i < list_buy.length; i++) {
        	buyaprice = list_buy[0][0];
        	buy_list_html += "<div class='table_row'>"+
        	"<div class='table_con'>买"+(i+1)+"</div><div class='table_con'>"+list_buy[i][0]+"</div>"+
        	"<div class='table_con'>"+list_buy[i][1]+"</div><progress value='"+list_buy[i][1]+"' max='100'></progress></div></div>";
        }
        $('#buyonece_price').html(buyaprice);        //买一价
		$('#sellonece_price').html(sellaprice);      //卖一价
        $("#table_one").html(buy_list_html);         //买入委托
        $("#table_two").html(sell_list_html);		 //卖出委托
	}


	//交易大厅轮询更新价格
	var updatebuy_sell_floor = function(haha){
		var list_sell = JSON.parse(haha['sell']);
        var list_buy = JSON.parse(haha['buy']);
        var sell_list_html = "";
        var buy_list_html = "";
        var buyaprice = "";
        var sellaprice = "";
    	sellaprice = list_sell[0][0];
    	buyaprice = list_buy[0][0];
		$('#buyonece_price_floor').html(buyaprice);  //交易市场买一价
		$('#sellonece_price_floor').html(sellaprice);//交易市场卖一价
	}

	//首页的轮询
	var get = trade.get = function() {
		once(function(next){
			updatebuy_sell(next);
			trade.timer = setTimeout(trade.get, trade.interval);
		});
	};
	//交易大厅的轮询
	var getfloor = trade.getfloor = function(){
		once(function(next){
			updatebuy_sell_floor(next);
			trade.timer = setTimeout(trade.getfloor, trade.interval);
		})
	}
	return trade;
});