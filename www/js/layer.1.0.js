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
      var div = $("<div id='hintShow' style='width:100%;text-align:center;padding:12px 0px;background:black;opacity:0.7;color:#fff;position: fixed;top:0;left:0;display:none;z-index:9999;'>"+data+"</div>");
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
    }   
  } 
  
  //确认窗口
  this.confirm = function(_msg, _callback) {
    var warp = "width: 60%;height:100px;background:#E8E8E8;color:#32A4E6;position:fixed;z-index:9999;top:30%;" +
          "left:20%;text-align:center;border-radius:7px;";
    var title = "word-break:break-word;height: 36px;overflow:hidden;padding: 5px 5px;background:#fff;border-radius:5px;";
    var canel = "margin-top:15px;border-radius:7px;float:left;width:35%;" +
          "margin-left:10%;background:#C7C7C7;padding: 4px 0px;color:#fff;";
    var queding = "margin-top:15px;float:right;width:35%;border-radius:7px;" +
          "background:#439E35;padding: 4px 0px;color:#fff;margin-right:10%;";
    var height = $(window).height();
    //遮罩层
    var shade = $("<div style='width:100%;height:"+height+"px;background:black;position:fixed;opacity:0.5;z-index:9998;top:0;left:0;'></div>");
    var div = $("<div style='"+warp+"'>" +
            "<div style='"+title+"'>"+_msg+"</div>" +
            "<div style='"+canel+"' id='canel'>取消</div><div style='"+queding+"' id='queding'>确定</div>" +
          "</div>");
    shade.appendTo($(document.body));
    div.appendTo($(document.body));
    $("#canel").bind('click',function(){
      shade.remove();
      div.remove();
    });
    $("#queding").bind('click',function(){
      shade.remove();
      div.remove();
      _callback();
    });
  }
  
  //弹出层
  this.popup = function(divId) {
    var height = $(window).height();
    var warp = "width: 90%;height:"+(height-80)+"px;background:#fff;color:#32A4E6;position:fixed;z-index:9999;top:0;" +
    "margin-left:5%;margin-right:5%;margin-top: 40px;border-radius:7px;overflow:scroll;";
    $("#"+divId).attr('style',warp).fadeIn('slow');
    
    var canel = $("<div id='embs_canel' style='font-size:20px;background:#ccc;color:#fff;border-radius:50%;width:30px;height:30px;line-height:30px;text-align:center;position:fixed;z-index:10000;top:20px;left:88%;'>X</div>");
    //遮罩层
    var shade = $("<div id='embs_shade' style='width:100%;height:"+height+"px;background:black;position:fixed;opacity:0.5;z-index:9998;top:0;left:0;'></div>");
    shade.appendTo($(document.body));
    canel.appendTo($(document.body));
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
  }
  
  //输入框
  this.importPopup = function(_callback) {
    var warp = "width: 80%;height:200px;background:#E8E8E8;color:#32A4E6;position:fixed;z-index:9999;top:20%;" +
          "left:10%;text-align:center;border-radius:7px;";
    var title = "word-break:break-word;height: 140px;overflow:hidden;padding: 5px 5px;background:#fff;border-radius:5px;";
    var canel = "margin-top:9px;border-radius:7px;float:left;width:35%;" +
          "margin-left:10%;background:#C7C7C7;padding: 5px 0px;color:#fff;";
    var queding = "margin-top:9px;float:right;width:35%;border-radius:7px;" +
          "background:#439E35;padding: 5px 0px;color:#fff;margin-right:10%;";
    var height = $(window).height();
    //遮罩层
    var shade = $("<div style='width:100%;height:"+height+"px;background:black;position:fixed;opacity:0.5;z-index:9998;top:0;left:0;'></div>");
    var div = $("<div style='"+warp+"'>" +
            "<div style='"+title+"'><textarea style='width:95%;height:135px;border:1px solid #D4D4D4;font-size:16px;' id='import_textarea'></textarea></div>" +
            "<div style='"+canel+"' id='canel'>取消</div><div style='"+queding+"' id='queding'>确定</div>" +
          "</div>");
    shade.appendTo($(document.body));
    div.appendTo($(document.body));
    $("#canel").bind('click',function(){
      shade.remove();
      div.remove();
    });
    $("#queding").bind('click',function(){
      var val = $.trim($("#import_textarea").val());
      if(val == '' || val.length == 0) {
        show('内容不能为空!');
      } else {
        _callback(val);
        shade.remove();
        div.remove();
      }
    });
  }
  
  //加载层
  this.progress = function(_code) {
    if(angular.isUndefined(_code)) {
      if(angular.isUndefined($("#progress").html())) {
        var div = $("<div id='progress' style='position: fixed;top:40%;margin-left:20%;margin-right:20%;display:none;z-index:9999;'>" +
                "<img src='images/global/loading.gif' width='100%' />" +
              "</div>");
        div.appendTo($("body")).fadeIn("slow");
      } 
    } else {
      var div = $("#progress");
      div.fadeOut("fast",function(){
        div.remove();
      });
    }       
  }
  
  //滚动条事件, _callback 下拉加载  _callback2 上拉刷新
  this.scroll = function(_callback,_callback2) {
    $(window).bind('scroll', function() {           
            if($(window).scrollTop() + $(window).height() >= $(document).height()) {
        _callback();
      } else if($(window).scrollTop() <= 0) {
        if(typeof _callback2 === 'function') {
          _callback2();   
        }
      }
        });
  }
  
  //左右滑动事件 和toch事件
  this.startIntegral = function(options){
    var options             = options           || {},
      change_screen_div   = options.change_screen_div     || '#change_screen_div', //传id；
      change_screen_ul_li = options.change_screen_ul_li   || '.change_screen_ul_li',//传class
      change_screen_ul  = options.change_screen_ul    || '#change_screen_ul',//传id;
      tab_title_ul    = options.tab_title_ul        || '#tab_title_ul',//传id;
      opacity       = options.opacity != false ? true : false;//是否滑动时有透视效果；
    
    //事先声明
    var thisPage = 0;
    $(change_screen_div).height($(window).height()-60);
    $(change_screen_ul_li).height($(window).height()-100);
    $(change_screen_ul).width($(document).width()*2);
    
    function index(obj, current){ // 取得元素在同辈中的索引值
      debugger
      for (var i = 0, length = current.length; i<length; i++) { 
        if (current[i] == obj ) { 
          return i; 
        } 
      } 
    }
    
    //切换实现透明度{
    if(opacity){
      var citypc = 0.5;
      for(var i=0;i<$(change_screen_ul).find('li').length;i++){
        if(i!=0){
          $(change_screen_ul).find('li').eq(i).css({opacity:citypc});         
        }
        
      }
    }
    //}切换实现透明度
    
    var change_screen_ul = document.getElementById(change_screen_ul.substring(1)),minus = 0;
     
    function changeScreenEndFun() {
      if(this.page != thisPage){
        thisPage = this.page;
        setTimeout(function(){
          //按钮换色
          document.querySelector(tab_title_ul+' > li.black').className = '';
          document.querySelector(tab_title_ul+' > li:nth-child(' + (thisPage+1) + ')').className = 'black';
        },100);
        
        //切换实现透明度{
        if(opacity){
          var cpage = this.page;
          var setTaboc = function(){
            setTimeout(function(){
              $(change_screen_ul).children().eq(cpage).css({opacity:citypc});
              if(citypc <= 1){
                citypc+=0.1;
                setTaboc();
              }else{
                for(var i=0;i<$(change_screen_ul).find('li').length;i++){
                  if(i!=cpage){
                    citypc = 0.5;
                    $(change_screen_ul).children().eq(i).css({opacity:citypc});
                  }
                  
                }             
              }
            },90);
            
          }
          setTaboc();       
        }
        //}切换实现透明度
      }
    }
    var slipjs = slip('page',change_screen_ul,{
        num: $(tab_title_ul).children().length,
        endFun: changeScreenEndFun//回调
    });
    // 点击便签滑动到指定位置
    var ul = document.querySelector(tab_title_ul);
    var li = document.querySelectorAll(tab_title_ul+'> li');
    touchClick(ul,function(e){
      if(ul.webkitMatchesSelector.call( e.target, 'ul li') ) {
        var that = e.target;
        var num = index(that, li);
        slipjs.toPage(num, 300);
      }
    });
    
    function touchClick(obj, fun) {
      /**
      * 该方法用于绑定点击事件，比一般的click事件反应速度快2倍。
      * @author 黄浩明
      * @param {对象字面量} obj 要绑定的dom对象
      * @param {对象字面量} fun 事件触发的函数
      */
      var start_x = 0,
        start_y = 0;
      obj.addEventListener('touchstart',function(e){
        start_x = e.touches[0].clientX;
        start_y = e.touches[0].clientY;
        document.addEventListener('touchend', touEnd, false);
      });
      function touEnd(e){
        var endX = e.changedTouches[0].clientX;
        var endY = e.changedTouches[0].clientY;
        if(Math.abs(endX - start_x) < 5 && Math.abs(endY - start_y) < 5) {
          fun.call(obj,e);
        }
        document.removeEventListener('touchend', touEnd, false);
      };
    };
  };
  
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