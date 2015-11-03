var lvtuanApp = angular.module('lvtuanApp.Ctrl', ['ionic','ngSanitize'])

/****************************************************** 引导页 ******************************************************/
//hone 
lvtuanApp.controller("ionicNavBarDelegateCtrl",function($state,$timeout,$http){
	//$ionicNavBarDelegate.showBar(false); //是否显示返回按钮
	$timeout(function(){ //2秒钟后跳转到index页面
		$state.go("index");
	}, 2000, [false]);
})


//首页
lvtuanApp.controller("indexCtrl",function($scope,$state,$http,$rootScope,$ionicLoading,$ionicSlideBoxDelegate,$location){
	//显示一个loading指示器
	/*$scope.show = function() {
		$ionicLoading.show({
		  template: 'Loading...'
		});
	};
	$scope.hide = function(){
		$ionicLoading.hide();
	};*/

	//跳转到登陆页面
	$scope.jumplogin = function(){
		console.info($rootScope.is_lawyer);
		$state.go("login", {reload: true});
	}

    //上拉加载
    var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据
    //$scope.show();
	$scope.loadMore = function() {

		//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
		$http.get('http://'+$rootScope.hostName+'/lawyer/list_lawyers?page='+page++,
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
				//$scope.hide();
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
		$state.go("mylvteam");
	}
})

//用户登陆
lvtuanApp.controller("loginCtrl",function($state,$scope,$rootScope,$http){
	var format_email = /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2} |net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT|cn|CN)$/;
	var format_mobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/; 
	var format_number=/^[0-9]*$/;

	$scope.submit = function(){
		submintForm();
	}
  	var submintForm = function(){
  		var params = layer.getParams("#loginForm");
  		if(checkvaldata(params)){
  			$http.post('http://'+$rootScope.hostName+'/login',
	  			{
	  				username : params.username,
	  				password : params.password
	  			},
	  			{
		            headers: {
		                'Content-Type': 'application/json' ,
		            	'Authorization': 'bearer ' + $rootScope.token
		            }
		        }).success(function(data) {
		        	var is_lawyer = data.data.is_lawyer;
		        	localStorage.setItem("is_lawyer", JSON.stringify(is_lawyer)); //存储在本地，判断是否是律师
		        	if(is_lawyer == false){
		        		$state.go("center", {reload: true});
		        	}else{
		        		$state.go("center_lawyer", {reload: true});
		        	}
		           layer.show("登陆成功！");
		           $(':input','#questions_form').not('textarea :submit, :reset, :hidden').val('');
		        }).error(function (data, status) {
		        	var errMsg = JSON.stringify(data.error_messages.password);
		        	layer.show(errMsg);
	            }); 
  		}
	}
	function checkvaldata(params){
		if(params.username == ""){
  			layer.show("请输入手机号码或者邮箱！");
  			return false;
  		}else{
  			if(!params.username.match(format_mobile)){
  				if(params.username.match(format_email) == null){
					layer.show("请输入正确邮箱账号!");
					return false;
				}
			}else{
				if(params.username.match(format_mobile)==null){
					layer.show("请输入正确的手机号码!");
					return false;
				}
			}
  		}
  		if(params.password == ""){
  			layer.show("请输入密码");
  			return false;
  		}
        return true;   
	}
})

