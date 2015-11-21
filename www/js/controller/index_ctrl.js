var lvtuanApp = angular.module('lvtuanApp.Ctrl', ['ionic','ngSanitize','ngFileUpload'])

/****************************************************** 引导页 ******************************************************/
//tabs选择项
lvtuanApp.controller("HeaderController",function($scope,$location){
      $scope.isActives = function (route) { 
      	return route === $location.path();
      };
})

//hone 
lvtuanApp.controller("ionicNavBarDelegateCtrl",function($state,$timeout,$http,$location){
	//$ionicNavBarDelegate.showBar(false); //是否显示返回按钮
	$timeout(function(){ //2秒钟后跳转到index页面
		location.href='#/index';
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

    //上拉加载
    var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据
    //$scope.show();
	$scope.loadMore = function() {

		//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
		$http.get('http://'+$rootScope.hostName+'/lawyer/list_lawyers?page='+page++ +'&rows_per_page=4',
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
				//$scope.hide();
			}else{
				$scope.moredata = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })

		.finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
	};

	$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMore();
	});

	location.href='#/index';

	$scope.mylvteam = function(){
		location.href='#/mylvteam';
	}
	
})

//用户登陆
lvtuanApp.controller("loginCtrl",function($state,$scope,$rootScope,$http){
	var format_email = /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2} |net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT|cn|CN)$/;
	var format_mobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/; 
	var format_number=/^[0-9]*$/;

	$scope.submit = function(){
		localStorage.removeItem('user_group_id');
		localStorage.removeItem('is_verified');
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
		                'Content-Type': 'application/json'
		            }
		        }).success(function(data) {
		        	console.info(data.data);
		        	 layer.show("登陆成功！");

		        	 /*让浏览器记住用户id*/
		        	var user_id = data.data.id;
		        	var user_group_id = data.data.user_group_id;
		        	var is_verified = data.data.is_verified;

		        	localStorage.setItem("user_id", JSON.stringify(user_id)); 
		        	localStorage.setItem("token", data.token); //让浏览器记住token
		        	localStorage.setItem("user_group_id", JSON.stringify(user_group_id)); //存储在本地，判断是否是律师
		        	localStorage.setItem("is_verified", JSON.stringify(is_verified)); //存储在本地，判断是否是律师

		        	//判断是否是律师
	        		location.href='#/center';
	        		window.location.reload();
		          
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
lvtuanApp.controller("resetpwdCtrl",function($scope,$http,$rootScope){
	$scope.user = {};
	$scope.save = function(user){
		if(user.old_password == user.new_password && user.old_password == user.new_password_retype && user.new_password == user.new_password_retype){
			layer.show("修改密码不能和初始密码一样！");
			return false;
		}else if(user.new_password.length != user.new_password_retype.length){
			layer.show("重置密码的长度不一致！");
			return false;
		}else if(user.new_password != user.new_password_retype){
			layer.show("两次输入的密码不一致！");
			return false;
		}else{
			$http.post('http://'+$rootScope.hostName+'/center/reset_pass', $scope.user,
  			{
	            headers: {
	                'Content-Type': 'application/json' , 
	            	'Authorization': 'bearer ' + $rootScope.token
	            }
	        }).success(function(data) {
	           layer.show("修改成功！");
	           $scope.user = {}; //清空数据
	           location.href='#/login';
		        window.location.reload();
	        }).error(function (data, status) {
	        	var errMsg = JSON.stringify(data.error_messages);
	        	layer.show(errMsg);
            });
			return true;
		}

	}
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
		$http.get('http://'+$rootScope.hostName+'/group/list/mine?page='+page++,
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	};

})
//圈子 - 广播
lvtuanApp.controller("groupTeleviseCtrl",function($scope,$http,$state,$rootScope){
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	};

	//点赞
	$scope.likes = function(id,index){
		$http.post('http://'+$rootScope.hostName+'/like',
			{
				item_type : 'post',
				item_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json' ,
            	'Authorization': 'bearer ' + $rootScope.token
            }
        }).success(function(data) {
        	/*var itmes = data.data;*/
           layer.show("点赞成功！");
        }).error(function (data, status) {
        	var errMsg = JSON.stringify(data.error_messages.item_id[0]);
        	layer.show(errMsg);
        }); 
	}

})

