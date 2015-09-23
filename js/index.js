$(document).ready(function () {
	/*鼠标移入移出*/
	$("#Jq-user").hover(
	  function () {
	  	$(this).addClass("activer");
	    $("#Jq-lgoregi").show()
	  },
	  function () {
	    $("#Jq-lgoregi").hide();
	    $(this).removeClass("activer");
	  }
	);
	
	$(".header").addClass("activer");
	$(window).scroll(function(){ 
		if ($(window).scrollTop()>100){ 
			$(".header").addClass("activer");
		}else{ 
			$(".header").removeClass("activer");
		} 
	}); 

});

function stopDefault(e) { 
     if (e && e.preventDefault) {//如果是FF下执行这个
        e.preventDefault();
    }else{ 
        window.event.returnValue = false;//如果是IE下执行这个
    }
    return false;
}

/*登录注册他弹出层*/
$("#tmpl-Jq-userLogo,#tmpl-Jq-userRegister").hide();
var htmllogo = $("#tmpl-Jq-userLogo").html();
var htmlRegister = $("#tmpl-Jq-userRegister").html();

$("#Jq-logo").click( function () { 
	$("#tmpl-Jq-userRegister").hide();
	//页面层-自定义
	var logo = layer.open({
			    type: 1, //基本层类型  可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若你采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
			    title: false, //标题
			    closeBtn: true,  //关闭按钮
			    shade:0.3,  //遮罩默认是0.3透明度
			    shadeClose: false,  //是否点击遮罩关闭
			    area: ['600px', '500px'],
			    skin: 'yourclass', //样式类名
			    content: htmllogo //内容
			});

	/*//将获取的值填充入输入框中
	if(username != null && username != '' && password != null && password != ''){
		$(".check").attr('checked',true); //选中保存秘密的复选框
	}
*/
	$(".txt").show();
	$('.item input.itxt').hide();

 });

$("#Jq-register").click( function () { 
	$("#tmpl-Jq-userLogo").hide();
	//页面层-自定义
	var register = layer.open({
				    type: 1,
				    title: false,
				    closeBtn: true,
				    shade:0.3,
				    shadeClose: false,
				
				    area: ['600px', '500px'],
				    skin: 'yourclass',
				    content: htmlRegister
				});

 });