//用户注册
lvtuanApp.controller("registerCtrl",function($scope,$rootScope,$http){
	//获取验证码
	$scope.phonecode = function(){
		var params = layer.getParams("#registerForm");
		if(params.username == ""){
  			layer.show("请输入手机号码！");
  			return false;
  		}else{
  			var param = 'phone='+params.username;
  			$http.post('http://'+$rootScope.hostName+'/send-code?'+param,{
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
  			/*var param = 'username='+params.username+'&phonecode='+params.phonecode+'&password='+params.password+'&account_type=phone';*/
  			$http.post('http://'+$rootScope.hostName+'/register',
				{
	  				username : params.username,
	  				password : params.password
	  			},
	  			{
		            headers: {
		                'Content-Type': 'application/json' , 
		            	'Authorization': 'bearer ' + $rootScope.token
		            }
		        }).success(function(data) {
		           layer.show("注册成功！");
		           $(':input','#questions_form').not('textarea :submit, :reset, :hidden').val('');
		           $state.go("center", {reload: true});
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

/****************************************************** 圈子 ******************************************************/
//圈子
lvtuanApp.controller("groupCtrl",function($scope,$http,$state,$rootScope){
	//跳转到登陆页面
	$scope.jumplogin = function(){
		console.info($rootScope.is_lawyer);
		$state.go("login", {reload: true});
	}

})
//圈子 - 列表
lvtuanApp.controller("groupListCtrl",function($scope,$http,$rootScope,$state){
	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
	$scope.items = [];	//创建一个数组接收后台的数据

    //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        $scope.loadMore();
    };

    //上拉加载 - 文库
	$scope.loadMore = function() {
		$http.get('http://'+$rootScope.hostName+'/group/list/all?page='+page++,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	console.info('文库',data.data)
				if(data.data.length > 0){
					if(data.data.length > 9){
						$scope.moredata = true;
					}else{
						$scope.moredata = false;
					}
					//用于连接两个或多个数组并返回一个新的数组
					$scope.items = $scope.items.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}

			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	};

/*	$scope.is_lawyer = JSON.parse(localStorage.getItem('is_lawyer'));
	console.info($scope.is_lawyer)
	//跳转到登陆页面
	$scope.groupcreate = function(){
		debugger
		$scope.is_lawyer = JSON.parse(localStorage.getItem('is_lawyer'));
		if($scope.is_lawye == undefined || $scope.is_lawyer == null || $scope.is_lawyer == ''){
			$state.go("login", {reload: true});
		}
		if($scope.is_lawyer == true){
			$state.go("groupcreate", {reload: true});
		}else{
			layer.show("只有律师才能创建圈子！")
		}
		
	}*/
	
	


})
//圈子 - 广播
lvtuanApp.controller("groupTeleviseCtrl",function($scope,$http,$state,$rootScope){
	console.info("广播");
	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
	$scope.televise = [];	//创建一个数组接收后台的数据

    //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.televise = [];
        $scope.loadMore();
    };

    //上拉加载 - 广播
	$scope.loadMore = function() {
		$http.get('http://'+$rootScope.hostName+'/microblog/list/all?page='+page++,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	//debugger
	        	console.info('广播',data.data)
				if(data.data.length > 0){
					if(data.data.length > 9){
						$scope.moredata = true;
					}else{
						$scope.moredata = false;
					}
					//用于连接两个或多个数组并返回一个新的数组
					$scope.televise = $scope.televise.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}

			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	};
})

//圈子 - 关注
lvtuanApp.controller("groupAttentionCtrl",function($scope,$http,$state,$rootScope){
	//创建tabs列表
	$scope.tabs = [{
            title: '已关注',
            url: 'alreadyAtten.tpl.html'
        }, {
            title: '推荐关注',
            url: 'recommAtten.tpl.html'
    }];

    $scope.currentTab = 'alreadyAtten.tpl.html'; //默认第一次显示的tpl


    $scope.onClickTab = function (tab) { //点击tab赋值url
    	$scope.moredata = true;
		$scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {  //给选中的url的a 标签样式
        return tabUrl == $scope.currentTab;
    }

})


//已关注
lvtuanApp.controller("followedController",function($scope,$http,$state,$rootScope,$ionicLoading){
	$scope.show = function() {
	    $ionicLoading.show({
	      template: 'Loading...'
	    });
	};
	$scope.hide = function(){
	    $ionicLoading.hide();
	};

 	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.mines = [];	//创建一个数组接收后台的数据
	 //下拉刷新
	$scope.doRefreshfollowed = function() {
		page = 1;
		$scope.mines = [];
        $scope.loadMorefollowed();
    };
    //上拉加载
	$scope.loadMorefollowed = function() {
		$scope.show();
		$http.get('http://'+$rootScope.hostName+'/group/list/mine?page='+page++,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
				console.info('已关注',data.data)
				if(data.data.length > 0){
					if(data.data.length > 9){
						$scope.moredata = true;
					}else{
						$scope.moredata = false;
					}
					//用于连接两个或多个数组并返回一个新的数组
					$scope.mines = $scope.mines.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					$scope.hide();
					return false;
				}
				$scope.hide();
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	};

	$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMorefollowed();
	})

	$scope.loadMorefollowed();


	$scope.groupquit = function(id){
		page = 1; //页数
    	$scope.mines = [];	//创建一个数组接收后台的数据
		var id = id;
		$http.post('http://'+$rootScope.hostName+'/group/'+id+'/quit?page='+page++,
			{},
	        {
		        cache: true,
		        headers: {
		            'Accept': 'application/json' , 
		            'Authorization': 'bearer ' + $rootScope.token
		       	}
	        }).success(function(data) {
				console.info('已关注',data.data)
				if(data.data.length > 0){
					if(data.data.length > 9){
						$scope.moredata = true;
					}else{
						$scope.moredata = false;
					}
					//用于连接两个或多个数组并返回一个新的数组
					$scope.mines = $scope.mines.concat(data.data); 
					layer.show("已关注 退出成功！");
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	}
})

//推荐关注
lvtuanApp.controller("recommController",function($scope,$http,$state,$rootScope){
	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.recommendeds = [];	//创建一个数组接收后台的数据
    $scope.search = function(){
    	page = 1; //页数
    	$scope.recommendeds = [];	//创建一个数组接收后台的数据
    	getparamq();
    }
    function getparamq(){
    	var param = layer.getParams("#search_form");
    	getUrlq(param)
    }
     //下拉刷新
	$scope.doRefreshrecommended = function() {
		page = 1;
		$scope.recommendeds = [];
        getparamq();
    };
    function getUrlq(param){
    	var url = "";
    	if(param.q){
    		url +='http://'+$rootScope.hostName+'/group/recommend?q='+param.q+'&page='+page++;
    	}else{
    		url +='http://'+$rootScope.hostName+'/group/recommend?page='+page++;
    	}
    	$http.get(url,
	        {
	        /*cache: true,*/
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {

				console.info('推荐关注',data.data)
				if(data.data.length > 0){
					if(data.data.length > 9){
						$scope.moredata = true;
					}else{
						$scope.moredata = false;
					}
					//用于连接两个或多个数组并返回一个新的数组
					$scope.recommendeds = $scope.recommendeds.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}

			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
    }
   
	
    //上拉加载 - 法规
	$scope.loadMorerecommended = function() {
		getparamq();
	};

	$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMorerecommended();
	})

	$scope.groupjoin = function(id){
		page = 1; //页数
    	$scope.recommendeds = [];	//创建一个数组接收后台的数据
		var id = id; 
		$http.post('http://'+$rootScope.hostName+'/group/'+id+'/join?page='+page++,
			{},
	        {
		        cache: true,
		        headers: {
		            'Accept': 'application/json' , 
		            'Authorization': 'bearer ' + $rootScope.token
		       	}
	        }).success(function(data) {
				console.info('已关注',data.data)
				if(data.data.length > 0){
					if(data.data.length > 9){
						$scope.moredata = true;
					}else{
						$scope.moredata = false;
					}
					//用于连接两个或多个数组并返回一个新的数组
					$scope.recommendeds = $scope.recommendeds.concat(data.data); 
					layer.show("已关注 加入成功！");
				}else{
					layer.show("暂无数据！");
					$scope.moredata = false;
					return false;
				}
			}).error(function (data, status) {
				var datacode = JSON.stringify(data);
				if(datacode.status_code == 400){
					layer.show("你已经是该圈子的成员了!")
				}
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	}
})

//圈子详情
lvtuanApp.controller("groupviewCtrl",function($scope,$http,$state,$rootScope){
	console.info("圈子详情");

})
//广播详情
lvtuanApp.controller("broadcastviewCtrl",function($scope,$http,$state,$rootScope){
	console.info("广播详情");

})
//创建圈子
lvtuanApp.controller("groupcreateCtrl",function($scope,$http,$state,$rootScope){
	console.info("创建圈子");
	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
	$scope.items = [];	//创建一个数组接收后台的数据

    //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        $scope.loadMore();
    };

    //上拉加载 - 广播
	$scope.loadMore = function() {
		$http.get('http://'+$rootScope.hostName+'/lawyer/list_lawyers?page='+page++,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	//debugger
	        	console.info('创建圈子',data.data)
				if(data.data.length > 0){
					if(data.data.length > 9){
						$scope.moredata = true;
					}else{
						$scope.moredata = false;
					}
					//用于连接两个或多个数组并返回一个新的数组
					$scope.items = $scope.items.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}

			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	};


	//数组删除的方法
	Array.prototype.remove = function(index){
	    if(isNaN(index) || index > this.length){
	        return false;
	    }
	    for(var i=0,n=0;i<this.length;i++){
	        if(this[i] != this[index]){
	            this[n++] = this[i];
	        }
	    }
	    this.length -= 1;
	}

	//判断用户是否选中
	$scope.selIds = [];
	$scope.checkItem = function(obj,id){
		if(obj == false){
			var index;
			angular.forEach($scope.selIds,function(val,key){
				if(val == id){
					index = key;
				}
			});
			$scope.selIds.remove(index, index);
		}else{
			$scope.selIds.push(id);
		}
	}
	


	// /group//{groupId}/uploadImage/{field?}  group_avatar

	//创建圈子
	$scope.createSubmit = function(){
		var group_id =  $scope.selIds;
		var params = getParams("#createGroup_form");
		console.info(params);
  		if(params.group_name == ""){
  			layer.show("请输入圈子名称!");
  			return false;
  		}else if(params.group_avatar == ""){
  			layer.show("请上传圈子头像!");
  			return false;
  		}else{
  			/*$http.post('http://'+$rootScope.hostName+'/group/create',{
  					'group_name'	: params.group_name,
	            	'group_avatar'	: params.group_avatar,
	            	'group_id'		: params.group_id
	            },
	            {
	            headers: {
	                'Content-Type': 'application/json' , 
	            	'Authorization': 'bearer ' + $rootScope.token,
	            }
	        }).success(function(data) {
	           layer.show("提交成功！");
	           $(':input','#questions_form').not('textarea :submit, :reset, :hidden').val('');

	        }).error(function (data, status) {
	        	var errMsg = JSON.stringify(data.error_messages);
	        	layer.show(errMsg);
            });
            return true;*/
  		}    
	}

})



/****************************************************** 知识 ******************************************************/
//知识
lvtuanApp.controller("knowledgesCtrl",function($scope,$http,$rootScope){

	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.knowledges = [];	//创建一个数组接收后台的数据

    $scope.search = function(){
    	page = 1; //页数
    	$scope.knowledges = [];	//创建一个数组接收后台的数据
    	getparamq();
    }

    function getparamq(){
    	var param = layer.getParams("#search_form");
    	getUrlq(param)
    }

    function getUrlq(param){
    	var url = "";
    	if(param.q){
    		url +='http://'+$rootScope.hostName+'/knowledge/article/list_articles?q='+param.q+'&page='+page++;
    	}else{
    		url +='http://'+$rootScope.hostName+'/knowledge/article/list_articles?page='+page++;
    	}

    	$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
				console.info('法规',data.data)
				if(data.data.length > 0){
					if(data.data.length > 9){
						$scope.moredata = true;
					}else{
						$scope.moredata = false;
					}
					//用于连接两个或多个数组并返回一个新的数组
					$scope.knowledges = $scope.knowledges.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}

			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });

    }

	 //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.knowledges = [];
        getparamq();
    };

    //上拉加载 - 法规
	$scope.loadMore = function() {
		getparamq();
	};

})

//知识-文库
lvtuanApp.controller("documentsCtrl",function($scope,$http,$rootScope){
	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
	$scope.documents = [];	//创建一个数组接收后台的数据

	$scope.search = function(){
    	page = 1; //页数
    	$scope.documents = [];	//创建一个数组接收后台的数据
    	getparamq();
    }

    function getparamq(){
    	var param = layer.getParams("#search_form");
    	getUrlq(param)
    }

    function getUrlq(param){
    	var url = "";
    	if(param.q){
    		url +='http://'+$rootScope.hostName+'/knowledge/document/list_documents?q='+param.q+'&page='+page++;
    	}else{
    		url +='http://'+$rootScope.hostName+'/knowledge/document/list_documents?page='+page++;
    	}

    	$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	console.info('文库',data.data)
				if(data.data.length > 0){
					if(data.data.length > 9){
						$scope.moredata = true;
					}else{
						$scope.moredata = false;
					}
					//用于连接两个或多个数组并返回一个新的数组
					$scope.documents = $scope.documents.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}

			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });

    }

    //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.documents = [];
        getparamq();
    };

    //上拉加载 - 文库
	$scope.loadMore = function() {
		getparamq();
	};
})

//知识-案例
lvtuanApp.controller("casesCtrl",function($scope,$http,$rootScope){
	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
	$scope.cases = [];	//创建一个数组接收后台的数据
    //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.cases = [];
        $scope.loadMoreCases();
    };

    //上拉加载 - 案列
	$scope.loadMore = function() {
		//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
		$http.get('http://'+$rootScope.hostName+'/case/list_case?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
			console.info('案列',data.data)
			if(data.data.length > 0){
				if(data.data.length > 9){
					$scope.moredata = true;
				}else{
					$scope.moredata = false;
				}
				//用于连接两个或多个数组并返回一个新的数组
				$scope.cases = $scope.cases.concat(data.data); 
			}else{
				layer.show("暂无数据！")
				$scope.moredata = false;
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })
	    .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
	};
})
//法规-详情
lvtuanApp.controller("knowKnowledgesCtrl",function($scope,$http,$rootScope,$stateParams,$interval){
	init();
	//获取律师的个人信息
	function init(){ 
		var url = 'http://'+$rootScope.hostName+'/knowledge/article/'+$stateParams.id+'/view';
		$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	console.info(data.data)
	        	$scope.items = data.data;

			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })


	}
})


//文库-详情
lvtuanApp.controller("knowDocumentsCtrl",function($scope,$http,$rootScope,$interval,$stateParams){

	init();
	//获取律师的个人信息
	function init(){ 
		var url ='http://'+$rootScope.hostName+'/knowledge/document/list_documents';
		$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	console.info(data.data)
	        	$scope.documents = data.data;
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}

	$scope.id = $stateParams.id;
})
//案列-详情
lvtuanApp.controller("knowCasesCtrl",function($scope,$http,$rootScope,$interval,$stateParams){
	init();
	//获取律师的个人信息
	function init(){ 
		var url = 'http://'+$rootScope.hostName+'/case/'+$stateParams.id+'/view';
		$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	console.info(data.data)
	        	$scope.items = data.data;

			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}
})
/****************************************************** 我的 ******************************************************/
/*———————————————————————————— 用户的个人中心 ————————————————————————————*/
//普通用户-我的
lvtuanApp.controller("centerCtrl",function($scope,$http,$rootScope,$ionicPopup,$timeout){
	//普通用户个人信息
	$http.get('http://'+$rootScope.hostName+'/center/customer/info',
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info(data.data)
			if(data.data){
				//用于连接两个或多个数组并返回一个新的数组
				$scope.items = data.data; 
			}else{
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })

	//邀请好友
	$scope.invitefriend = function(){
       $scope.data = {}
       // 自定义弹窗
        var myPopup = $ionicPopup.show({
	         templateUrl: 'popup-invitefriend-template.html',
	         title: '邀请好友',
	         scope: $scope,
	         buttons: [
	           { text: 'Cancel' },
	         ]
	       });
	       /*$timeout(function() {
	          myPopup.close(); // 3秒后关闭弹窗
	       }, 3000);*/
	}
})

//普通用户-个人资料
lvtuanApp.controller("infoCtrl",function($scope,$http,$rootScope,$ionicActionSheet,$timeout){
	$scope.show = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '拍照' },
              { text: '从相册中选择' }
            ],
            titleText: '请您选择',
            buttonClicked: function(index) {
            	if(index==0){
            		alert("拍照");
            	}else{
            		alert("从相册中选择");
            	}
              return true;
            }
        });
    };
    $scope.show2 = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '男' },
              { text: '女' }
            ],
            titleText: '请您选择',
            buttonClicked: function(index) {
            	if(index==0){
            		alert("男");
            	}else{
            		alert("女");
            	}
              return true;
            }
        });
    };
    
    $scope.deadline = function() {
	    var options = {
	      date: $scope.todo_date,
	      mode: 'date'
	    };
	    datePicker.show(options, function(d) {
	      if (!isNaN(d.getTime())) {  // valid date
	        $scope.$apply(function () {
	          $scope.todo_date = d;
	        });
	      }
	    });
    }
})
//普通用户的积分
lvtuanApp.controller("listscoresCtrl",function($scope,$http,$rootScope){
	$http.get('http://'+$rootScope.hostName+'/center/score/list_scores',
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
			if(data.data){
				//用于连接两个或多个数组并返回一个新的数组
				$scope.items = data.data; 
			}else{
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })

})
//普通用户的收藏
lvtuanApp.controller("collectCtrl",function($scope,$http,$rootScope){
	$http.get('http://'+$rootScope.hostName+'/center/collect',
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info(data.data)
			if(data.data){
				//用于连接两个或多个数组并返回一个新的数组
				$scope.items = data.data; 
			}else{
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })

})
//普通用户的评论
lvtuanApp.controller("commentCtrl",function($scope,$http,$rootScope){
	console.info("律师的评论");

})
//我的消息-系统消息
lvtuanApp.controller("messagesCtrl",function($scope,$http,$rootScope){
	console.info("我的消息");

})
//普通用户-我的关注
lvtuanApp.controller("followedCtrl",function($scope,$http,$rootScope){
	console.info("我的关注");

})
//普通用户-认证为律师
lvtuanApp.controller("becomelawyerCtrl",function($scope,$http,$rootScope,$ionicActionSheet,$timeout){
	$scope.show = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '拍照' },
              { text: '从相册中选择' }
            ],
            titleText: '请您选择',
            buttonClicked: function(index) {
            	if(index==0){alert("拍照");}else{
            		alert("从相册中选择");
            	}
              return true;
            }
        });
    };
    $scope.lishow = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '律师' },
              { text: '高级律师' },
              { text: '合伙人' }
            ],
            titleText: '律师类型',
            buttonClicked: function(index) {
              return true;
            }
        });
    };

})
/*———————————————————————————— 律师的个人中心 ————————————————————————————*/
//我的
lvtuanApp.controller("centerlaywerCtrl",function($scope,$http,$rootScope,$timeout,$ionicPopup){
	//律师个人信息
	$http.get('http://'+$rootScope.hostName+'/center/lawyer/info',
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info(data.data)
			if(data.data){
				//用于连接两个或多个数组并返回一个新的数组
				$scope.items = data.data; 
			}else{
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })

	//邀请好友
	$scope.invitefriend = function(){
       $scope.data = {}
       // 自定义弹窗
        var myPopup = $ionicPopup.show({
	         templateUrl: 'popup-invitefriend-template.html',
	         title: '邀请好友',
	         scope: $scope,
	         buttons: [
	           { text: 'Cancel' },
	         ]
	       });
	       $timeout(function() {
	          myPopup.close(); // 3秒后关闭弹窗
	       }, 3000);
	}

})
//律师-个人资料
lvtuanApp.controller("infolawyerCtrl",function($scope,$http,$rootScope){
	console.info("个人资料");

})
//我的关注
lvtuanApp.controller("followedlaywerCtrl",function($scope,$http,$rootScope){
	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据
    //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        $scope.loadMore();
    };
	//上拉加载
	$scope.loadMore = function() {
	$http.get('http://'+$rootScope.hostName+'/center/lawyer/customer/followed?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
			if(data.data.length > 0){
				if(data.data.length > 9){
					$scope.moredata = true;
				}else{
					$scope.moredata = false;
				}
				$scope.items = data.data; 
				console.info($scope.items );
				return true;
			}else{
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })
	};
})
//律师的积分
lvtuanApp.controller("listscoreslaywerCtrl",function($scope,$http,$rootScope){
	$http.get('http://'+$rootScope.hostName+'/center/lawyer/score/list_scores',
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
			if(data.data){
				//用于连接两个或多个数组并返回一个新的数组
				$scope.items = data.data; 
			}else{
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })

})

