function stopDefault(e) { 
     if (e && e.preventDefault) {//如果是FF下执行这个
        e.preventDefault();
    }else{ 
        window.event.returnValue = false;//如果是IE下执行这个
    }
    return false;
}

$(".txt").show();
$('.item input.itxt').hide();

var format_email = /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2} |net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT|cn|CN)$/;
var format_mobile = /1[0-9]{10}$/;

/*验证*/
function checkuserlogo(){
	var error = $(".error_tip");
	var loginname = $.trim($("input[name='loginname']").val());
	var isshowhide = $("input[name='loginname']");
	if(loginname == null || loginname == ""){
		isshowhide.prev().show();
		$(".error_tip").show();
		 error.text("用户名不能为空！");
		 return false;
	}else{
		if(loginname.match(format_email)==null && loginname.match(format_mobile)==null){
			isshowhide.prev().hide();
			$(".error_tip").show();
			error.text("请输入正确的邮箱或者手机号!");
			return false;
		}else{
			isshowhide.prev().hide();
			$(".error_tip").hide();
			error.text("");
			return true;
		}
	}
}
function code(){
	var rnlogincode =$.trim($("#rnlogincode").val());
	var isshowhide = $("#rnlogincode");
	if(rnlogincode == null || rnlogincode == ""){
		isshowhide.prev().show();
		$("#rerror_tip").show();
		$("#rerror_tip").text("请输入验证码");
		 return false;
	}else{
		isshowhide.prev().hide();
		$("#rerror_tip").hide();
		$("#rerror_tip").text(" ");
		 return true;
	}
}
function checkPWd(){
	var error = $(".error_tip");
	var nloginpwd = $.trim($("input[name='nloginpwd']").val().length);
	var isshowhide = $("input[name='nloginpwd']");
	if(nloginpwd <= 0 ){
		isshowhide.prev().show();
	 	$(".error_tip").show();
		error.text("密码不能为空！");
		return false;
	}else{
		if(nloginpwd < 6 || nloginpwd > 18){
			isshowhide.prev().hide();
			$(".error_tip").show();
			error.text("密码不能小于6位且不能大于18位！");
			return false;
		}else{
			isshowhide.prev().hide();
			$(".error_tip").hide();
			error.text(" ");
			return true;
		}
	}
}

/*左键按下则显示明文密码*/
$(document).on( "mousedown", ".isShowHideIcon", function(e) {
	var value = $("#nloginpwd,#rnloginpwd").val();
	$("#mwshow").val(value).show();
	$("#nloginpwd,#rnloginpwd").hide();
	stopDefault(e);
})
$(document).on( "mouseup", ".isShowHideIcon", function(e) {
	$("#mwshow").hide();
	$("#nloginpwd,#rnloginpwd").show();
	stopDefault(e);
})

$(document).on( "mousedown", ".txt", function(e) {
	$(this).hide();
	$(this).next().show();
	$(this).next().focus();
	stopDefault(e);
})

/*登录验证*/
$(document).on( "blur", "#loginname", function(e) {
	checkuserlogo();
	stopDefault(e);
})
/*注册密码验证*/
$(document).on( "blur", "#nloginpwd,#rnloginpwd", function(e) {
	checkPWd();
	$(document).off("blur", "#nloginpwd,#rnloginpwd");
	stopDefault(e);
})

/*注册验证*/
$(document).on( "blur", "#rloginname", function(e) {

	var rloginname = $.trim($("#rloginname").val());
	var isshowhide = $("#rloginname");
	if(rloginname == null || rloginname == ""){
		isshowhide.prev().show();
		$(".securityCode,#rerror_tip").show();
		$("#rerror_tip").text("用户名不能为空！");
		 return false;
	}else if(rloginname.match(format_email) != null){
		isshowhide.prev().hide();
		$(".securityCode,#rerror_tip").hide();
		$("#rerror_tip").text("");
		return false;
	}else if(rloginname.match(format_mobile)!=null){
		isshowhide.prev().hide();
		$(".securityCode").show();
		$("#rerror_tip").hide();
		$("#rerror_tip").text("");
		return false;
	}else{
		$(".securityCode,#rerror_tip").show();
		isshowhide.prev().hide();
		$("#rerror_tip").text("请输入正确的邮箱或者手机号!");
		return false;
	}
	stopDefault(e);

})

/*验证码*/
$(document).on( "blur", "#rnlogincode", function(e) {
	code();
	stopDefault(e);
})