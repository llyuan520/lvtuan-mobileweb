/*登录提交*/
$(document).on( "click", "#sublogo", function(e) { 
	if(checkuserlogo() && checkPWd()){
		var isSeve = $("#isSeve").val();
		var username = $.trim($("#loginname").val());
		var password = $.trim($("#nloginpwd").val());

		if ($(".check").is(":checked") == true) {//保存密码
			/*$.ajax({
				url:contextPath+"file:///E:/wdlst/index.html?username="+username+"&password="+password,
				type:"get",
				dataType:"json",
				error:function(){
					return false;
				},
				success:function(json){
					var data = json.data;
				}
			});*/
			window.location.href="file:///E:/wdlst/index.html";
			return true;
		}else{//删除cookie
			window.location.href="file:///E:/wdlst/index.html";
			return true;
		}
		
	}else{
		
		return false;
	}
	stopDefault(e);
});


$(document).on( "click", "#isSeve", function(e) { 
	if ($("#isSeve").is(":checked") == true){
		$("#isSeve").attr("checked", 'checked');
		$("#isSeve").val("1");
		return true;
	}else{
		$("#isSeve").attr("checked", '');
		$("#isSeve").val("0");
		return true;
	}
	stopDefault(e);
});
