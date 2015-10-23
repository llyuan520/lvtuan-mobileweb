var lvtuanApp = angular.module('lvtuanApp.Ctrl', ['ionic'])

.factory("IndexAPI",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		itemUrl:"../img/01.png",
		itemTitle:"律师联合企业，为企业保障",
		itemContent:"律师联合企业律师联合企业律师联合企业律师联合企业律师联合企业",
		itemTime:"2015/08/23"
	},{
		itemUrl:"../img/01.png",
		itemTitle:"这里是大标题信息这里是大标",
		itemContent:"内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信",
		itemTime:"2015/08/23"		
	},{
		itemUrl:"../img/01.png",
		itemTitle:"这里是大标题信息这里是大标",
		itemContent:"内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信",
		itemTime:"2015/08/23"		
	},{
		itemUrl:"../img/01.png",
		itemTitle:"这里是大标题信息这里是",
		itemContent:"内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信",
		itemTime:"2015/08/23"		
	}];
	
	var IndexAPIServer={};
	IndexAPIServer.getIndexAPIValue=function(){
		return arrayAPI;
	}
		
	return IndexAPIServer;
})

//hone 
lvtuanApp.controller("ionicNavBarDelegateCtrl",function($state,$timeout,$http){
	//$ionicNavBarDelegate.showBar(false); //是否显示返回按钮
	$timeout(function(){ //2秒钟后跳转到index页面
		$state.go("index");
	}, 2000, [false]);
})


/*首页*/
lvtuanApp.controller("indexCtrl",function($scope,$state,$ionicSlideBoxDelegate,IndexAPI){
	$state.go("index");
	
	$scope.index=0;
	$scope.go=function(index){
		$ionicSlideBoxDelegate.slide(index);
	};
	$scope.items=IndexAPI.getIndexAPIValue();
	//登录
	$scope.goToLogin=function($location){
		$state.go("login");
	}
	//返回
	$scope.goBackToIndex=function(){
		$state.go("index");
	}

	$scope.mylvteam = function(){
		debugger
		$state.go("mylvteam");
	}
})

/*用户登陆*/
lvtuanApp.controller("loginCtrl",function($scope,$rootScope,$http){

	/*$http.get('http://dev.wdlst.law-pc-new/center/lawyer/info',
	        {
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + token
	        }
	    }).success(function(data) {
	       console.info(data)

	    }).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    });*/
	
	$scope.submit = function(){
		submintForm();
	}
  	var submintForm = function(){
  		var params = layer.getParams("#loginForm");
  		if(params.username == "" || params.password == ""){
  			layer.show("请输入用户名和密码");
  			return false;
  		}else{
  			var param = 'username='+params.username+'&password='+params.password;
  			$http.post('http://dev.wdlst.law-pc-new/login?'+param,{
	            headers: {
	                'Content-Type': 'application/json' , 
	            	'Authorization': 'bearer ' + $rootScope.token
	            }
	        }).success(function(data) {
	           layer.show("登陆成功！");
	           
	        }).error(function (data, status) {
	        	var errMsg = JSON.stringify(data.error_messages.password);
	        	layer.show(errMsg);
            });
            return true;
  		}    
  	}
})

/*用户注册*/
lvtuanApp.controller("registerCtrl",function($scope,$rootScope,$http){
	//获取验证码
	$scope.phonecode = function(){
		var params = layer.getParams("#registerForm");
		if(params.username == ""){
  			layer.show("请输入手机号码！");
  			return false;
  		}else{
  			var param = 'phone='+params.username;
  			$http.post('http://dev.wdlst.law-pc-new/send-code?'+param,{
	            headers: {
	                'Content-Type': 'application/json' , 
	            	'Authorization': 'bearer ' + $rootScope.token
	            }
	        }).success(function(data) {
	           layer.show("验证码已发送到您的手机！");
	           
	        }).error(function (data, status) {
	        	var errMsg = JSON.stringify(data.error_messages.password);
	        	layer.show(errMsg);
            });
            return true;
  		}        
	}

	//得到是否同意协议的值
	var isChecke;
	$scope.isCheckeChange = function() {
	 	isChecke = $scope.isChecke.checked;
	 	console.info(isChecke)
    };
    $scope.isChecke = { checked: false };

    //提交注册
	$scope.submit = function(){
		debugger
		var params = layer.getParams("#registerForm");
		if(params.username == ""){
  			layer.show("请输入手机号码！");
  			return false;
  		}else if(params.phonecode == ""){
  			layer.show("请输入验证码！");
  			return false;
  		}else if(params.password == ""){
  			layer.show("请输入密码！");
  			return false;
  		}else if(isChecke == undefined || isChecke == false){
  			layer.show("请阅读协议！");
  			return false;
  		}else{
  			var param = 'username='+params.username+'&phonecode='+params.phonecode+'&password='+params.password+'&account_type=phone';
  			$http.post('http://dev.wdlst.law-pc-new/register?'+param,{
	            headers: {
	                'Content-Type': 'application/json' , 
	            	'Authorization': 'bearer ' + $rootScope.token
	            }
	        }).success(function(data) {
	        	console.info(data)
	           layer.show("注册成功！");
	           
	        }).error(function (data, status) {
	        	var errMsg = JSON.stringify(data.error_messages.username);
	        	layer.show(errMsg);
            });
            return true;
  		}        
	}
  	
})

//修改密码
lvtuanApp.controller("resetpwdCtrl",function($scope,$http){

})
