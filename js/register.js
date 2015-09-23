$(document).on( "click", "#subRegister", function(e) {
	if(!$(".securityCode").is(":hidden")){
		if(checkuserlogo() && code() && checkPWd()){
			var username = $.trim($("#loginname").val());
			var rnlogincode = $.trim($("#rnlogincode").val());
			var password = $.trim($("#nloginpwd").val());
			var params = "username="+username+"&rnlogincode="+rnlogincode+"&password="+password;
			/*$.post("file:///E:/wdlst/index.html"+params,function(data){
				window.location.href="file:///E:/wdlst/index.html";
			});*/
			window.location.href="file:///E:/wdlst/index.html";
			return true;
		}else{
			return false;
		}
	}else{
		if(checkuserlogo() && checkPWd()){
			var username = $.trim($("#loginname").val());
			var password = $.trim($("#nloginpwd").val());
			var params = "username="+username+"&password="+password;
			/*$.post("file:///E:/wdlst/index.html"+params,function(data){
				window.location.href="file:///E:/wdlst/index.html";
			});*/
			window.location.href="file:///E:/wdlst/index.html";
			return true;
		}else{
			return false;
		}
	}
	stopDefault(e);
})