//律师的评论
lvtuanApp.controller("commentlaywerCtrl",function($scope,$http,$rootScope){
	console.info("律师的评论");

})

//律师的文章
lvtuanApp.controller("articlelaywerCtrl",function($scope,$http,$rootScope){
	console.info("律师的文章");
	$http.get('http://'+$rootScope.hostName+'/lawyer/blog/list',
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
			if(data.data){
				//用于连接两个或多个数组并返回一个新的数组
				$scope.items = data.data; 
				console.info($scope.items)
			}else{
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })

})

//我的消息-系统消息
lvtuanApp.controller("messageslaywerCtrl",function($scope,$http,$rootScope){
	console.info("我的消息");

})

/*———————————————————————————— 个人中心公用 ————————————————————————————*/
//个人中心公用-关于律团
lvtuanApp.controller("aboutCtrl",function($scope,$timeout,$ionicPopup){
	$scope.showPopup = function() {
		$scope.data = {}
		var myPopup = $ionicPopup.show({
		 template: '<input type="password" ng-model="data.wifi">',
		 title: 'Enter Wi-Fi Password',
		 subTitle: 'Please use normal things',
		 scope: $scope,
		 buttons: [
		   { text: 'Cancel' },
		   {
		     text: '<b>Save</b>',
		     type: 'button-positive',
		     onTap: function(e) {
		       if (!$scope.data.wifi) {
		         //don't allow the user to close unless he enters wifi password
		         e.preventDefault();
		       } else {
		         return $scope.data.wifi;
		       }
		     }
		   },
		 ]
		});
		myPopup.then(function(res) {
		 console.log('Tapped!', res);
		});
		$timeout(function() {
		  myPopup.close(); //close the popup after 3 seconds for some reason
		}, 3000);
		};
		$scope.showConfirm = function() {
		 var confirmPopup = $ionicPopup.confirm({
		   title: '温馨提示',
		   template: '系统检测到有最新版本，点击确定进行下载。'
		 });
		 confirmPopup.then(function(res) {
		   if(res) {
		     console.log('You are sure');
		   } else {
		     console.log('You are not sure');
		   }
		 });
		};
		$scope.showAlert = function() {
		 var alertPopup = $ionicPopup.alert({
		   title: '温馨提示',
		   template: '您的软件已经是最新版本！'
		 });
		 alertPopup.then(function(res) {
		   console.log('Thank you for not eating my delicious ice cream cone');
		 });
		};

})

