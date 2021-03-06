require(['api_mkt','cookie'], function(api_mkt) {
	
	//我的账户-实名验证校验
	var BtnConfirm = false;
	var BtnConfirm1 = false;
	//校验姓名
	$('#realAuthName').blur(function(){
		var realAuthName = $(this).val();
		var reg = /^[\u4e00-\u9fa5]+$/;   
        if(!reg.test(realAuthName)){
			BtnConfirm = false;
			//$('.msg-realAuthName').text('请输入姓名');
		}else{
			BtnConfirm = true;
			$('.msg-realAuthName').text('');
		}
	});
	//校验身份证号
	$('#realAuthId').blur(function(){
		var realAuthId = $(this).val();
		var reg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;   
        if(!reg.test(realAuthId)){
        	BtnConfirm1 = false;
			//$('.msg-realAuthId').text('请输入正确的身份证号');
		}else{
			BtnConfirm1 = true;
			$('.msg-realAuthId').text('');
		}
	});

	$('.realAuthBtn').click(function(){
		if(!BtnConfirm || !BtnConfirm1){
			//alert('请填写正确姓名和身份证号');
			$(".msg-realAuthId").show().text("身份信息输入有误，请重新填写");
		}else{
			//我的账户实名认证信息
			api_mkt.realNameAuth({
				'realName':$('#realAuthName').val(),
				'idNumber':$('#realAuthId').val()
			},function(data) {
				console.log(data);
		        if(data.status == 200 || data.status == 304){
		        	$('.authenticated').show();
			    	$('.unautherized').hide();
			    	$(".popuptips").slideUp();
			    	$.cookie("global_loginusername",$('#realAuthName').val());
			    	$('#username_value_one').text($('#realAuthName').val()); 
			    	var num = $('#realAuthId').val();
                	var numId = num.replace(num.slice(1,17),'****************');
			    	$('#identificode_value').text(numId);
		        	$(".msg-realAuthId").hide().text("");
		        	$(".quoted_price_top").css("margin-top","14px");
                    $(".center_content").css("margin-top","14px");
		        }else{
		        	$(".msg-realAuthId").show().text(data.msg);
		        }
			});
		}
	});

	api_mkt.realAuth(function(data){
		if(data.status=="200"){
			console.log(data.data.list.name);
			console.log(data.data.list.idNumber);
			if(data.data.list.name&&data.data.list.name!=""){
				$.cookie("global_loginusername",data.data.list.name);
				$(".authenticated").show();
				$(".unautherized").hide();
				$("#username_value_one").html(data.data.list.name);
				var num = data.data.list.idNumber;
                var numId = num.replace(num.slice(1,17),'****************');
				$("#identificode_value").html(numId);
			} else {
				$(".unautherized").show();
			}
		} else if(data.status=="400") {
			if(data.msg=="用户未实名认证"){
				$(".authenticated").hide();
				$(".unautherized").show();
			}
		} else {

		}
	});
	//hover 效果
    $('.ls_tab').hover(function(){
        if($(this).hasClass('ls_tab_on')){
            $(this).css('backgroundColor','#f1f1f1');
        }else{
            $(this).css('backgroundColor','#fafafa');
        }
    },function(){
        if($(this).hasClass('ls_tab_on')){
            $(this).css('backgroundColor','#f1f1f1');
        }else{
            $(this).css('backgroundColor','#fff');
        }
    });
});