//圈子 - 推荐关注
lvtuanApp.controller("groupAttentionCtrl",function($scope,$http,$state,$rootScope){
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
	$scope.doRefresh = function() {
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
    }
   
	
    //上拉加载 - 推荐关注
	$scope.loadMore = function() {
		getparamq();
	};

	/*$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMore();
	})*/

	$scope.groupjoin = function(id,index){
		page = 1; //页数
    	//$scope.recommendeds = [];	//创建一个数组接收后台的数据
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
				if(data.data){
					//更新当前这条数据
					$scope.recommendeds.splice(index, 1);

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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	};

})
//创建圈子
lvtuanApp.controller("groupcreateCtrl",function($scope,$http,$state,$rootScope,$timeout,Upload){
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
	$scope.loadMore = function() { ///lawyer/list_lawyers
		$http.get('http://'+$rootScope.hostName+'/group/create?page='+page++,
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
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}
			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
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

	//创建圈子
	$scope.createSubmit = function(){
		var members =  $scope.selIds;
		var params = getParams("#createGroup_form");
  		if(params.group_name == ""){
  			layer.show("请输入圈子名称!");
  			return false;
  		}else if(params.group_avatar == ""){
  			layer.show("请上传圈子头像!");
  			return false;
  		}else{
  			$http.post('http://'+$rootScope.hostName+'/group/store',{
  					'group_name'	: params.group_name,
	            	'group_avatar'	: params.group_avatar,
	            	'members'		: members
	            },
	            {
	            headers: {
	                'Content-Type': 'application/json' , 
	            	'Authorization': 'bearer ' + $rootScope.token,
	            }
	        }).success(function(data) {
	           layer.show("创建成功！");
	           $scope.selIds = {};
	           $scope.file = {};
	           $(':input','#questions_form').not('textarea :submit, :reset, :hidden').val('');
	           location.href='#/group/list';
	        }).error(function (data, status) {
	        	if(status == 400){
	        		var errMsg = JSON.stringify(data.error_messages.group_name[0]);
	        		console.info(errMsg);
	        		layer.show(errMsg);
	        	}
	        	console.info(data);
	        	console.info(status);
	        	var errMsg = JSON.stringify(data.message);
	        	layer.show(errMsg);
            });
            return true;
  		}    
	}


	//圈子上传图片
   $scope.uploadFiles = function (group_avatar) {
   		 if(group_avatar) {
	        $scope.upload(group_avatar);
	      }
    };
    // 圈子上传图片
    $scope.upload = function (group_avatar) {
    	Upload.upload({
        	headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
       		},
            url: 'http://'+$rootScope.hostName+'/group/uploadImage',
            data: {
            	group_avatar: group_avatar
            }
        }).then(function (response) {
        	var file_path = 'http://'+$rootScope.hostName+'/'+response.data.data;
        	$scope.file = file_path;
            $timeout(function () {
                $scope.result = response.data;
            });
        }, function (response) {
            if (response.status > 0) {
             	var errorMsg = response.status + ': ' + response.data;
        		console.info('errorMsg',errorMsg);
        		layer.show(errorMsg);
            }
        }, function (evt) {
        	var progres = parseInt(100.0 * evt.loaded / evt.total);
        	$scope.progress = progres;
            
        });
    };

})

//创建广播
lvtuanApp.controller("televisecreateCtrl",function($scope,$http,$state,$rootScope,$timeout){
	console.info("创建广播");
	$scope.createSubmit = function(){
		var params = getParams("#myForm");
		console.info(params);
  		if(params.content == ""){
  			layer.show("请输入你的广播!");
  			return false;
  		}else{
  			$http.post('http://'+$rootScope.hostName+'/microblog/create',{
  					'content'	: params.content
	            },
	            {
	            headers: {
	                'Content-Type': 'application/json' , 
	            	'Authorization': 'bearer ' + $rootScope.token,
	            }
	        }).success(function(data) {
	           layer.show("提交成功！");
	           $(':input','#myForm').not('textarea :submit, :reset, :hidden').val('');
	           location.href='#/broadcastview/'+data.data;
	        }).error(function (data, status) {
	        	var errMsg = JSON.stringify(data.error_messages);
	        	layer.show(errMsg);
            });
            return true;
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
					$scope.moredata = false; 
					layer.show("暂无数据！")
				}

			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })

	}
})
//文库-详情
lvtuanApp.controller("knowDocumentsCtrl",function($scope,$http,$rootScope,$interval,$stateParams){
	
	var id = $stateParams.id;
	init()
	//文库 - 详情
	function init(){ 
		var url = 'http://'+$rootScope.hostName+'/knowledge/document/list_documents';
		$http.get(url,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	var itmes = data.data;
	        	for(var i=0;i<itmes.length; i++){
					if(id == itmes[i].id){
						$scope.documen = itmes[i];
						 break;
					}
				}
			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
	}
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
	}
})
/****************************************************** 我的 ******************************************************/
/*———————————————————————————— 用户的个人中心 ————————————————————————————*/
//普通用户-我的
lvtuanApp.controller("centerCtrl",function($scope,$http,$rootScope,$ionicPopup,$timeout){

	//判断是否是律师
	if($rootScope.user_group_id == 1 || $rootScope.user_group_id == 2 && $rootScope.is_verified == 0){
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}else{
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
	}

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
//普通用户和律师的收藏
lvtuanApp.controller("collectCtrl",function($scope,$http,$rootScope){

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
		$http.get('http://'+$rootScope.hostName+'/center/collect?page='+page++,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
				if(data.data){
					$scope.items = data.data; 
					console.info($scope.items );
					return true;
				}else{
					layer.show('暂无数据！');
					$scope.moredata = false;
					return false;
				}
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	};

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
	$http.get('http://'+$rootScope.hostName+'/center/mylawyer/followed',
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	
        	console.info(data.data)
			if(data.data){
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

//普通用户-认证为律师
lvtuanApp.controller("becomelawyerCtrl",function($scope,$http,$rootScope,$ionicActionSheet,$timeout,Upload){
	getProvince();
	getWorkscopes();
	getPractisePeriods();
	//性別的json數組
	$scope.sexs = [
					{
						"key"	:"male",
						"value" : "男"
					},
					{
						"key"	:"female",
						"value" : "女"
					}
				];
	//律师类型的json數組
	$scope.positions = [
					{
						"key"	:"junior_lawyer",
						"value" : "律师"
					},
					{
						"key"	:"senior_lawyer",
						"value" : "高级律师"
					},
					{
						"key"	:"partner",
						"value" : "合伙人"
					}
				];

	//获取所在区域 - 省
	function getProvince(){
		$http.get('http://'+$rootScope.hostName+'/area/province',
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
				$scope.provinces = data.data; 
			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
	}
	//获取所在区域 - 市
	$scope.getCity = function(province){
		$http.get('http://'+$rootScope.hostName+'/area/'+province+'/city',
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
				$scope.citys = data.data; 
			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
	}
	//获取所在区域 - 地區
	$scope.getDistrict = function(city){
		$http.get('http://'+$rootScope.hostName+'/area/'+city+'/district',
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
				$scope.districts = data.data; 
			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
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
				$scope.workscopes_one = data.data; 
				localStorage.setItem("workscopes_one", JSON.stringify($scope.workscopes_one));
			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
	}

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
	$scope.get_work_scope = [];
	//获取法律专长
	$scope.getworkscopes_one = function(workscope){
		$scope.get_work_scope.push(workscope);
		localStorage.setItem("get_work_scope", JSON.stringify($scope.get_work_scope));
		$scope.workscopes_two = JSON.parse(localStorage.getItem('workscopes_one'));
		if(workscope){
			var index;
			angular.forEach($scope.workscopes_two,function(val,key){
				if(val.key == workscope){
					index = key;
				}
			});
			$scope.workscopes_two.remove(index);
			$scope.workscopes_two = $scope.workscopes_two;
			localStorage.setItem("workscopes_two", JSON.stringify($scope.workscopes_two));
		}
	}
	
	//获取法律专长
	$scope.getworkscopes_two = function(workscope){
		$scope.get_work_scope.push(workscope);
		localStorage.setItem("get_work_scope", JSON.stringify($scope.get_work_scope));
		$scope.workscopes_three = JSON.parse(localStorage.getItem('workscopes_two'));
		if(workscope){
			var index;
			angular.forEach($scope.workscopes_three,function(val,key){
				if(val.key == workscope){
					index = key;
				}
			});
			$scope.workscopes_three.remove(index);
			$scope.workscopes_three = $scope.workscopes_three;
		}
	}
	$scope.getworkscopes_three = function(workscope){
		$scope.get_work_scope.push(workscope);
		localStorage.setItem("get_work_scope", JSON.stringify($scope.get_work_scope));
	}

	//律师的从业年限
	function getPractisePeriods(){
		$http.get('http://'+$rootScope.hostName+'/lawyer/practiseperiods',
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
				$scope.periods = data.data; 
			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
	}

	//上传执业证书
   $scope.uploadFiles = function (license_file,index) {
        Upload.upload({
        	headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
       		},
            url: 'http://'+$rootScope.hostName+'/file/upload/user',
            data: {
            	upload_file: license_file,
            	'user_id': $rootScope.user_id
            }
        }).then(function (response) {
        	var file_path = 'http://'+$rootScope.hostName+'/'+response.data.data.file_path;
        	if(index == 1){
        		$scope.file_1 = file_path;
        	}
        	if(index == 2){
        		$scope.file_2 = file_path;
        	}
        	if(index == 3){
        		$scope.file_3 = file_path;
        	}
            $timeout(function () {
                $scope.result = response.data;
            });
        }, function (response) {

            if (response.status > 0) {
             	var errorMsg = response.status + ': ' + response.data;
	             if(index == 1){
	        		console.info('errorMsg_1',errorMsg);
	        		layer.show(errorMsg);
	        	}
	        	if(index == 2){
	        		console.info('errorMsg_2',errorMsg);
	        		layer.show(errorMsg);
	        	}
	        	if(index == 3){
	        		console.info('errorMsg_3',errorMsg);
	        		layer.show(errorMsg);
	        	}
            }

        }, function (evt) {
        	var progres = parseInt(100.0 * evt.loaded / evt.total);
        	if(index == 1){
        		$scope.progress_1 = progres;
        	}
        	if(index == 2){
        		$scope.progress_2 = progres;
        	}
        	if(index == 3){
        		$scope.progress_3 = progres;
        	}
            
        });
    };

    $scope.user = {};
    //提交问题
	$scope.submit = function(){
		$scope.user = layer.getParams('#myForm');

		if($scope.user.license_file.length < 1){
			layer.show("请选择执业证书！");
			return false;
		}
		if($scope.user.avatar.length < 1){
			layer.show("请选择个人头像图片！");
			return false;
		}
		if($scope.user.bg_image.length < 1){
			layer.show("请选择背景图片！");
			return false;
		}

		$scope.get_work_scope = JSON.parse(localStorage.getItem('get_work_scope'));
		if($scope.get_work_scope){
			$scope.user['work_scope'] = $scope.get_work_scope;
		}

		console.info($scope.user);

		$http.post('http://'+$rootScope.hostName+'/center/become_lawyer',$scope.user,
	            {
	            headers: {
	                'Content-Type': 'application/json' , 
	            	'Authorization': 'bearer ' + $rootScope.token,
	            }
	        }).success(function(data) {
	        	console.info(data.data);
	        	
	        	var obj = data.data
	        	//当 is_verified = 1 的时候就显示律师的信息
	        	$scope.user_group_id = obj.user.user_group_id;
	        	$scope.is_verified = obj.user.is_verified;
	        	localStorage.removeItem('user_group_id');
				localStorage.removeItem('is_verified');
				localStorage.setItem("user_group_id", JSON.stringify($scope.user_group_id ));
	        	localStorage.setItem("is_verified", JSON.stringify($scope.is_verified ));

				//清空数据
				$scope.user = {}; 
				$scope.file_1 = {};
				$scope.file_2 = {};
				$scope.file_3 = {};
				$scope.progress_1 = {};
				$scope.progress_2 = {};
				$scope.progress_3 = {};
				localStorage.removeItem('workscopes_one');
				localStorage.removeItem('workscopes_two');
				localStorage.removeItem('get_work_scope');


				layer.show("提交成功！");
				location.href='#/index';
				window.location.reload();

	        }).error(function (data, status) {
	        	console.info(data.error_messages);
	        	console.info(JSON.stringify(data.message));
	        	var errMsg = JSON.stringify(data.error_messages);
	        	layer.show(errMsg);
	        	console.info(errMsg);
	        	layer.show(errMsg);
	        	/*layer.msg(status);*/
	        });
	}


})


/*———————————————————————————— 律师的个人中心 ————————————————————————————*/
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
				$scope.moredata = false;
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
	$http.get('http://'+$rootScope.hostName+'/center/lawyer/score/list_scores?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info(data.data)
			if(data.data){
				if(data.data.scores.length > 9){
					$scope.moredata = true;
				}else{
					$scope.moredata = false;
				}
				$scope.items = data.data; 
			}else{
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}

		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })
	};
})
//律师的评论
lvtuanApp.controller("commentlaywerCtrl",function($scope,$http,$rootScope,$stateParams){
	console.info("律师的评论");

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
	$http.get('http://'+$rootScope.hostName+'/lawyer/'+$stateParams.id+'/evaluations?page='+page++,
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
				$scope.ratingVal = [];
				for(var i=0; i<$scope.items.length; i++){
					$scope.ratingVal.push($scope.items[i].evaluate_score);
				}
				
				return true;
			}else{
				layer.show('暂无数据！');
				$scope.moredata = false;
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })
	};


	$scope.max = 10;
	$scope.readonly = true;
	$scope.onHover = function(val){
		$scope.hoverVal = val;
	};
	$scope.onLeave = function(){
		$scope.hoverVal = null;
	}
	$scope.onChange = function(val){
		$scope.ratingVal = val;
	}

})

lvtuanApp.directive('star', function () {
  return {
    template: '<ul class="rating" ng-mouseleave="leave()">' +
        '<li ng-repeat="star in stars" ng-class="star" ng-click="click($index + 1)" ng-mouseover="over($index + 1)">' +
        '\u2605' +
        '</li>' +
        '</ul>',
    scope: {
      ratingValue: '=',
      max: '=',
      readonly: '@',
      onHover: '=',
      onLeave: '='
    },
    controller: function($scope){
    	
      $scope.ratingValue = $scope.ratingValue || 0;
      $scope.max = $scope.max || 5;
      $scope.click = function(val){
        if ($scope.readonly && $scope.readonly === 'true') {
          return;
        }
        $scope.ratingValue = val;
      };
      $scope.over = function(val){
        $scope.onHover(val);
      };
      $scope.leave = function(){
        $scope.onLeave();
      }
    },
    link: function (scope, elem, attrs) {
      //elem.css("text-align", "center");
      var updateStars = function () {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled: i < scope.ratingValue
          });
        }
      };
      updateStars();
 
      scope.$watch('ratingValue', function (oldVal, newVal) {
        if (newVal) {
          updateStars();
        }
      });
      scope.$watch('max', function (oldVal, newVal) {
        if (newVal) {
          updateStars();
        }
      });
    }
  };
});