//个人中心公用-设置
lvtuanApp.controller("siteCtrl",function($scope,$http,$rootScope){
	console.info("设置");

})


/****************************************************** 找律师 ******************************************************/
//找律师
lvtuanApp.factory("AskLawyerAPI",function(){
	//获得API
	var arrayAPI=new Array();
	arrayAPI=[{name:"刑事辩护"},{name:"公司法务"},{name:"婚姻家庭"},{name:"劳动纠纷"},{name:"交通事故"},{name:"合同纠纷"}]
	
	var askLawyerAPIServer={};
	askLawyerAPIServer.getTypeValue=function(){
		return arrayAPI;
	}
		
	return askLawyerAPIServer;
})

lvtuanApp.factory("RangeSelectAPI",function(){
	//获得API
	var arrayAPI=new Array();
	arrayAPI=[{name:"全部"},{name:"个人"},{name:"企业"}]
	
	var RangeSelectAPIServer={};
	RangeSelectAPIServer.getRangeSelectAPIValue=function(){
		return arrayAPI;
	}
		
	return RangeSelectAPIServer;
})

lvtuanApp.factory("BookDownAPI",function(){
	var arrayAPI=new Array();
	arrayAPI=[{
		bdName:"离婚协议书",
		bdTime:"2015-07-15",
		bdNum:"334"
	},{
		bdName:"离婚协议书",
		bdTime:"2015-07-15",
		bdNum:"334"		
	},{
		bdName:"离婚协议书",
		bdTime:"2015-07-15",
		bdNum:"334"			
	},{
		bdName:"离婚协议书",
		bdTime:"2015-07-15",
		bdNum:"334"			
	},{
		bdName:"离婚协议书",
		bdTime:"2015-07-15",
		bdNum:"334"			
	},{
		bdName:"离婚协议书",
		bdTime:"2015-07-15",
		bdNum:"334"			
	}];
	
	var BookDownAPIServer={};
	BookDownAPIServer.getBookDownAPIValue=function(){
		return arrayAPI;
	}
	return BookDownAPIServer;
})

