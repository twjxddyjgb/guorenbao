﻿require(['api_mkt','mkt_info','cookie'], function(api_mkt,mkt_info) {
    mkt_info.get();
    var popup_login_times = 0;
    var exchangeToken = $.cookie('exchangeToken');
    var whether_auth = false;
    $("#bg").width($(document).width());
    $('#bg').height($(document).height());
    $('#floor_bg').css('left', 0);
    $('#floor_bg').css('top', 0);
    $('.bg').css('left', 0);
    $('.bg').css('top', 0);

    $(".pageone,.pagetwo,.pagethree,.pagefour").on("click",function(){
        var exchangeToken = $.cookie('exchangeToken');
        var ff = $(this).html();
        if (!exchangeToken) {
            //alert("没有token")
            $(".popDiv").show();
            $(".bg").show();
            if(ff=="首页"){
                $.cookie("loginfromwhichpage","one");
                console.log("loginfromwhichpage"+"one");
            } else if(ff=="交易大厅"){
                $.cookie("loginfromwhichpage","two");
                console.log("loginfromwhichpage"+"two");
            } else if(ff=="财务中心"){
                $.cookie("loginfromwhichpage","three");
                console.log("loginfromwhichpage"+"three");
            } else if(ff=="我的账户"){
                $.cookie("loginfromwhichpage","four");
                console.log("loginfromwhichpage"+"four");
            }
        } else {
            //alert("有tokne");
            $(".popDiv").hide();
            $(".bg").hide();
            // var whichpage = $.cookie("loginfromwhichpage");
            // if(whichpage=="one"){
            //     $.cookie("loginfromwhichpage","");
            //     location.href="./index.html";
            // } else if(whichpage=="two"){
            //     $.cookie("loginfromwhichpage","");
            //     location.href="./tradingfloor.html";
            // } else if(whichpage=="three"){
            //     $.cookie("loginfromwhichpage","");
            //     location.href="./conditionofassets.html";
            // } else if(whichpage=="four"){
            //     $.cookie("loginfromwhichpage","");
            //     location.href="./basicinfo.html";
            // }

            if(ff=="首页"){
                location.href="./index.html";
            } else if(ff=="交易大厅"){
                location.href="./tradingfloor.html";
            } else if(ff=="财务中心"){
                location.href="./conditionofassets.html";
            } else if(ff=="我的账户"){
                location.href="./basicinfo.html";
            }
        }
    });

    var verify = function(inputData, dataType) {
        var reg = "";
        var varMes = '';
        if (dataType === "name") {
            reg = /^[\u4E00-\u9FA5]{2,5}$/;
            varMes = "姓名请输入2~5个汉字";
        } else if (dataType === "tel") {
            reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            varMes = "请输入正确的手机号码";
        } else if (dataType === "salary") {
            reg = /^[1-9]\d{1,4}$/;
            varMes = "薪资请输入3~5位数字";
        } else if (dataType === "verCode") {
            reg = /^\d{6}$/;
            varMes = "验证码不正确";
        } else {
            reg = /^.*$/;
        }
        //如果输入数据不为空则去掉收尾空格
        if (inputData) {
            inputData = inputData.trim();
        }
        return reg.test(inputData) ? reg.test(inputData) : varMes;
    };
    if (!exchangeToken) {
    	$(".login_regist").show();
    	$(".loginarea").show();
    	$(".afterlogin").hide();
    } else {
    	$(".login_regist").hide();
        $(".login_header").show();
        $(".loginarea").hide();
    	$(".afterlogin").show();
        var global_loginuserphone = $.cookie("global_loginuserphone");
	    var global_loginusername = $.cookie("global_loginusername");
	    // console.log("-------------"+global_loginuserphone);
	    // console.log("-------------"+global_loginusername);
	    if(global_loginusername!=""&&global_loginusername){
	    	$("#logined_username").html(global_loginusername);
	    } else {
	    	$("#logined_username").html(global_loginuserphone);
	    }
        $(".popDiv").hide();
        $(".bg").hide();
    }
    //右上角登录按钮点击之后出发的事件
    $(".popup_login_btn").on("click", function() {
        popup_login_times++;
        var phone = $(".phone").val();
        var password = $(".password").val();
        var authcode_common = $(".authcode_common").val();
        var flag = verify(phone, "tel");
        if(flag=="请输入正确的手机号码"){
        	$(".err_tips_one").show().html("请输入正确的手机号码");
            return;
        } else {
            $(".err_tips_one").hide().html("");
        }
        if(password==""){
        	$(".error_tips").show().html("请输入密码");
        	return;
        } else if(password.length>20||password.length<6){
        	$(".error_tips").show().html("请输入6~20位密码");
        	return;
        } else {
            $(".error_tips").hide().html("");
        }
        if(authcode_common==""){
            $(".autocode_tips").show().html("请输入验证码");
            return;
        }
        if(flag==true&&password!=""&&password.length>=6&&password.length<12&&authcode_common!=""){
        	$(".error_tips").hide();
            $(".autocode_tips").hide();
        	api_mkt.login({
	            phone: phone,
	            password: password,
                code:authcode_common
	        }, function(data) {
	            if (data.status == 200) {
	                $.cookie('exchangeToken', 'logined');
	                $(".login_regist").hide();
	                $(".login_header").show();
	                $(".popDiv").hide();
	                $(".bg").hide();
	                $(".loginarea").hide();
    				$(".afterlogin").show();
	                global_loginuserphone = data.data.phone;
	                global_loginusername = data.data.name;
	                global_loginuseruid = data.data.uid;
	                $.cookie("global_loginuserphone",global_loginuserphone);
	                $.cookie("global_loginusername",global_loginusername);
	                $.cookie("global_loginuseruid",global_loginuseruid);
                    console.log("asdf")
                    synchronous();
                    setInterval(synchronous, 300000);

                    if(global_loginusername!=""){
                        $("#logined_username").html(global_loginusername);
                        whether_auth = true;
                    } else {
                        whether_auth = false;
                        $("#logined_username").html(global_loginuserphone.substr(0,3)+'****'+global_loginuserphone.substr(7,4));
                    }
	                $("#uidval").html(global_loginuseruid);
	                $(".top_em").html(global_loginuserphone.substr(0,3)+'****'+global_loginuserphone.substr(7,4));
	                var whether_auth_val = "";
                    if(whether_auth){
                        whether_auth_val = global_loginusername;
                        $(".bottom_em_i")[0].style.background = "url(./images/index_already_authentication.png)";
                    } else {
                        whether_auth_val = '未认证';
                        $(".bottom_em_i")[0].style.background = "url(./images/index_no_auth.png)";
                    }
                    $("#whether_auth").html(whether_auth_val); //是否实名认证的标识
                    var whichpage = $.cookie("loginfromwhichpage");
                    if(whichpage=="one"){
                        location.href="./index.html";
                    } else if(whichpage=="two"){
                        location.href="./tradingfloor.html";
                    } else if(whichpage=="three"){
                        location.href="./conditionofassets.html";
                    } else if(whichpage=="four"){
                        location.href="./basicinfo.html";
                    }
                    api_mkt.totalAssets({
                    }, function(data) {
                        if (data.status == 200) {
                        	var totalAssets = data.data.cnyBalance + data.data.cnyLock;
                            var totalNuts = data.data.gopBalance + data.data.gopLock;
                            //$('#thelatestprice').html(thelatestprice); //页面顶部 最新成交价
                            var totalvalue = totalNuts*$('#thelatestprice').html()+totalAssets;
                            $('.lf_asset_center').html(totalvalue);//总资产
                            $('.rg_asset_center').html(totalNuts);//总果仁

                            var cnyBalance = data.data.cnyBalance;
                            $.cookie('allCNY',cnyBalance);
                            $('.w_b_l_one').html("<em>账户余额："+data.data.cnyBalance+" CNY</em>");
                            $('.w_b_l_two').html("<em>果仁余额："+data.data.gopBalance+" GOP</em>");
                        } else if (data.status == 305) {
                        } else if(data.status == 400){
                        } else {
                        }
                    });
	            } else if (data.status == 305) {
	                alert(data.msg);
	            } else if (data.status==400) {
                    if(data.msg=="验证码错误"){
                        $(".autocode_tips").show().html(data.msg);
                    } else if(data.msg=="手机号未注册"){
                        // $(".err_tips_one").show().html(data.msg);
                        $(".err_tips_one").show().html("用户名或密码错误，请重新登录");
                    } else if(data.msg=="登录密码错误"){
                        $(".error_tips").show().html("用户名或密码错误，请重新登录");
                    }
                } else {
	            	$(".error_tips").show().html(data.msg);
	            }
                // if(data.msg=="登录密码错误"){
                //     $(".error_tips_index").show().html(data.msg);
                // } else if(data.msg=="手机号未注册"){
                //     $(".error_tips_one").show().html(data.msg);
                // } else {
                //     $(".autocode_tips").show().html(data.msg);
                // }

                //err_tips_one
	        });
        }
        // if (popup_login_times > 3) {
        //     $("#authcode").show();
        //     $(".popup_login_btn").css("top", "250px");
        //     $(".bottom_div").css("top", "284px");
        // } else {
        //     $(".popup_login_btn").css("top", "190px");
        //     $(".bottom_div").css("top", "226px");
        // }
    });
    $(".global_loginbtn").on('click', function() {
        $(".popDiv").show();
        $(".bg").show();
    });
    $(".close_btn").on("click",function(){
    	$(".popDiv").hide();
        $(".bg").hide();
    });
    $("#logoutbtn").on("click", function() {
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
        api_mkt.userlogout({
        }, function(data) {
            if (data.status == 200) {
                //alert(data.msg);
                window.location.href="index.html";
            } else if (data.status == 305) {
                alert(data.msg);
            } else {
            	alert(data.msg);
            }
        });
        setTimeout(function(){
        	location.reload(true);
        },100);
    });

    function synchronous() {
        $("#mybox").html("");
        api_mkt.unReadMessage({

        },function(data){
            if(data.status==200){
                if(data.data){
                    var dlist = data.data.list;
                    var unReadNum = data.data.unReadNum;
                    $("#msg_num_top,#newinfor_result").html(unReadNum);
                    var dlisthtml = "";
                    if(dlist){
                        if(dlist.length<2){
                            var obj = dlist[0];
                            dlisthtml += "<div class='message_flow'><p class='message_content_p'>"+obj.content+"</p><p class='message_date_p'>"+obj.createDate+"</p></div>";
                        }
                        if(dlist.length>=2){
                            dlisthtml += "<div class='message_flow'><p class='message_content_p'>"+dlist[0].content+"</p><p class='message_date_p'>"+dlist[0].createDate+"</p></div>";
                            dlisthtml += "<div class='message_flow second_message_flow'><p class='message_content_p'>"+dlist[1].content+"</p><p class='message_date_p'>"+dlist[1].createDate+"</p></div>";
                        }
                        dlisthtml += "<a href='ssmessage.html'>查看全部</a>";
                        $(dlisthtml).appendTo("#mybox");
                    }
                }
            } else {
                console.log(data);
            }
        });
    }
    if (!exchangeToken) {
        
    } else {
        synchronous();
        setInterval(synchronous, 300000);
    }
    
    var flag = true;
    $('.messagenum_area').on("click",function(){
        if(flag){
            flag = false;
            $(this).css("background-color","#ffffff");
            $(".popup_message_box").show("100");
            $(".messagenum_area em").css("color","#333333");
            $(".msg_num").css("color","#333333");
        } else {
            flag = true;
            $(this).css("background-color","#282828");
            $(".popup_message_box").hide("100");
            $(".messagenum_area em").css("color","#cccccc");
            $(".msg_num").css("color","#cccccc");
        }
    });
});
