define('api_mkt', ['cookie'], function() {
    // var basePath = 'http://localhost/';                 //本地环境
    // var basePath = 'https://www.goopal.net.cn/'; //旧的正式环境
    var basePath = './';  //测试环境和正式环境都用这个
    var api = {};
    api.basePath2 = 'https://endpoint.goopal.com.cn/common/checkBankCard';  //线上环境
    // api.basePath2 = 'http://goopal.xiaojian.me/common/checkBankCard'; //测试环境
    var goIndex = function(useURL) { //返回首页
        if (useURL) {}
        if (window.location.href.indexOf('/index.html') === -1) {
            return window.location.href = 'index.html';
        } else {
            //alert('无法获得用户信息');
        }
    };
    var clearcookie = function(){
        $.cookie('exchangeToken', '');
        $.cookie("global_loginuserphone",'');
        $.cookie("global_loginusername",'');
        $.cookie("global_loginuseruid",'');
        $.cookie("totalAssets","");
        $.cookie("totalNuts","");
        $.cookie("mine_one","");
        $.cookie("mine_two","");
        $.cookie("mine_three","");
        $.cookie("mine_four","");
        $.cookie("loginfromwhichpage","");
    }

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
                timeout: 500000,
                success: function(data) {
                    //console.log(data);
                    if (!data) {
                        // alert('1:' + name + ';' + $.cookie('gopToken'));
                        return goIndex(true);
                    }
                    if (data.status == 300 && options.ignoreStatus && options.ignoreStatus.indexOf(300) === -1) { // {msg: "用户登录/验证失败，请重新登录", status: "300"}
                        // alert(2);
                        goIndex(true);
                    } else if (data.status == 304 && options.ignoreStatus && options.ignoreStatus.indexOf(304) === -1) { // {msg: "服务器异常", status: "304"}
                        //$.alert('服务器异常, 请联系后台人员!');
                        showWarnWin('服务器异常',1e3);
                    } else if(data.status==400){
                        if(data.msg == "系统已经退出了"){
                            // alert("登录超时");
                            showWarnWin("登录超时",1e3);
                            clearcookie();
                            goIndex(true);
                        }
                        if(data.msg=="用户未实名认证"){
                        	$(".popuptips").attr("data-authed","false");
                            var loginfromwhichpage = $.cookie("loginfromwhichpage");
                            $(".quoted_price_top").css("margin-top","0px");
                            $(".center_content").css("margin-top","0px");
                            if(loginfromwhichpage=="one"){
                                // $(".popuptips").slideUp();
                                $(".popuptips").hide();
                            } else if(loginfromwhichpage=="two"){
                                $(".popuptips").slideDown();
                            } else if(loginfromwhichpage=="three"){
                                $(".popuptips").slideDown();
                                if(location.href.indexOf('/conditionofassets.html') != -1){
                                } else {
                                    if(location.href.indexOf('./index.html') != -1){

                                    } else {
                                        location.href="./conditionofassets.html";
                                        $(".popuptips").slideDown();
                                    }
                                }
                            } else if(loginfromwhichpage=="four"){
                                if(location.href.indexOf('/basicinfo.html')!=-1){
                                    $(".popuptips").slideDown();
                                    if(location.href.indexOf('/certification.html')!=-1){
                                        location.href="./basicinfo.html";
                                    }
                                } else {
                                    $(".popuptips").slideDown();
                                }
                            }
                        }
                    } else if(data.status==444){
                        clearcookie();
                        if(location.href.indexOf('/footer.html')<0 
                        		&& location.href.indexOf('/resetloginpwd.html')<0){
                        	goIndex(true);
                        }
                        
                    }
                    options.callback && options.callback.call(this, data);
                    success && success.call(this, data);
                },
                error: function(xhrObj, text, err) {
                    console.log('Error: ', arguments);
                    if (text === 'timeout') {
                        //$.alert('请求超时...<br>请检查您的网络');
                        //alert('请求超时...<br>请检查您的网络');
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
    add('pollinfo', 'trade/info', {
        asyn:true
    });
    add('polltrade', 'trade/trade');
    add('homepage_tradingfloor_kline', 'trade/kline');
    add('depthchart', 'trade/depth');
    add('homepagekline', 'trade/kline');


    add('login', 'exchangeApi/login/login');

    //接口 发送验证码 
    add('sendCode', 'exchangeApi/common/sendCode');
    //接口 注册第一步 手机号注册
    add('registerBefore', 'exchangeApi/login/registerBefore');
    //接口 注册第二步 设置支付密码 
    add('register', 'exchangeApi/login/register');
    //接口 注册第三步 设置实名验证 
    add('realNameAuth', 'exchangeApi/security/realNameAuth');

    //接口 账户明细（查询最近5条）
    add('billList', 'exchangeApi/bill/billList');
    //接口 账户明细（带分页）
    add('billListPage', 'exchangeApi/bill/billList');
    //接口 人民币充值
    add('rmbRecharge', 'exchangeApi/wealth/rmbRecharge');
    //接口 人民币提现
    add('rmbWithdrawals', 'exchangeApi/wealth/rmbWithdrawals');
    //接口 人民币充值历史（查询最近5条）
    add('rmbRechargeHistory', 'exchangeApi/wealth/rmbRechargeHistory');
    //接口 人民币提现历史（查询最近5条）
    add('rmbWithdrawalsHistory', 'exchangeApi/wealth/rmbWithdrawalsHistory');
    //接口 银行卡识别
    add('checkBankCard', 'exchangeApi/common/checkBankCard');
    // 接口 人民币提现管理添加 添加银行卡
    add('rmbWithdrawalsManageAdd', 'exchangeApi/wealth/rmbWithdrawalsManageAdd');
    // 接口 人民币提现管理删除
    add('rmbWithdrawalsManageDel', 'exchangeApi/wealth/rmbWithdrawalsManageDel');
    // 接口 发送手机号验证码(登录后不需要手机号参数)
    add('sendCodeByLoginAfter', 'exchangeApi/common/sendCodeByLoginAfter');
    // 接口 果仁提现地址管理添加
    add('gopAddressManAdd', 'exchangeApi/wealth/gopAddressManAdd');
    // 接口 果仁提现地址管理删除
    add('gopAddressManDel', 'exchangeApi/wealth/gopAddressManDel');
    // 接口 果仁提现地址管理
    add('gopAddressMan', 'exchangeApi/wealth/gopAddressMan');
    // 接口 果仁提现地址修改
    add('gopAddressManUpdate', 'exchangeApi/wealth/gopAddressManUpdate');
    // 接口 人民币提现管理【判断是否添加银行卡】
    add('bankList', 'exchangeApi/wealth/bankList');
    // 接口 果仁(提现)转出记录_只查询成功记录
    add('transferOutHistory', 'exchangeApi/wealth/transferOutHistory');
    // 接口 果仁(充值)转出记录_只查询成功记录
    add('transferInHistory', 'exchangeApi/wealth/transferInHistory');
    // 接口 果仁充值
    add('gopRecharge', 'exchangeApi/wealth/gopRecharge');
    // 接口 果仁提现
    add('gopWithdrawals', 'exchangeApi/wealth/gopWithdrawals');
    //撤单
    add('tradeGopCancelByid', 'exchangeApi/wealth/tradeGopCancelByid');
    //当前委托（不传参数查询最近5条）、带分页
    add('tradeGopCurrentList', 'exchangeApi/wealth/tradeGopCurrentList');
    //历史委托（不传参数查询最近5条）、带分页
    add('tradeGopHistoryList', 'exchangeApi/wealth/tradeGopHistoryList');
    //我的账户信息
    add('basic', 'exchangeApi/user/basic');
    //总资产
    add('getTotalAssets', 'exchangeApi/wealth/getTotalAssets');
    //买入
    add('buy', 'exchangeApi/wealth/buy');
    //卖出
    add('sell', 'exchangeApi/wealth/sell');


    add('userlogout', 'exchangeApi/user/logout');
    add('realAuth', 'exchangeApi/user/realAuth');
    add('totalAssets', 'exchangeApi/wealth/getTotalAssets');



    add('userbasic', 'exchangeApi/user/basic');

    add('loginpassword', 'exchangeApi/login/setLoginPassword');
    add('setpaypwd', 'exchangeApi/security/setPayPwd');


    add('resetpaypwdbefore', 'exchangeApi/security/resetPayPwdBefore');

    add('resetLoginPwd', 'exchangeApi/login/resetLoginPwd');

    add('resetPayPwd', 'exchangeApi/security/resetPayPwd');

    add('isPayLocked', 'exchangeApi/security/isPayLocked');
    
    add('buyBefore','exchangeApi/wealth/buyBefore');
    add('sellBefore','exchangeApi/wealth/sellBefore');

    add('unReadMessage', 'exchangeApi/user/unReadMessage');

    add('message','exchangeApi/user/message');

    return api;
});