lvtuanApp.controller("findlawyerCtrl",function($scope,BookDownAPI,AskLawyerAPI,RangeSelectAPI){
	$scope.BookDownItems=BookDownAPI.getBookDownAPIValue();

	//选择类型
	$scope.askLawyerTypeItems=AskLawyerAPI.getTypeValue();
	//选择类型单击操作-显示/隐藏
	$scope.isShowObj={
		show:false
	};
	$scope.toggleMenu=function(){
		$scope.isShowObj.show=!$scope.isShowObj.show;
	}
	
	//选择范围
	$scope.rItems=RangeSelectAPI.getRangeSelectAPIValue();
	//选择范围单击操作
	$scope.isShowList={
		show:false
	}
	$scope.toggleMenu2=function(){
		$scope.isShowList.show=!$scope.isShowList.show;
	}
	
})


//找律师的列表
lvtuanApp.controller("lawyerlistCtrl",function($scope,$state,$http,$rootScope){
	

	
	getCities();
	getWorkscopes();
	//获取所在区域
	function getCities(){
		$http.get('http://'+$rootScope.hostName+'/lawyer/cities',
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
				$scope.cities = data.data; 
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}
	//获取法律专长
	function getWorkscopes(){
		$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes',
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
				$scope.workscopes = data.data; 
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}

	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

    //搜索问题
	$scope.search = function(e){
		localStorage.removeItem('items'); //清空之前的旧数据
		localStorage.removeItem('q');
		page = 1;
		$scope.items = [];
		getParams();
		layer.stopDefault(e);
	}
	//根据地区查找律师
	$scope.searchCity = function(){
		page = 1;
		$scope.items = [];
	    getParams();
	}
	//根据法律专长查找律师
	$scope.searchCat = function(){
		page = 1;
		$scope.items = [];
	    getParams();
	}
	//获取参数，处理被收藏书签的情况
	function getParams(){
		var params = layer.getParams("#searchForm");
	  	var param = [];
	  	if(params.q){
	  		param.push('q=' + params.q);
	  	}
	  	if(params.city_id){
	  		param.push('city_id=' + params.city_id);
	  	}
	  	if(params.cat_id){
	  		param.push('cat_id=' + params.cat_id);
	  	}
	  	if(params.experience){
	  		param.push('experience=' + params.experience);
	  	}
	  	if(params.order){
	  		param.push('order=' + params.order);
	  	}
	  	param = param.join('&');
	  	console.info(param)
	  	geturl(param);
	}

	//下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        getParams();
    };

    //上拉加载
	$scope.loadMore = function() {
		//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
		getParams();
	};

	function geturl(param){
		var url;
		if(param != ""){
	  		url = 'http://'+$rootScope.hostName+'/lawyer/list_lawyers?'+param+'&page='+page++;
	    }else{
	    	url = 'http://'+$rootScope.hostName+'/lawyer/list_lawyers?page='+page++;
	    }
	    console.info(url);
		$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	console.info(data.data)
				if(data.data.length > 0){
					$scope.moredata = true;
					//用于连接两个或多个数组并返回一个新的数组
					$scope.items = $scope.items.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	}
	
})
//律师个人主页
lvtuanApp.controller("viewCtrl",function($scope,$state,$http,$rootScope,$stateParams,$ionicPopup, $timeout){
	//创建tabs列表
	$scope.tabs = [{
            title: '个人介绍',
            url: 'selfintro.tpl.html'
        }, {
            title: '评价',
            url: 'evaluate.tpl.html'
        }, {
            title: '文章',
            url: 'article.tpl.html'
        }, {
            title: '广播',
            url: 'televise.tpl.html'
    }];

    $scope.currentTab = 'selfintro.tpl.html'; //默认第一次显示的tpl

    $scope.onClickTab = function (tab) { //点击tab赋值url
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {  //给选中的url的a 标签样式
        return tabUrl == $scope.currentTab;
    }

	init() //初始化数据
	
	//获取律师的个人信息
	function init(){ 
		var url = 'http://'+$rootScope.hostName+'/lawyer/'+$stateParams.id;
		$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	console.info(data.data)
	        	$scope.items = data.data;
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}


	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite

    //获取律师的文章列表
    $scope.articles = [];	//创建一个数组接收后台的数据
    $scope.loadMoreArticles = function(){
		getEvaluation();
	}
	//获取律师的评价列表
	function getArticles(){
		var url = 'http://'+$rootScope.hostName+'/lawyer/'+$stateParams.id+'/articles?page='+page++;
		$http.get(url,
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
					$scope.articles = $scope.articles.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	}

	//获取律师的评价列表
	$scope.evaluations = [];	//创建一个数组接收后台的数据
	$scope.loadMoreEvaluation = function(){
		getEvaluation();
	}
	function getEvaluation(){
		var url = 'http://'+$rootScope.hostName+'/lawyer/'+$stateParams.id+'/articles?page='+page++;
		$http.get(url,
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
					$scope.evaluations = $scope.evaluations.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	}

   $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: '温馨提示',
       template: '系统检测到有最新版本，点击确定进行下载。'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: '温馨提示',
       template: '您的软件已经是最新版本！'
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };
})



//找律师-图文咨询
lvtuanApp.controller("graphicCtrl",function($scope,$http,$rootScope){
	console.info("图文咨询");

})
//找律师-专业咨询
lvtuanApp.controller("specialCtrl",function($scope,$http,$rootScope){
	console.info("专业咨询");

})
/****************************************************** 问律师 ******************************************************/

//问律师
lvtuanApp.controller("questionsCtrl",function($scope,$state,$http,$rootScope){
	
	//选择类型
	$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes',
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	        }
	    }).success(function(data) {
	      if(data.data){
	        $scope.workscopes = data.data;
	      }else{
	      	layer.show("暂无数据！");
	      }
	    }).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    });


	//选择类型单击操作-显示/隐藏
	$scope.isShowObj={
		show:false
	};
	$scope.toggleMenu=function(key){
		$scope.isShowObj.show=!$scope.isShowObj.show;
		if($scope.isShowObj.show == false){
			var key = this.workscope.key;
			var val = this.workscope.value;
			var workscopes = document.getElementById("workscopes");
			$scope.cat_id = key;
			angular.element(workscopes).val(val);
			$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes',
			        {
			        cache: true,
			        headers: {
			            'Content-Type': 'application/json' , 
			            'Authorization': 'bearer ' + $rootScope.token
			        }
			    }).success(function(data) {
			      if(data.data){
			        $scope.workscopes = data.data;
			      }else{
			        layer.show("暂无数据！");
			      }
			    }).error(function (data, status) {
			        console.info(JSON.stringify(data));
			        console.info(JSON.stringify(status));
			    });
		}
	}

	//提交问题
	$scope.submit = function(){
		var params = layer.getParams("#questions_form");
  		if(params.cat_id == ""){
  			layer.show("请选择案例类型!");
  			return false;
  		}else if(params.title == ""){
  			layer.show("请输入标题!");
  			return false;
  		}else if(params.content == ""){
  			layer.show("请输入问题!");
  			return false;
  		}else{
  			/*var param = 'cat_id='+params.cat_id+'&title='+params.title+'&content='+params.content;*/
  			$http.post('http://'+$rootScope.hostName+'/question/create',{
  					'cat_id'	: params.cat_id,
	            	'title'		: params.title,
	            	'content'	: params.content
	            },
	            {
	            headers: {
	                'Content-Type': 'application/json' , 
	            	'Authorization': 'bearer ' + $rootScope.token,
	            }
	        }).success(function(data) {
	           layer.show("提交成功！");
	           $(':input','#questions_form').not('textarea :submit, :reset, :hidden').val('');

	        }).error(function (data, status) {
	        	var errMsg = JSON.stringify(data.error_messages);
	        	layer.show(errMsg);
            });
            return true;
  		}    
	}


	//搜索问题
	localStorage.removeItem('q');
	$scope.search = function(){
		var q = $.trim($(".search").val());
		localStorage.setItem("q", JSON.stringify(q));
		$state.go("questionslist",{q:q}, {reload: true}); 
	}

	//上拉加载
    var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.list_questions = [];	//创建一个数组接收后台的数据
	$scope.loadMore = function() {
		//获取咨询列表
		$http.get('http://'+$rootScope.hostName+'/question/list_questions?page='+page++,
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
				$scope.list_questions = $scope.list_questions.concat(data.data); 
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}else{
				$scope.moredata = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				layer.show("暂无数据！");
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })
		
	};

	/*$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMore();
	});*/
	
})