//律师的文章 - 案例分析、咨询、知识
lvtuanApp.controller("caselaywerCtrl",function($scope,$http,$rootScope,$stateParams){
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
	$http.get('http://'+$rootScope.hostName+'/center/lawyer/blog/list?class='+$stateParams.id,
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
				$scope.moredata = false;
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })
	};

})

//律师的文章 - 文章详情
lvtuanApp.controller("viewarticlelawyerCtrl",function($scope,$http,$rootScope,$stateParams,$ionicLoading,$timeout,$ionicPopup){
	init();
	function init(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/center/lawer/blog/'+$stateParams.id+'/blogview',
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	console.info(data.data);
				if(data.data){
					 $timeout(function () {
					    $ionicLoading.hide();
					    $scope.items = data.data; 
					  });
					return true;
				}else{
					layer.show('暂无数据！');
					return false;
				}
			}).error(function (data, status) {
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}
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
	$scope.logout = function(){
		localStorage.removeItem('token');
		localStorage.removeItem('user_group_id');
		localStorage.removeItem('is_verified');
		localStorage.removeItem('user_id');
		location.href='#/login';
		window.location.reload();
	}

})


/****************************************************** 找律师 ******************************************************/
//找律师的列表
lvtuanApp.controller("lawyerlistCtrl",function($scope,$state,$http,$rootScope){
	$scope.orders = [
					{
						"key"	:"",
						"value" : "离我最近"
					},
					{
						"key"	:"most_popular",
						"value" : "人气最高"
					}
					,
					{
						"key"	:"best_evaluated",
						"value" : "评价最好"
					}
				];
	getCities();
	getWorkscopes();
	getPractisePeriods();
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
	}
	//律师的从业年限
	function getPractisePeriods(){
		$http.get('http://'+$rootScope.hostName+'/lawyer/practiseperiods',
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	console.info(data.data)
				$scope.periods = data.data; 
			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
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
	  	if(params.order_by){
	  		param.push('order_by=' + params.order_by);
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
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

//律师个人主页-律师评价
lvtuanApp.controller("viewevaluateCtrl",function($scope,$http,$rootScope,$stateParams){
	console.info("律师评价");
	//获取律师的评价列表
	var page = 1; //页数
    $scope.moredata = true; 
    $scope.evaluations = [];	//创建一个数组接收后台的数据
    //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.evaluations = [];
        $scope.loadMore();
    };

    $scope.loadMore = function(){
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	}

	$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMore();
	});
})
//律师个人主页-律师文章
lvtuanApp.controller("viewarticleCtrl",function($scope,$http,$rootScope,$stateParams){
	console.info("律师文章");
	//获取律师文章列表
	var page = 1; //页数
    $scope.moredata = true; 
    $scope.articles = [];	//创建一个数组接收后台的数据
    //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.articles = [];
        $scope.loadMore();
    };

    $scope.loadMore = function(){
		getArticles();
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	}

	$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMore();
	});

})

