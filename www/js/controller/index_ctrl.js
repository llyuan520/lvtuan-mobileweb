var lvtuanApp = angular.module('lvtuanApp.Ctrl', ['ionic'])

.factory("getlawyerslistSever",function($rootScope,$http){

	//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
	var lawyerObj = {};
	$http.get('http://dev.wdlst.law-pc-new/lawyer/list_lawyers',
        {
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
        }
    }).success(function(data) {
    	lawyerObj = data.data;
    }).error(function (data, status) {
        console.info(JSON.stringify(data));
        console.info(JSON.stringify(status));
    });

    var lawyersAPIServer = {};
    lawyersAPIServer.getlawyersAPI = function(){
    	return lawyerObj;
    }
    return getlawyersAPI;

})

//hone 
lvtuanApp.controller("ionicNavBarDelegateCtrl",function($state,$timeout,$http){
	//$ionicNavBarDelegate.showBar(false); //是否显示返回按钮
	$timeout(function(){ //2秒钟后跳转到index页面
		$state.go("index");
	}, 2000, [false]);
})


/*首页*/
lvtuanApp.controller("indexCtrl",function($scope,$state,$http,$rootScope,$ionicLoading,$ionicSlideBoxDelegate){

	//显示一个loading指示器
	$scope.show = function() {
		$ionicLoading.show({
		  template: 'Loading...'
		});
	};
	$scope.hide = function(){
		$ionicLoading.hide();
	};
	//下拉刷新
	/*$scope.doRefresh = function() {
        $http.get('http://dev.wdlst.law-pc-new/lawyer/list_lawyers',
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
        	}
        }).success(function(data) {
                $scope.items = data.data;
        }).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })

        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };*/

    //上拉加载
    var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据
    $scope.show();
	$scope.loadMore = function() {
		//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
		$http.get('http://dev.wdlst.law-pc-new/lawyer/list_lawyers?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
			if(data.data.length > 0){
				$scope.moredata = true;
				//用于连接两个或多个数组并返回一个新的数组
				$scope.items = $scope.items.concat(data.data); 
				$scope.hide();
			}else{
				$scope.moredata = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })

		.finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
	};

	$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMore();
	});
	
	//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
	/*$scope.show();
	$http.get('http://dev.wdlst.law-pc-new/lawyer/list_lawyers',
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
        }
    }).success(function(data) {
    	$scope.items = data.data;
    	$scope.hide();
    }).error(function (data, status) {
        console.info(JSON.stringify(data));
        console.info(JSON.stringify(status));
    });*/

	$state.go("index");
	
	$scope.index=0;
	$scope.go=function(index){
		$ionicSlideBoxDelegate.slide(index);
	};

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
lvtuanApp.controller("loginCtrl",function($state,$scope,$rootScope,$http){

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

//圈子
lvtuanApp.controller("groupCtrl",function($scope,$http){
	console.info("groupCtrl");
})

//知识
lvtuanApp.controller("knowledgeCtrl",function($scope,$http){
	console.info("knowledgeCtrl");
})

//我的
lvtuanApp.controller("centerCtrl",function($scope,$http){
	console.info("centerCtrl");
})