//问律师列表
lvtuanApp.controller("questionslistCtrl",function($http,$scope,$state,$rootScope,$timeout){

	var q = JSON.parse(localStorage.getItem('q'));
	console.info(q)
	angular.element(".searchq").val(q);

    var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

    //搜索问题
	$scope.search = function(){
		localStorage.removeItem('q');
		page = 1;
		$scope.items = [];
		q = angular.element(".searchq").val();
		$scope.loadMore();

	}

	//下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        $scope.loadMore();
    };

    //上拉加载
	$scope.loadMore = function() {
		//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
		var url = "";
		if(q == "" || q == null){
			url = 'http://'+$rootScope.hostName+'/question/list_questions?page='+page++;

		}else{ 
			url = 'http://'+$rootScope.hostName+'/question/list_questions?q='+q+'&page='+page++;
		}
		$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
				if(data.data.length > 0){
					if(data.data.length > 9){
						$scope.moredata = true;
					}else{
						$scope.moredata = false;
					}
					//用于连接两个或多个数组并返回一个新的数组
					$scope.items = $scope.items.concat(data.data); 
					return true;
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	};

	$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMore();
	})

})

//问律师详情
lvtuanApp.controller("questionsviewsCtrl",function($http,$scope,$state,$rootScope,$stateParams){
	init()
	//获取律师的个人信息
	function init(){ 
		var url = 'http://'+$rootScope.hostName+'/question/'+$stateParams.id;
		$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	console.info(data.data)
	        	$scope.items = data.data;
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}

})