//律师个人主页-律师广播
lvtuanApp.controller("viewteleviseCtrl",function($scope,$http,$rootScope){
	console.info("律师广播");
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
		$http.get('http://'+$rootScope.hostName+'/microblog/list/mine?page='+page++,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	};

	$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMore();
	});

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
	//上拉加载
    var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.list_questions = [];	//创建一个数组接收后台的数据

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

	    $scope.user = {};
	    //提交问题
		$scope.submit = function(user){
			
			console.info($scope.user);
			$http.post('http://'+$rootScope.hostName+'/question/create',$scope.user,
	            {
	            headers: {
	                'Content-Type': 'application/json' , 
	            	'Authorization': 'bearer ' + $rootScope.token,
	            }
	        }).success(function(data) {
	        	console.info(data.data);
	        	page = 1; //页数
			    $scope.list_questions = [];
			    if(data.data){
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
	           layer.show("提交成功！");
	           $scope.user = {}; //清空数据

	        }).error(function (data, status) {
	        	console.info(data.error_messages);
	        	var errMsg = JSON.stringify(data.error_messages.content[0]);
	        	layer.show(errMsg);
	        });

		}


	//搜索问题
	localStorage.removeItem('q');
	$scope.search = function(){
		var q = $.trim($(".search").val());
		localStorage.setItem("q", JSON.stringify(q));
		$state.go("questionslist",{q:q}, {reload: true}); 
	}

	
	$scope.loadMore = function() {
		getQuestionList();
	};

	//获取咨询列表
	function getQuestionList(){
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
					console.info(data.data);
					$scope.list_questions = $scope.list_questions.concat(data.data); 
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}else{
					$scope.moredata = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					layer.show("暂无数据！");
					return false;
				}
			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
	}
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
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
lvtuanApp.controller("lvtuanallianceCtrl",function($http,$scope,$state,$rootScope){
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
			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
	}
	
})

