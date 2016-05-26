/**
  * 工具类
 * */

var layer = (function(){
  //提示
  this.show = function(data) {    
    if(angular.isObject(data)) {
      data = msg(data);
    }
    if(angular.isUndefined($("#hintShow").html())) {
      var div = $("<div id='hintShow' style='width:100%;text-align:center;padding:12px 0px;background:#ff2f5f;opacity:1;color:#fff;position: fixed;top:0;left:0;display:none;z-index:9999;'>"+data+"</div>");
      div.appendTo($("body")).fadeIn("slow");
      time = setInterval(function(){
        clearInterval(time);
        div.fadeOut("slow",function(){
          div.remove();
        });
      },2500);
      $("#hintShow").bind('click',function(){
        div.remove();
      });
    }else{
      return false;
    }  
  } 
  
  //提示
  //弹出层
/*  this.popup = function(divId) {
    var height = $(window).height();
    var warp = "width: 90%;height:"+(height-80)+"px;background:#fff;color:#32A4E6;position:fixed;z-index:9999;top:0;" +
    "margin-left:5%;margin-right:5%;margin-top: 40px;border-radius:7px;overflow:scroll;";
    $("#"+divId).attr('style',warp).fadeIn('slow');
    
    var canel = $("<div id='embs_canel' style='font-size:20px;background:#ccc;color:#fff;border-radius:50%;width:30px;height:30px;line-height:30px;text-align:center;position:fixed;z-index:10000;top:20px;left:88%;'>X</div>");
    //遮罩层
    var shade = $("<div id='embs_shade' style='width:100%;height:"+height+"px;background:#000;position:fixed;opacity:0.3;z-index:9998;top:0;left:0;'></div>");
    shade.appendTo($('.pane'));
    canel.appendTo($('.pane'));
    $("#embs_canel").bind('click',function(){
      canel.remove();
      shade.remove();
      $('#'+divId).fadeOut('slow');
    });
  }
  //关闭弹出层
  this.closePopup = function(divId) {
    $("#embs_shade").remove();  //删除遮罩层
    $("#embs_canel").remove();  //删除弹出层
    $('#'+divId).fadeOut('slow');
  }*/

  //获取url中的参数
  this.getUrlParam = function(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r != null) return decodeURI(r[2]); return null; //返回参数值
  }

  //获取url参数
  this.getParameters = function(locationUrl) {
    var url = decodeURI(locationUrl);//取访问地址url?后的部分
    var obj = new Object(); //返回对象
    var str;  //截取后的字符串
    var index = url.lastIndexOf('?');
    if(index != -1) {
      url = url.slice(index+1, url.length);
      //两个参数以上的情况
      if(url.indexOf("&") != -1) {
        str = url.split("&");
        for(var i = 0; i < str.length; i++) {
          var str1 = str[i].split("=");
          if(str1.length == 2 && str1[0] != '') {
            obj[str1[0]] = str1[1];
          }       
        }
      } 
      //一个参数的情况
      else {
        str = url.split("=");
        if(str.length == 2 && str[0] != '') {
          obj[str[0]] = str[1];
        }     
      }
    }
    return obj;
  }
  
  //获取form 的所有参数，组装成json 对象，可以用于ajax 请求
  this.getParams = function(form){
    var params = {};
    $(form).find("input").each(function(obj){
      if($(this).attr('disabled')=='disabled'){
        return true;
      }
      if($(this).attr('data-disabled')=='disabled'){
        return true;
      }
      var name = '';
      var value = '';
      if($(this).attr('type')=='radio'){
        name = $(this).attr("name");
        value = $(':radio[name="'+name+'"]:checked').val();
        params[name] = value;
        return true;
      }else{
        name = $(this).attr("name");
        value = $.trim($(this).val());
      }
      if(name){
        params[name] = value;
        
      }
      
    });
    $(form).find("select").each(function(obj){
      if($(this).attr('disabled')=='disabled'){
        return false;
      }
      if($(this).attr('data-disabled')=='disabled'){
        return true;
      }
      if($(this).val()==''){
        return true;
      }
      var name = $(this).attr("name");
      var value = $(this).val();
      params[name] = value;
    }); 
   $(form).find("textarea").each(function(obj){
      if($.trim($(this).attr('data-disabled'))=='disabled'){
        return true;
      }
      var name = $(this).attr("name");
      var value = $.trim($(this).val());
      params[name] = value;
    }); 

    return params;
  }

//阻止默认事件
this.stopDefault = function(e)
{ 
   if (e && e.preventDefault) {//如果是FF下执行这个
      e.preventDefault();
  }else{ 
      window.event.returnValue = false;//如果是IE下执行这个
  }
  return false;
}
  //base64编码
  this.base64code = function(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    
     /* 处理中文问题 */
      input = strUnicode2Ansi(input);
     
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;
         
      do{
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
   
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
   
          if (isNaN(chr2))
          {
              enc3 = enc4 = 64;
          }
          else if(isNaN(chr3))
          {
              enc4 = 64;
          }
   
          output = output +
          keyStr.charAt(enc1) +
          keyStr.charAt(enc2) +
          keyStr.charAt(enc3) +
          keyStr.charAt(enc4);
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
         
      }while(i < input.length);
   
      return output;
  }
  
  //将Unicode编码的字符串，转换成Ansi编码的字符串
  function strUnicode2Ansi(asContents) {
      var len1=asContents.length;
      var temp="";
      for(var i=0;i<len1;i++)
      {
          var varasc=asContents.charCodeAt(i);
          if(varasc<0)
                  varasc+=65536;
          if(varasc>127)
                  varasc=UnicodeToAnsi(varasc);
          if(varasc>255)
          {
              var varlow=varasc & 65280;
              varlow=varlow>>8;
              var varhigh=varasc & 255;
              temp+=String.fromCharCode(varlow)+String.fromCharCode(varhigh);
          }
          else
          {
              temp+=String.fromCharCode(varasc);
          }
      }
      return temp;
  }

  //菜单返回按钮
  this.goBack = function() {
    window.history.back();
    window.location.reload();
  }
  //菜单刷新按钮
  this.refresh = function() {
     window.location.reload();
  }

  //获取错误信息
  this.msg = function(data) {
    if(angular.isUndefined(data)) {
      return '服务器故障，请与管理员联系!';
    }
    var _msg = '';
    switch(data) {
      case 401 :
         _msg = "账号过期，请重新登录。";
        //window.location.href = '#/login';
        //window.location.reload();
        break;

        default :
          _msg = '错误代码: ' + data;
        break;
    }
    return layer.show(_msg);
  }
  return this;
}());




// .container 设置了 overflow 属性, 导致 Android 手机下输入框获取焦点时, 输入法挡住输入框的 bug
// 解决方法:
// 0. .container 去掉 overflow 属性, 但此 demo 下会引发别的问题
//    Android 手机下, input 或 textarea 元素聚焦时, 主动滚一把
/*if (/Android/gi.test(navigator.userAgent)) {
    window.addEventListener('resize', function () {
        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
            window.setTimeout(function () {
                document.activeElement.scrollIntoViewIfNeeded();
            }, 0);
        }
    })
}*/