/*———————————————————————————— 首页八模块 ————————————————————————————*/

//法律咨询
lvtuanApp.controller("legaladviceCtrl",function($http,$scope,$rootScope){
	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.knowledges = [];	//创建一个数组接收后台的数据

    $scope.search = function(){
    	page = 1; //页数
    	$scope.knowledges = [];	//创建一个数组接收后台的数据
    	getparamq();
    }

    function getparamq(){
    	var param = layer.getParams("#search_form");
    	getUrlq(param)
    }

    function getUrlq(param){
    	var url = "";
    	if(param.q){
    		url +='http://'+$rootScope.hostName+'/knowledge/article/list_articles?q='+param.q+'&page='+page++;
    	}else{
    		url +='http://'+$rootScope.hostName+'/knowledge/article/list_articles?page='+page++;
    	}
    	$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
				console.info('法规',data.data)
				if(data.data.length > 0){
					if(data.data.length > 9){
						$scope.moredata = true;
					}else{
						$scope.moredata = false;
					}
					//用于连接两个或多个数组并返回一个新的数组
					$scope.knowledges = $scope.knowledges.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}

			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });

    }

	 //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.knowledges = [];
        getparamq();
    };

    //上拉加载 - 法规
	$scope.loadMore = function() {
		getparamq();
	};
})