//律团联盟 - 详情
lvtuanApp.controller("lvtuanallianceviewCtrl",function($http,$scope,$state,$rootScope,$stateParams){
	
	var id = $stateParams.id;
	init()
	//律团联盟 - 详情
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
	        	var itmes = data.data;
	        	for(var i=0;i<itmes.length; i++){
					if(id == itmes[i].id){
						$scope.union = itmes[i];
						 break;
					}
				}
			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
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
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
	}
})


//首页 - 我的律团 - 律师的工作台
/*lvtuanApp.controller("lawyerlvtuanCtrl",function($http,$scope,$state,$rootScope){
	console.info("律师的律团");
})*/
/*———————————————————————————— 我的律团 - 律师的律团 ————————————————————————————*/
//律师的工作 - 律师的订单
lvtuanApp.controller("workbenchLawyerCtrl",function($http,$scope,$state,$rootScope){
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
//律师订单 - 全部
lvtuanApp.controller("orderAllCtrl",function($http,$scope,$state,$rootScope){
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
	$http.get('http://'+$rootScope.hostName+'/center/pay/lawyer/question/all?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("律师订单全部",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })
	};
})
//律师订单 - 待受理
lvtuanApp.controller("orderPendingCtrl",function($http,$scope,$state,$rootScope){
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
	$http.get('http://'+$rootScope.hostName+'/center/pay/lawyer/question/new?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("待受理",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })
	};
})
//律师订单 - 待确认
lvtuanApp.controller("orderRepliedCtrl",function($http,$scope,$state,$rootScope){
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
	$http.get('http://'+$rootScope.hostName+'/center/pay/lawyer/question/replied?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("待确认",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })
	};
})
//律师订单 - 已完成
lvtuanApp.controller("orderCompletedCtrl",function($http,$scope,$state,$rootScope){
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
	$http.get('http://'+$rootScope.hostName+'/center/pay/lawyer/question/complete?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("已完成",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})

//律师的工作 - 全部
lvtuanApp.controller("lawyerquestionNewCtrl",function($http,$scope,$state,$rootScope){
	console.info("全部");
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
	$http.get('http://'+$rootScope.hostName+'/center/lawyer/question/all?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("全部",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})
//律师的工作 - 待受理
lvtuanApp.controller("lawyerquestionSsignedCtrl",function($http,$scope,$state,$rootScope){
	console.info("待受理");
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
	$http.get('http://'+$rootScope.hostName+'/center/lawyer/question/new?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("待受理",data.data);
			if(data.data.length > 0){
				if(data.data.length > 9){
					$scope.moredata = true;
				}else{
					$scope.moredata = false;
				}
				$scope.items = data.data; 
				return true;
			}else{
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})
//律师的工作 - 待确认
lvtuanApp.controller("lawyerquestionRepliedCtrl",function($http,$scope,$state,$rootScope){
	console.info("待确认");
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
	$http.get('http://'+$rootScope.hostName+'/center/lawyer/question/replied?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("待确认",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})
//律师的工作 - 已完成
lvtuanApp.controller("lawyerquestionCompleteCtrl",function($http,$scope,$state,$rootScope){
	console.info("已完成");
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
	$http.get('http://'+$rootScope.hostName+'/center/lawyer/question/complete?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("已完成",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})

/*———————————————————————————— 我的律团 - 用户的律团 ————————————————————————————*/
//首页 - 我的律团 - 用户的工作台
lvtuanApp.controller("userlvtuanCtrl",function($http,$scope,$state,$rootScope){
	console.info("律师的律团");
})

//用户的工作 - 全部
lvtuanApp.controller("questionNewCtrl",function($http,$scope,$state,$rootScope){
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
	$http.get('http://'+$rootScope.hostName+'/center/question/all?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("全部",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};

})
//用户的工作 - 待受理
lvtuanApp.controller("questionSsignedCtrl",function($http,$scope,$state,$rootScope){
	console.info("待受理");
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
	$http.get('http://'+$rootScope.hostName+'/center/question/new?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("待受理",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})
//用户的工作 - 待确认
lvtuanApp.controller("questionRepliedCtrl",function($http,$scope,$state,$rootScope){
	console.info("待确认");
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
	$http.get('http://'+$rootScope.hostName+'/center/question/replied?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("待确认",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})
//用户的工作 - 待评价
lvtuanApp.controller("questionWaitforconfirmationCtrl",function($http,$scope,$state,$rootScope){
	console.info("待评价");
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
	$http.get('http://'+$rootScope.hostName+'/center/question/waitforevaluation?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("待评价",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})

//用户的订单 - 全部
lvtuanApp.controller("userorderAllCtrl",function($http,$scope,$state,$rootScope){
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
	$http.get('http://'+$rootScope.hostName+'/center/pay/question/all?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("用户订单全部",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})
//用户的订单 - 待付款
lvtuanApp.controller("userorderPendingCtrl",function($http,$scope,$state,$rootScope){
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
	$http.get('http://'+$rootScope.hostName+'/center/pay/question/waitpay?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("待付款",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})
//用户的订单 - 待受理
lvtuanApp.controller("userorderRepliedCtrl",function($http,$scope,$state,$rootScope){
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
	$http.get('http://'+$rootScope.hostName+'/center/pay/question/new?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("待受理",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})
//用户的订单 - 待确认
lvtuanApp.controller("userorderCompletedCtrl",function($http,$scope,$state,$rootScope){
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
	$http.get('http://'+$rootScope.hostName+'/center/pay/question/replied?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("待确认",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})
//用户的订单 - 待评价
lvtuanApp.controller("userorderTimeoutCtrl",function($http,$scope,$state,$rootScope,$interval){
	console.info("待评价");
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
	$http.get('http://'+$rootScope.hostName+'/center/pay/question/waitforevaluation?page='+page++,
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("待评价",data.data);
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
				$scope.moredata = false;
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })
	};
})

//用户的订单 - 订单详情
lvtuanApp.controller("userOrderDetailCtrl",function($http,$scope,$state,$rootScope,$stateParams,$interval){
	$http.get('http://'+$rootScope.hostName+'/order/'+$stateParams.id+'/detail',
        {
        cache: true,
        headers: {
            'Content-Type': 'application/json' , 
            'Authorization': 'bearer ' + $rootScope.token
       		}
        }).success(function(data) {
        	console.info("订单详情",data.data);
			if(data.data.length > 0){
				$scope.items = data.data; 
				console.info($scope.items );
				return true;
			}else{
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    })

		//到计8小时
        var stop,expiresHours = 0; 
        $scope.expiresHours = JSON.parse(localStorage.getItem('times'));
        //查看是否刷新了页面
        if($scope.expiresHours == 0){
        	$scope.times = 8 * 60 * 60;
        }else{
        	$scope.times = $scope.expiresHours;
        }
        $scope.starTime = function(){
	        stop = $interval(function() {
	            if ($scope.times > 0) {

	            	var hh = Math.floor($scope.times / 60 / 60);   //时
				    var mm = Math.floor($scope.times / 60 % 60);   //分
				    var ss = Math.floor($scope.times % 60);   //秒
				    hh = checkTime(hh);  
	                mm = checkTime(mm);  
	                ss = checkTime(ss);  
				    $scope.t = hh+":"+mm+":"+ss;
	                $scope.times -= 1;
	                localStorage.setItem('times', $scope.times);
	            } else {
	              $scope.stopTime();
	              localStorage.removeItem('times');
	            }
	          }, 1000);
	    }
	    //如果时分秒小于10给它加0
	    function checkTime(i)    
        {    
           if (i < 10) {    
               i = "0" + i;    
            }    
           return i;    
        }    
        //停止倒计时
	    $scope.stopTime = function() {
          if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
        };
        $scope.starTime(); //调用倒计时开始
        //销毁倒计时
        $scope.$on('$destroy', function() {
          $scope.stopTime();
        });

})

/*———————————————————————————— 首页 - 法律文书 ————————————————————————————*/
//首页 - 法律文书
//法律文书
lvtuanApp.controller("documentlistCtrl",function($http,$scope,$state,$rootScope,$timeout){

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


	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
	$scope.items = [];	//创建一个数组接收后台的数据

	$scope.search = function(){
    	page = 1; //页数
    	$scope.items = [];	//创建一个数组接收后台的数据
    	getParams();
    }

    $scope.searchCatId = function(){
    	page = 1; //页数
    	$scope.items = [];	//创建一个数组接收后台的数据
    	getParams();
    }

    //获取参数，处理被收藏书签的情况
	function getParams(){
		var params = layer.getParams("#search_form");
		console.info(params)
	  	var param = [];
	  	if(params.q){
	  		param.push('q='+params.q);
	  	}
	  	if(params.cat_id){
	  		param.push('cat_id='+params.cat_id);
	  	}
	  	param = param.join('&');
	  	console.info(param)
	  	geturl(param);
	}

    function geturl(param){
    	var url = "";
    	if(param){
    		url +='http://'+$rootScope.hostName+'/knowledge/document/list_documents?'+param+'&page='+page++;
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
					$scope.items = $scope.items.concat(data.data); 

				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}

			}).error(function (data, status) {
				layer.msg(status);
		        console.info(JSON.stringify(data));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });

    }

    //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        getParams();
    };

    //上拉加载 - 文库
	$scope.loadMore = function() {
		getParams();
	};

})
//设置是否显示底部导航
lvtuanApp.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function() {
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = value;
                });
            });

            scope.$on('$ionicView.beforeLeave', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
});
//设置加载动画
lvtuanApp.constant("$ionicLoadingConfig",{
  content: '<ion-spinner icon="android"></ion-spinner>',animation: 'fade-in',showBackdrop: true,maxWidth: 200,showDelay: 0 
})