//法律讲堂
lvtuanApp.controller("lawlectureCtrl",function($http,$scope,$state,$rootScope){
	console.info("法律讲堂");
})

//案件委托
lvtuanApp.controller("casescommCtrl",function($http,$scope,$state,$rootScope){
	console.info("案件委托");
})

//律团联盟
lvtuanApp.controller("lvtuanallianceCtrl",function($http,$scope,$state,$rootScope,$stateParams){
	init()
	//律团联盟
	function init(){ 
		var url = 'http://'+$rootScope.hostName+'/union/list_partners';
		$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	$scope.unions = data.data;
	        	localStorage.setItem("unions", JSON.stringify($scope.unions));
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}

	//首页-律团联盟-联盟详情
	var id = $stateParams.id;
	var unionView = JSON.parse(localStorage.getItem('unions'));
	for(var i=0;i<unionView.length; i++){
		if(id == unionView[i].id){
			$scope.views = unionView[i];
		}
	}
	
})



//人才交流
lvtuanApp.controller("talentCtrl",function($http,$scope,$state,$rootScope){
	init()
	//人才交流
	function init(){ 
		var url = 'http://'+$rootScope.hostName+'/hr/list_positions';
		$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	$scope.positions = data.data;
	        	console.info($scope.positions)
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}
})
//人才交流详情
lvtuanApp.controller("talentviewCtrl",function($http,$scope,$state,$rootScope,$stateParams){
	init()
	//人才交流详情
	function init(){ 
		var url = 'http://'+$rootScope.hostName+'/hr/'+$stateParams.id+'/view';
		$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	$scope.positions = data.data;
	        	console.info($scope.positions)
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}
})



/*———————————————————————————— 我的律团 - 律师的律团 ————————————————————————————*/
//首页 - 我的律团 - 律师的工作台
lvtuanApp.controller("mylvtuanCtrl",function($http,$scope,$state,$rootScope){
	console.info("律师的律团");
})
//律师的工作 - 律师的订单
lvtuanApp.controller("workbenchLawyerCtrl",function($http,$scope,$state,$rootScope){
	console.info("律师的订单");
})
//律师的工作 - 全部
lvtuanApp.controller("orderAllCtrl",function($http,$scope,$state,$rootScope){
	console.info("全部");
})
//律师的工作 - 待处理
lvtuanApp.controller("orderPendingCtrl",function($http,$scope,$state,$rootScope){
	console.info("待处理");
})
//律师的工作 - 处理中
lvtuanApp.controller("orderRepliedCtrl",function($http,$scope,$state,$rootScope){
	console.info("处理中");
})
//律师的工作 - 已完成
lvtuanApp.controller("orderCompletedCtrl",function($http,$scope,$state,$rootScope){
	console.info("已完成");
})
//律师的工作 - 已超时
lvtuanApp.controller("orderTimeoutCtrl",function($http,$scope,$state,$rootScope){
	console.info("已超时");
})


/*———————————————————————————— 我的律团 - 用户的律团 ————————————————————————————*/