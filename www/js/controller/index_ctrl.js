var lvtuanApp = angular.module('lvtuanApp.Ctrl', ['ionic','ngSanitize','ngFileUpload','listModule', 'authModule'])
lvtuanApp.constant("HOST", AppSettings.baseApiUrl)
lvtuanApp.controller("MainController",function($rootScope, $scope, $state, userService, authService){
	var self = this;

	self.login = function() {
		userService.login(self.username, self.password)
	}
	self.register = function() {
		// userService.register(self.username, self.password)
		//   .then(handleRequest, handleRequest)
	}
	self.logout = function() {
		authService.logout()
	}
	self.isAuthed = function() {
		return authService.isAuthed ? authService.isAuthed() : false
	}

    $rootScope.$on('unauthorized', function() {
        $state.go('login');
		window.location.reload();
    });

    $scope.currentUser = authService.getUser();
})

/****************************************************** 引导页 ******************************************************/
//tabs选择项
lvtuanApp.controller("HeaderController",function($scope,$location){
      $scope.isActives = function (route) { 
      	return route === $location.path();
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
//hone 
lvtuanApp.controller("ionicNavBarDelegateCtrl",function($state,$timeout,$http,$location){
	//$ionicNavBarDelegate.showBar(false); //是否显示返回按钮
	$timeout(function(){ //2秒钟后跳转到index页面
		location.href='#/index';
	}, 2000, [false]);
})


//首页
lvtuanApp.controller("indexCtrl",function($scope,listHelper){
	listHelper.bootstrap('/lawyer/list_lawyers?is_recommended=1', $scope);
    
	$scope.mylvteam = function(){
		location.href='#/mylvteam';
	}
	
})

//用户登陆
lvtuanApp.controller("loginCtrl",function($state,$scope,$rootScope,$http,userService){
	var format_email = /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2} |net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT|cn|CN)$/;
	var format_mobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/; 
	var format_number=/^[0-9]*$/;

	$scope.submit = function(user){
  		if(checkvaldata(user)){
  			userService.login(user.username, user.password)
  		}
	}

	function checkvaldata(user){
		if(user.username == ""){
  			layer.show("请输入手机号码或者邮箱！");
  			return false;
  		}else{
  			if(!user.username.match(format_mobile)){
  				if(user.username.match(format_email) == null){
					layer.show("请输入正确邮箱账号!");
					return false;
				}
			}else{
				if(user.username.match(format_mobile)==null){
					layer.show("请输入正确的手机号码!");
					return false;
				}
			}
  		}
        return true;   
	}
})

//用户注册
lvtuanApp.controller("registerCtrl",function($scope,$rootScope,$http,userService,authService){
	//获取验证码
	$scope.phonecode = function(phone){
		var param = 'phone='+phone;
		$http.post('http://'+$rootScope.hostName+'/send-code?'+param
		).success(function(data) {
           layer.show("验证码已发送到您的手机！");
        }).error(function (data, status) {
        	if(status == 401){
		        		layer.msg(status);
		        	}
        	var errMsg = JSON.stringify(data.error_messages.password);
        	layer.show(errMsg);
        });
	}

    //提交注册
	$scope.submit = function(user){
		$scope.params = {};
		if(user.username){
			$scope.params["username"] = user.username;
		}
		if(user.phonecode){
			$scope.params["phonecode"] = user.phonecode;
		}
		if(user.password){
			$scope.params["password"] = user.password;
		}

		// userService.register(
		// 	$scope.params.username, 
		// 	$scope.params.password,
		// 	$scope.params.phonecode,
		// 	"phone"
		// )

		$http.post('http://'+$rootScope.hostName+'/register',
		{
			username  		: $scope.params.username,
			password  		: $scope.params.password,
			phonecode 		: $scope.params.phonecode,
			account_type	: "phone"
        }).success(function(data) {
           layer.show("注册成功！");
           $scope.user = {};
           $scope.params = {};
	       var user_data = data ? data.data : null;
	    	if(user_data) {
	    		authService.saveUser(user_data);
	    		console.log('user:', user_data);
	    	}
	    	var token = data ? data.token : null;
	    	if(token) { 
	    		authService.saveToken(token);
	    		console.log('JWT:', token); 
	    	}
           if(user.isCheck == true){
           		location.href='#/becomelawyer';
           }else{
           		location.href='#/center';
           }
        }).error(function (data, status) {
        	if(status == 401) {
        		layer.msg(status);
        	}
        	var errMsg = JSON.stringify(data.error_messages.username);
        	layer.show(errMsg);
        });
     
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
			$http.post('http://'+$rootScope.hostName+'/center/reset_pass', $scope.user
  			).success(function(data) {
	           layer.show("修改成功！");
	           $scope.user = {}; //清空数据
	           location.href='#/login';
		        window.location.reload();
	        }).error(function (data, status) {
	        	if(status == 401){
		        		layer.msg(status);
		        	}
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
lvtuanApp.controller("groupListCtrl",function($scope,listHelper){
	listHelper.bootstrap('/group/list/mine', $scope);
})
//圈子 - 广播
lvtuanApp.controller("groupTeleviseCtrl",function($scope,$http,$rootScope,listHelper) {

	listHelper.bootstrap('/microblog/list/all', $scope);

	//点赞
	$scope.likes = function(id,index){
		$http.post('http://'+$rootScope.hostName+'/like',
		{
			item_type : 'post',
			item_id   : id
		}).success(function(data) {
        	console.info(data);
        	var itmes = data.data;
        	$scope.televise[index].post_extra.likes_count = itmes.likes_count;
           layer.show("点赞成功！");
        }).error(function (data, status) {
        	if(status == 401){
		        		layer.msg(status);
		        	}
        	console.info(data);
        	var errMsg = "";
        	if(JSON.stringify(data.error_messages.item_type)){
        		errMsg = JSON.stringify(data.error_messages.item_type[0]);
        	}else if(JSON.stringify(data.error_messages.item_id)){
				errMsg = JSON.stringify(data.error_messages.item_id[0]);
        	}
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
    	$http.get(url
			).success(function(data) {
				if(data && data.data && data.data.length > 0){
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
				if(status == 401){
		        		layer.msg(status);
		        	}
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
				if(data && data.data){
					//更新当前这条数据
					$scope.recommendeds.splice(index, 1);

					layer.show("已关注 加入成功！");
				}else{
					layer.show("暂无数据！");
					$scope.moredata = false;
					return false;
				}
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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
lvtuanApp.controller("groupviewCtrl",function($scope,$http,$state,$rootScope,$stateParams){
	console.info("圈子详情");
	$scope.user_name = "";
	$scope.user_password = "";
	$("#user_name").val();
	$("#user_password").val();
	$http.get('http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/chat'
    ).success(function(data) {
    	if (data & data.data) {

	    	console.info('圈子详情',data.data)

	    	var itmes = data.data;
	    	$scope.user_name = itmes.user_id;
	    	$scope.user_password = itmes.pwd;
	    	$scope.id = itmes.id;
	    	localStorage.setItem("goup_id", JSON.stringify($scope.id));
	    	localStorage.setItem("easemob_id", JSON.stringify(itmes.easemob_id));
			var time = null;
			time = setInterval(function() { 
				if(getuserpwd(itmes) == true){
	        		clearInterval(time);
	        		login();
	        	}
			}, 2000); 
		}

	}).error(function (data, status) {
		if(status == 401){
		        		layer.msg(status);
		        	}
        console.info(JSON.stringify(data));
    })
	
	function getuserpwd(itmes){
		var name = $("#user_name").val();
    	var pwd = $("#user_password").val();
    	if(name != null && pwd != null){
    		if(name == itmes.user_id && pwd == itmes.pwd){
    			return true;
    		}
    	}else{
    		return false;
    	}
	}

	$scope.site = function(){
		location.href='#/group/site/'+$scope.id;
	    window.location.reload();
	}

})

//圈子设置
lvtuanApp.controller("groupsiteCtrl",function($scope,$http,$state,$rootScope,$stateParams,$timeout,$ionicPopup,Upload){
	console.info("圈子设置");
	$scope.id = JSON.parse(localStorage.getItem('goup_id'));
	$http.get('http://'+$rootScope.hostName+'/group/'+$scope.id+'/detail'
        ).success(function(data) {
        	if (data && data.data) {
	        	console.info('圈子设置',data.data)
				$scope.group =data.data; 
				$scope.group_name = $scope.group.group_name;
				$scope.is_mine = $scope.group.is_mine;
				$scope.file = $scope.group.group_avatar;
			}
		}).error(function (data, status) {
			if(status == 401){
		        		layer.msg(status);
		        	}
	        console.info(JSON.stringify(data));
	    })

		//删除成员
		$scope.del = function(id,index){
			$http.get('http://'+$rootScope.hostName+'/group/'+$scope.id+'/removemember/'+id,
	        {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	       		}
	        }).success(function(data) {
	        	layer.show(data.data);
				//更新当前这条数据
				$scope.group.members.splice(index,1);

			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
				console.info(data);
		        console.info(JSON.stringify(data));
		    })
		}

		//解散该群
		$scope.logoutGroup = function(){
             var confirmPopup = $ionicPopup.confirm({
               title: '确定解散该群？',
               cancelText: '取消', 
               okText: '确认', 
             });
             confirmPopup.then(function(res) {
               if(res) {
                 $http.get('http://'+$rootScope.hostName+'/group/'+$scope.id+'/dissolution',
			        {
			        cache: true,
			        headers: {
			            'Content-Type': 'application/json' , 
			            'Authorization': 'bearer ' + $rootScope.token
			       		}
			        }).success(function(data) {
			        	layer.show(data.data);
			        	location.href='#/group/list';
			    		window.location.reload();
					}).error(function (data, status) {
						if(status == 401){
		        		layer.msg(status);
		        	}
						console.info(data);
				        console.info(JSON.stringify(data));
				    })
               }else{
                 return false;
               }
             });
		}

		//编辑群信息
		$scope.edit = function(id){
			var params =  layer.getParams("#myForm");
			if(params.group_name == ""){
				layer.show("圈子名称不能为空！");
			}else{
				$http.post('http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/edit',{
	  					'group_name'	: params.group_name,
	  					'group_avatar'	: params.group_avatar
			        },
			        {
			        headers: {
			            'Content-Type': 'application/json' , 
			        	'Authorization': 'bearer ' + $rootScope.token,
			        }
			    }).success(function(data) {
			       layer.show("修改成功！");
			    }).error(function (data, status) {
			    	if(status == 401){
		        		layer.msg(status);
		        	}
			    	var errMsg = JSON.stringify(data.error_messages);
			    	layer.show(errMsg);
			    });
			}
		}
		
		//修改圈子头像
	   $scope.uploadFiles = function (group_avatar) {
	   		 if(group_avatar) {
		        $scope.upload(group_avatar);
		      }
	    };
	    // 圈子头像上传图片
	    $scope.upload = function (group_avatar) {
	    	Upload.upload({
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

	    //退出该群
	    $scope.quitGroup = function(){
             var confirmPopup = $ionicPopup.confirm({
               title: '确定退出该群？',
               cancelText: '取消', 
               okText: '确认', 
             });
             confirmPopup.then(function(res) {
               if(res) {
                 $http.get('http://'+$rootScope.hostName+'/group/'+$scope.id+'/quit'
			        ).success(function(data) {
			        	layer.show(data.data);
			        	location.href='#/group/list';
			    		window.location.reload();
					}).error(function (data, status) {
						if(status == 401){
		        		layer.msg(status);
		        	}
						console.info(data);
				        console.info(JSON.stringify(data));
				    })
               }else{
                 return false;
               }
             });
		}
	
})
//添加成员
lvtuanApp.controller("groupaddCtrl",function($scope,$http,$state,$rootScope,$stateParams){

	console.info("添加成员");
	console.info( $stateParams.id);

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

		$http.get('http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/addmember'
	        ).success(function(data) {
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
				if(status == 401){
		        		layer.msg(status);
		        	}
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

	$scope.createSubmit = function(){
		$http.post('http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/addmember',{
  					'members'	: $scope.selIds
		        }).success(function(data) {
		    	location.href='#/group/site/'+$stateParams.id;
	        	window.location.reload();
		       
		    }).error(function (data, status) {
		    	if(status == 401){
		        		layer.msg(status);
		        	}
		    	var errMsg = JSON.stringify(data.error_messages);
		    	layer.show(errMsg);
		    });
	}
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
				if(status == 401){
		        		layer.msg(status);
		        	}
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
            }).success(function(data) {
	           layer.show("创建成功！");
	           $scope.selIds = {};
	           $scope.file = {};
	           $(':input','#questions_form').not('textarea :submit, :reset, :hidden').val('');
	           location.href='#/group/list';
	           window.location.reload();
	        }).error(function (data, status) {
	        	if(status == 401){
		        		layer.msg(status);
		        	}
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
lvtuanApp.controller("televisecreateCtrl",function($scope,$http,$state,$rootScope,$timeout,Upload){
	console.info("创建广播");
	//广播上传图片 最多只能上传9张
	$scope.file = [];
    $scope.srcfile = [];
    $scope.uploadFiles = function(files, errFiles) {
    	console.info(files, errFiles);
    	if(files){
	        if(files.length > 9){
	        	layer.show("最多只能上传9张照片！");
	        	return false;
	        }else{
	        	$scope.files = files;
		        $scope.errFiles = errFiles;
		        angular.forEach(files, function(file) {
		            file.upload = Upload.upload({
		            	headers: {
					            'Content-Type': 'application/json' , 
					            'Authorization': 'bearer ' + $rootScope.token
				       		},
		                url: 'http://'+$rootScope.hostName+'/microblog/uploadImage',
		                data: {microBlogImage: file}
		            });

		            file.upload.then(function (response) {
		            	var src_url = response.data.data.src_url;
		            	var src = response.data.data.src;
		            	if(src){
		            		$scope.file.push(src_url);
		            		$scope.srcfile.push(src);
		            	}

		                $timeout(function () {
		                    file.result = response.data;
		                });
		            }, function (response) {
		                if (response.status > 0)
		                    $scope.errorMsg = response.status + ': ' + response.data;
		                	layer.show($scope.errorMsg);

		            }, function (evt) {
		                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		            });
		        });
		    }
		}
	}

	//删除广播图片
	$scope.del = function(index){
		//广播图片
		$scope.file.splice(index,1);
		$scope.srcfile.splice(index,1);
	}

	//提交广播
	$scope.createSubmit = function(){
		var params = getParams("#myForm");
  		if(params.content == ""){
  			layer.show("请输入你的广播!");
  			return false;
  		}else{
  			$http.post('http://'+$rootScope.hostName+'/microblog/create',{
				'content'	: params.content,
				'file_paths'	: $scope.srcfile
            }).success(function(data) {
	        	console.log(data.data)
	            layer.show("提交成功！");
	            $(':input','#myForm').not('textarea :submit, :reset, :hidden').val('');
	            $scope.file = [];
    			$scope.srcfile = [];
	            location.href='#/broadcast/view/'+data.data.id;

	        }).error(function (data, status) {
	        	if(status == 401){
		        		layer.msg(status);
		        	}
	        	var errMsg = JSON.stringify(data.error_messages);
	        	layer.show(errMsg);
            });
            return true;
  		}
	}

})

//广播详情
lvtuanApp.controller("broadcastviewCtrl",function($scope,$http,$state,$rootScope,$stateParams,$ionicPopup){
    //广播详情
	$http.get('http://'+$rootScope.hostName+'/microblog/'+$stateParams.id+'/view'
	).success(function(data) {
    	console.info('广播详情',data.data)
		$scope.items = data.data; 
	}).error(function (data, status) {
		if(status == 401){
		        		layer.msg(status);
		        	}
        console.info(JSON.stringify(data));
    })


	//点赞
	$scope.likes = function(id){
		$http.post('http://'+$rootScope.hostName+'/like',
		{
			item_type : 'post',
			item_id   : id
		}).success(function(data) {
        	var like = data.data;
        	$scope.items.post_extra.likes_count = like.likes_count;
           layer.show("点赞成功！");
        }).error(function (data, status) {
        	if(status == 401){
		        		layer.msg(status);
		        	}
        	console.info(data);
        	var errMsg = "";
        	if(JSON.stringify(data.error_messages.item_type)){
        		errMsg = JSON.stringify(data.error_messages.item_type[0]);
        	}else if(JSON.stringify(data.error_messages.item_id)){
				errMsg = JSON.stringify(data.error_messages.item_id[0]);
        	}
        	layer.show(errMsg);
        });
	}

	//分享
	$scope.share = function(id){
		$scope.id = id;
		$scope.data = {}
       // 自定义弹窗
       var myPopup = $ionicPopup.show({
       	template: '<textarea ng-model="data.content" name="content" rows="5" placeholder="想说些什么呢？..."></textarea>',
         title: '分享',
         scope: $scope,
         buttons: [
           { text: '取消' },
           {
             text: '<b>确认</b>',
             type: 'button-positive',
             onTap: function(e) {
              /* if (!$scope.data.content) {
                 layer.show("内容不能为空！");
                 e.preventDefault();
               } else {
                 return $scope.data.content;
               }*/
               return $scope.data.content;
             }
           },
         ]
       });
       myPopup.then(function(res) {
         $scope.content = res;
         $http.post('http://'+$rootScope.hostName+'/microblog/forward',
			{
				content 	: $scope.content,
				parent_id   : $scope.id
			}).success(function(data) {
	        	console.info(data);
	        	//var like = data.data;
	        	//$scope.items.post_extra.likes_count = like.likes_count;
	           layer.show("分享成功！");
	        }).error(function (data, status) {
	        	if(status == 401){
		        		layer.msg(status);
		        	}
	        	console.info(data);
	        	var errMsg = "";
	        	if(JSON.stringify(data.error_messages.parent_id)){
	        		errMsg = JSON.stringify(data.error_messages.parent_id[0]);
	        	}
	        	layer.show(errMsg);
	        });

       });
	}

	//评论
	$scope.comments = function(id){
		$scope.id = id;
		$scope.data = {}
       // 自定义弹窗
       var myPopup = $ionicPopup.show({
       	template: '<textarea ng-model="data.comments" name="comments" rows="5" placeholder="想说些什么呢？..."></textarea>',
         title: '评论',
         scope: $scope,
         buttons: [
           { text: '取消' },
           {
             text: '<b>确认</b>',
             type: 'button-positive',
             onTap: function(e) {
              /* if (!$scope.data.content) {
                 layer.show("内容不能为空！");
                 e.preventDefault();
               } else {
                 return $scope.data.content;
               }*/
               return $scope.data.comments;
             }
           },
         ]
       });
       myPopup.then(function(res) {
         $scope.comments = res;
         console.info($scope.comments);
         $http.post('http://'+$rootScope.hostName+'/microblog/'+id+'/comment/create',
			{
				content 	: $scope.comments,
				post_id		: id
			}).success(function(data) {

	        	console.info(data);
	        	//var like = data.data;
	        	//$scope.items.post_extra.likes_count = like.likes_count;
	           layer.show("评论成功！");
	        }).error(function (data, status) {

	        	console.info(data);
	        	if(status == 401){
		        	layer.msg(status);
		        }
	        	var errMsg = "";
	        	if(JSON.stringify(data.error_messages.parent_id)){
	        		errMsg = JSON.stringify(data.error_messages.parent_id[0]);
	        	}
	        	layer.show(errMsg);
	        });

       });
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

    	$http.get(url).success(function(data) {
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
				if(status == 401){
		        		layer.msg(status);
		        	}
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

    	$http.get(url).success(function(data) {
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
				if(status == 401){
		        		layer.msg(status);
		        	}
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
		$http.get('http://'+$rootScope.hostName+'/case/list_case?page='+page++)
		.success(function(data) {
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
			if(status == 401){
		        		layer.msg(status);
		        	}
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
		$http.get(url).success(function(data) {
	        	console.info(data.data)
	        	$scope.items = data.data;

			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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
		$http.get(url).success(function(data) {
	        	var itmes = data.data;
	        	for(var i=0;i<itmes.length; i++){
					if(id == itmes[i].id){
						$scope.documen = itmes[i];
						 break;
					}
				}
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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
		$http.get(url).success(function(data) {
	        	console.info(data.data)
	        	$scope.items = data.data;

			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		    })
	}
})

//文章-详情
lvtuanApp.controller("knowledgeViewCtrl",function($scope,$http,$rootScope,$stateParams,$interval){
	init();
	//获取律师的个人信息
	function init(){ 
		var url = 'http://'+$rootScope.hostName+'/knowledge/'+$stateParams.id+'/view';
		$http.get(url).success(function(data) {
	        	console.info(data.data)
	        	$scope.items = data.data;

			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		    })

	}
})
/****************************************************** 我的 ******************************************************/
/*———————————————————————————— 用户的个人中心 ————————————————————————————*/
//普通用户-我的
lvtuanApp.controller("centerCtrl",function($scope,$http,$rootScope,$ionicPopup,$timeout,authService){

	//判断是否是律师
	if (!authService.isAuthed()) {
		$rootScope.$broadcast('unauthorized');
		return;
	}

	var currentUser = authService.getUser();
	$scope.currentUser = currentUser;
	if(currentUser.user_group_id == 1 || currentUser.user_group_id == 2 && currentUser.is_verified == 0){
		//普通用户个人信息
		$http.get('http://'+$rootScope.hostName+'/center/customer/info')
		.success(function(data) {
				if(data && data.data){
					//用于连接两个或多个数组并返回一个新的数组
					$scope.items = data.data;
				}else{
					layer.show('暂无数据！');
					return false;
				}
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}else{
		//律师个人信息
		$http.get('http://'+$rootScope.hostName+'/center/lawyer/info')
		.success(function(data) {
				if(data && data.data){
					//用于连接两个或多个数组并返回一个新的数组
					$scope.items = data.data; 
				}else{
					layer.show('暂无数据！');
					return false;
				}
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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

//律师-普通用户-个人资料
lvtuanApp.controller("infoCtrl",function($scope,$http,$rootScope,$timeout,Upload,authService){
	console.info("个人资料");
	//判断是否是律师
	if (!authService.isAuthed()) {
		$rootScope.$broadcast('unauthorized');
		return;
	}

	//判断是否是律师
	var currentUser = authService.getUser();
	if(currentUser.user_group_id == 1 || currentUser.user_group_id == 2 && currentUser.is_verified == 0){
		//普通用户个人信息
		$http.get('http://'+$rootScope.hostName+'/center/customer/info')
			.success(function(data) {
				if(data && data.data){
					//用于连接两个或多个数组并返回一个新的数组
					$scope.items = data.data;
					$scope.file = $scope.items.user.avatar
					$scope.user = {
						realname:$scope.items.user.realname,
						phone:$scope.items.user.phone,
						email:$scope.items.user.email
					};

				}else{
					layer.show('暂无数据！');
					return false;
				}
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}else{
		//律师个人信息
		$http.get('http://'+$rootScope.hostName+'/center/lawyer/info')
			.success(function(data) {
				if(data && data.data){
					//用于连接两个或多个数组并返回一个新的数组
					$scope.items = data.data; 
					$scope.file = $scope.items.user.avatar
					$scope.user = {
						realname:$scope.items.user.realname,
						phone:$scope.items.user.phone,
						email:$scope.items.user.email
					};
				}else{
					layer.show('暂无数据！');
					return false;
				}
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		    })
	}

	//我的资料个人头像
   $scope.uploadFiles = function (avatar,id) {
   		 if(avatar) {
	        $scope.upload(avatar,id);
	      }
    };
    // 我的资料个人头像上传图片
    $scope.upload = function (avatar,id) {
    	Upload.upload({
        	headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
       		},
            url: 'http://'+$rootScope.hostName+'/file/upload/user',
            data: {
            	upload_file: avatar,
            	'user_id': id
            }
        }).then(function (response) {
        	var file_path = 'http://'+$rootScope.hostName+'/'+response.data.data.file_path;
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

    $scope.submit = function(){
    	var params = layer.getParams("#myForm");
    	console.info(params);
    	$http.post('http://'+$rootScope.hostName+'/center/customer/info',params)
    		.success(function(data) {
    			if (data && data.data) {
					$scope.items = data.data;
		            layer.show("提交成功！");
	        	}
	        }).error(function (data, status) {
	        	if(status == 401){
		        		layer.msg(status);
		        	}
	        	console.info(data.error_messages);
	        	var errMsg = JSON.stringify(data.error_messages.content[0]);
	        	layer.show(errMsg);
	        });	
    }
})

//普通用户的积分
lvtuanApp.controller("listscoresCtrl",function($scope, listHelper) {
	$scope.rows_per_page = 20;
	listHelper.bootstrap('/center/score/list_scores', $scope);
})

//普通用户和律师的系统消息
lvtuanApp.controller("messagesCtrl",function($scope, listHelper) {
	listHelper.bootstrap('/letter/sys', $scope);
})

lvtuanApp.controller("viewMessageCtrl",function($scope,$http,$rootScope,$interval,$stateParams){
	var id = $stateParams.id;
	//文库 - 详情
		var url = 'http://'+$rootScope.hostName+'/letter/sys-letters/'+id;
		$http.get(url).success(function(data) {
			if (data && data.data) {
        		$scope.item = data.data;
        	}
		}).error(function (data, status) {
			if(status == 401){
		        		layer.msg(status);
		        	}
	        console.info(JSON.stringify(data));
	    })
})

//普通用户和律师的收藏
lvtuanApp.controller("collectCtrl",function($scope, listHelper) {
	listHelper.bootstrap('/center/collect', $scope);
})

//普通用户的评论
lvtuanApp.controller("commentCtrl",function($scope, listHelper) {
	listHelper.bootstrap('/center/blog/reply', $scope);
})

//普通用户-我的关注
lvtuanApp.controller("followedCtrl",function($scope, listHelper) {
	listHelper.bootstrap('/center/mylawyer/followed', $scope);
})

//普通用户-认证为律师
lvtuanApp.controller("becomelawyerCtrl",function($scope,$http,$rootScope,$ionicActionSheet,$timeout,$stateParams,Upload,authService){
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
						"key"	:"lawyer",
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

	if (!authService.isAuthed()) {
		$rootScope.$broadcast('unauthorized');
		return;
	}

	var currentUser = authService.getUser();
	if(currentUser.user_group_id == 2 && currentUser.is_verified == 1 ){
		//律师个人信息
		$http.get('http://'+$rootScope.hostName+'/center/lawyer/info')
			.success(function(data) {
	        	if (data && data.data) {
					$scope.items = data.data; 
					$scope.file_2 = $scope.items.user.avatar;
					$scope.file_3 = $scope.items.user.lawyer.bg_image;
					$scope.province = $scope.items.user.province;
					$scope.city = $scope.items.user.city;
					$scope.district = $scope.items.user.district;

					getProvinceParm($scope.province);
					getCityParm($scope.province,$scope.city);
					getDistrictParm($scope.city,$scope.district);
					$scope.address = $scope.items.user.address,

					$scope.practice_period = $scope.items.user.lawyer.practice_period,
					getPractisePeriodsParm($scope.practice_period);

					$scope.position = $scope.items.user.lawyer.position,
					getpositionsParm($scope.position)

					if($scope.items.user.lawyer.work_scope[0] != undefined){
						
						$scope.workscope_one = $scope.items.user.lawyer.work_scope[0].key
					}
					if($scope.items.user.lawyer.work_scope[1] != undefined){
						$scope.workscope_two = $scope.items.user.lawyer.work_scope[1].key
					}
					if($scope.items.user.lawyer.work_scope[2] != undefined){
						$scope.workscope_three = $scope.items.user.lawyer.work_scope[2].key
					}
					getWorkscopesParm($scope.workscope_one);
					getworkscopes_oneParm($scope.workscope_one,$scope.workscope_two);
					getworkscopes_twoParm($scope.workscope_two,$scope.workscope_three);


					$scope.phonereplyfee = $scope.items.user.lawyer.phone_reply_fee,
					$scope.textreplyfee = $scope.items.user.lawyer.text_reply_fee,
					$scope.introduce = $scope.items.user.lawyer.introduce,
					$scope.experience = $scope.items.user.lawyer.experience,
					$scope.law_cases = $scope.items.user.lawyer.law_cases
				}
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		    })

		}

	//律师类型
	function getpositionsParm(parm){
		for(var i=0;i<$scope.positions.length; i++){
			if(parm == $scope.positions[i].key){
				$scope.position = $scope.positions[i];
				break;
			}
		}
	}
	//获取所在区域 - 省
	function getProvince(){
		getProvinceParm(null);
	}
	function getProvinceParm(parm){
		$http.get('http://'+$rootScope.hostName+'/area/province')
			.success(function(data) {
	        	console.info(data.data)
				$scope.provinces = data.data; 
				//判断如果有参数就代表是编辑
				if(parm){
					for(var i=0;i<$scope.provinces.length; i++){
						if(parm == JSON.stringify($scope.provinces[i].key)){
							$scope.province = $scope.provinces[i];
							 break;
						}
					}
				}	
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		    })

		}


	//获取所在区域 - 市
	$scope.getCity = function(province){
		getCityParm(province,null);
	}
	function getCityParm(province,parm){
		if(province != null || parm != null){
			$http.get('http://'+$rootScope.hostName+'/area/'+province+'/city')
				.success(function(data) {
		        	$scope.citys = data.data; 
		        	if(parm){
		        		for(var i=0;i<$scope.citys.length; i++){
							if(parm == JSON.stringify($scope.citys[i].key)){
								$scope.city = $scope.citys[i];
								break;
							}
						}
		        	}
				}).error(function (data, status) {
					if(status == 401){
		        		layer.msg(status);
		        	}
			        console.info(JSON.stringify(data));
			    })
		}else{
			return false;
		}
	}
	//获取所在区域 - 地區
	$scope.getDistrict = function(city){
		getDistrictParm(city,null);
	}
	function getDistrictParm(city,parm){
		if(city != null || parm != null){
			$http.get('http://'+$rootScope.hostName+'/area/'+city+'/district')
				.success(function(data) {
					$scope.districts = data.data; 
					if(parm){
		        		for(var i=0;i<$scope.districts.length; i++){
							if(parm == JSON.stringify($scope.districts[i].key)){
								$scope.district = $scope.districts[i];
								break;
							}
						}
		        	}
				}).error(function (data, status) {
					if(status == 401){
		        		layer.msg(status);
		        	}
			        console.info(JSON.stringify(data));
			    })
		}else{
			return false;
		}
	}

	//律师的从业年限
	function getPractisePeriods(){
		getPractisePeriodsParm(null);
	}
	function getPractisePeriodsParm(parm){
		$http.get('http://'+$rootScope.hostName+'/lawyer/practiseperiods')
			.success(function(data) {
				$scope.periods = data.data; 
				if(parm){
	        		for(var i=0;i<$scope.periods.length; i++){
						if(parm == $scope.periods[i].key){
							$scope.practice_period = $scope.periods[i];
							break;
						}
					}
	        	}
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		    })
	}


	//律师的从业年限
	function getPractisePeriods(){
		getPractisePeriodsParm(null);
	}
	function getPractisePeriodsParm(parm){
		$http.get('http://'+$rootScope.hostName+'/lawyer/practiseperiods')
			.success(function(data) {
				$scope.periods = data.data; 
				if(parm){
	        		for(var i=0;i<$scope.periods.length; i++){
						if(parm == $scope.periods[i].key){
							$scope.practice_period = $scope.periods[i];
							break;
						}
					}
	        	}
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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

	//获取法律专长
	function getWorkscopes(){
		getWorkscopesParm(null);
	}
	function getWorkscopesParm(parm){
		$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
			.success(function(data) {
				$scope.workscopes_one = data.data; 
				localStorage.setItem("workscopes_one", JSON.stringify($scope.workscopes_one));
				if(parm){
	        		for(var i=0;i<$scope.workscopes_one.length; i++){
						if(parm == $scope.workscopes_one[i].key){
							$scope.workscope_one = $scope.workscopes_one[i];
							break;
						}
					}
	        	}
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		    })
	}


	//获取法律专长
	$scope.getworkscopes_one = function(workscope){
		getworkscopes_oneParm(workscope,null);
	}
	function getworkscopes_oneParm(workscope,parm){
		$scope.workscopes_two = JSON.parse(localStorage.getItem('workscopes_one'));
		if(workscope){
			var index;
			for(var i=0;i<$scope.workscopes_two.length; i++){
				if(workscope.key == $scope.workscopes_two[i].key){
					index = i;
					$scope.workscopes_two.remove(index); //去重复
				}
			}
			$scope.workscopes_two = $scope.workscopes_two;
			localStorage.setItem("workscopes_two", JSON.stringify($scope.workscopes_two));
			if(parm){ //编辑状态
	    		for(var i=0;i<$scope.workscopes_two.length; i++){
					if(parm == $scope.workscopes_two[i].key){
						$scope.workscope_two = $scope.workscopes_two[i];
						break;
					}
				}
    		}
		}
		
	}
	
	//获取法律专长
	$scope.getworkscopes_two = function(workscope){
		getworkscopes_twoParm(workscope,null);
	}
	function getworkscopes_twoParm(workscope,parm){
		$scope.workscopes_three = JSON.parse(localStorage.getItem('workscopes_two'));
		if(workscope){
			var index;
			for(var i=0;i<$scope.workscopes_three.length; i++){
				if(workscope.key == $scope.workscopes_three[i].key){
					index = i;
					$scope.workscopes_three.remove(index); //去重复
				}
			}
			$scope.workscopes_three = $scope.workscopes_three;
			localStorage.setItem("workscopes_three", JSON.stringify($scope.workscopes_three));

			if(parm){ //编辑状态
        		for(var i=0;i<$scope.workscopes_three.length; i++){
					if(parm == $scope.workscopes_three[i].key){
						$scope.workscope_three = $scope.workscopes_three[i];
						break;
					}
				}
        	}
		}
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
        	if(index == 4){
        		$scope.file_4 = file_path;
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
	        	if(index == 4){
	        		console.info('errorMsg_4',errorMsg);
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
        	if(index == 4){
        		$scope.progress_4 = progres;
        	}
            
        });
    };

    //修改
    $scope.sever = function(){
    	$scope.user = layer.getParams('#myForm');
    	$scope.work_scope = [$scope.workscope_one.key,$scope.workscope_two.key,$scope.workscope_three.key];
    	console.info($scope.work_scope);
    	if($scope.work_scope){
			$scope.user['work_scope'] = $scope.work_scope;
		}
		console.info($scope.user);

    	$http.post('http://'+$rootScope.hostName+'/center/lawyer/info',$scope.user)
    		.success(function(data) {
	        	if (data && data.data) {
		        	var obj = data.data
					layer.show("提交成功！");
					location.href='#/index';
					window.location.reload();
				}
	        }).error(function (data, status) {
	        	if(status == 401){
		        		layer.msg(status);
		        	}
	        	console.info(data.error_messages);
	        	console.info(JSON.stringify(data.message));
	        	var errMsg = JSON.stringify(data.error_messages);
	        	layer.show(errMsg);
	        	console.info(errMsg);
	        	layer.show(errMsg);
	        });
    }
    
    //提交问题
	$scope.submit = function(){

		$scope.user = layer.getParams('#myForm');
		$scope.work_scope = [];
		var workscope_one =  angular.element("#workscope_one").val();
		var workscope_two =  angular.element("#workscope_two").val();
		var workscope_three =  angular.element("#workscope_three").val();
		if(workscope_one != ""){
			$scope.work_scope.push(workscope_one);
		}
		if(workscope_two != ""){
			$scope.work_scope.push(workscope_two);
		}
		if(workscope_three != ""){
			$scope.work_scope.push(workscope_three);
		}
    	if($scope.work_scope){
			$scope.user['work_scope'] = $scope.work_scope;
		}

    	console.info($scope.work_scope);
		console.info($scope.user);

		if($scope.user.license_file.length < 1){
			layer.show("请上传执业证书！");
			return false;
		}
		if($scope.user.ID_img.length < 1){
			layer.show("请上传身份证照！");
			return false;
		}
		if($scope.user.avatar.length < 1){
			layer.show("请上传个人头像图片！");
			return false;
		}
		if($scope.user.bg_image.length < 1){
			layer.show("请上传背景图片！");
			return false;
		}


		$http.post('http://'+$rootScope.hostName+'/center/become_lawyer',$scope.user)
			.success(function(data) {
	        	if (data && data.data) {
		        	var obj = data.data
		        	//当 is_verified = 1 的时候就显示律师的信息
		        	currentUser = authService.getUser();
		        	currentUser.user_group_id = obj.user.user_group_id;
		        	currentUser.is_verified = obj.user.is_verified;
		        	authService.setUser(currentUser);
		        	$scope.currentUser = currentUser;

					//清空数据
					$scope.user = {}; 
					$scope.file_1 = {};
					$scope.file_2 = {};
					$scope.file_3 = {};
					$scope.file_4 = {};
					$scope.progress_1 = {};
					$scope.progress_2 = {};
					$scope.progress_3 = {};
					$scope.progress_4 = {};
					localStorage.removeItem('workscopes_one');
					localStorage.removeItem('workscopes_two');
					localStorage.removeItem('get_work_scope');


					layer.show("提交成功！");
					location.href='#/index';
					window.location.reload();
				}
	        }).error(function (data, status) {
	        	if(status == 401){
		        		layer.msg(status);
		        }
	        	console.info(data.error_messages);
	        	console.info(JSON.stringify(data.message));
	        	var errMsg = JSON.stringify(data.error_messages);
	        	layer.show(errMsg);
	        	console.info(errMsg);
	        	layer.show(errMsg);
	        });
	}


})


/*———————————————————————————— 律师的个人中心 ————————————————————————————*/

//我的关注
lvtuanApp.controller("followedlaywerCtrl",function($scope, listHelper) {
	listHelper.bootstrap('/center/lawyer/customer/followed', $scope);
})

//律师的评论
lvtuanApp.controller("commentlaywerCtrl",function($scope,$http,$rootScope,$stateParams,listHelper){
	listHelper.bootstrap('/center/blog/reply', $scope);
})

//律师的文章 - 案例分析、咨询、知识
lvtuanApp.controller("caselaywerCtrl",function($scope, listHelper, $stateParams){
	listHelper.bootstrap('/center/lawyer/blog/list?class='+$stateParams.class, $scope);
})

//律师的文章 - 文章详情
lvtuanApp.controller("viewarticlelawyerCtrl",function($scope,$http,$rootScope,$stateParams,$ionicLoading,$timeout,$ionicPopup){
	init();
	function init(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/lawyer/article/'+$stateParams.id+'/view')
			.success(function(data) {
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
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		        console.info(JSON.stringify(status));
		    })
	}
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
lvtuanApp.controller("siteCtrl",function($scope,$http,$rootScope,authService){
	console.info("设置");
	$scope.logout = function(){
		authService.logout();
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
		$http.get('http://'+$rootScope.hostName+'/lawyer/cities')
			.success(function(data) {
				$scope.cities = data.data; 
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		    })
	}
	//获取法律专长
	function getWorkscopes(){
		$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
			.success(function(data) {
				$scope.workscopes = data.data;
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		    })
	}
	//律师的从业年限
	function getPractisePeriods(){
		$http.get('http://'+$rootScope.hostName+'/lawyer/practiseperiods')
			.success(function(data) {
	        	console.info(data.data)
				$scope.periods = data.data; 
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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
	  		url = 'http://'+$rootScope.hostName+'/lawyer/list_lawyers?'+param+'&page='+page;
	    }else{
	    	url = 'http://'+$rootScope.hostName+'/lawyer/list_lawyers?page='+page;
	    }
	    console.info(url);
		$http.get(url)
			.success(function(data) {
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
				page++;
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		    })
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	}
	
})
//律师个人主页
lvtuanApp.controller("viewCtrl",function($scope,$state,$http,$rootScope,$stateParams,$ionicPopup,$timeout){
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
		$http.get(url)
			.success(function(data) {
	        	console.info(data.data)
	        	$scope.items = data.data;
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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

   $scope.graphic5 = function(id,index){
   	sessionStorage.setItem("lawyerId", id);
   	sessionStorage.setItem("index", index);
	location.href='#/graphic';
   }
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
		var url = 'http://'+$rootScope.hostName+'/lawyer/'+$stateParams.id+'/articles?page='+page;
		$http.get(url)
			.success(function(data) {
				if(data.data.length > 0){
					$scope.moredata = true;
					//用于连接两个或多个数组并返回一个新的数组
					$scope.evaluations = $scope.evaluations.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}
				page++;
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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
		var url = 'http://'+$rootScope.hostName+'/lawyer/'+$stateParams.id+'/articles?page='+page;
		$http.get(url)
			.success(function(data) {
				if(data.data.length > 0){
					$scope.moredata = true;
					//用于连接两个或多个数组并返回一个新的数组
					$scope.articles = $scope.articles.concat(data.data); 
				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}
				page++;
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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
lvtuanApp.controller("viewteleviseCtrl",function($scope,listHelper){
	console.info("律师广播");
	listHelper.bootstrap('/microblog/list/mine', $scope);
})

//找律师-图文咨询
lvtuanApp.controller("graphicCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,listHelper,httpWrapper,Upload){
	//选择类型
	$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
		.success(function(data) {
	      if(data.data){
	        $scope.workscopes = data.data;
	      }else{
	      	layer.show("暂无数据！");
	      }
	    }).error(function (data, status) {
	    	if(status == 401){
		        		layer.msg(status);
		        	}
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    });

	//用来存储上传的值
	$scope.file = [];
    $scope.uploadFiles = function(files, errFiles) {
        if(files && files.length > 2){
	        	layer.show("最多只能上传2个文件或者图片！");
	        	return false;
	        }else{
	        	$scope.files = files;
        		$scope.errFiles = errFiles;
		        angular.forEach(files, function(file) {
		            file.upload = Upload.upload({
		            	headers: {
				            'Content-Type': 'application/json' , 
				            'Authorization': 'bearer ' + $rootScope.token
			       		},
			       		url: 'http://'+$rootScope.hostName+'/question/upfiles',
		                data: {files: file}
		            });

		            file.upload.then(function (response) {
		            	var file_name = 'http://'+$rootScope.hostName+'/'+response.data.data.file_name;
			 			$scope.file.push(file_name);
						$scope.file = $scope.file;
		                $timeout(function () {
		                    file.result = response.data;
		                });
		            }, function (response) {
		            	var status = response.status
		            	if(status == 401){
				        		layer.msg(status);
				        	}
		                if (response.status > 0)
		                    $scope.errorMsg = response.status + ': ' + response.data;
		            }, function (evt) {
		                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		                $scope.progress = file.progress;
		            });
		        });
		}
    }
    $scope.type = $stateParams.id;
    var lawyerId = sessionStorage.getItem("lawyerId");
    var index = sessionStorage.getItem("index");
    //提交问题
	$scope.submit = function(user){
		if($scope.file.length > 0){
			$scope.user['file_paths'] = $scope.file;
		}
		if(index){
			$scope.user['type'] = index;
		}
		if(lawyerId){
			$scope.user['lawyer_id'] = lawyerId;
		}
		httpWrapper.request('http://'+$rootScope.hostName+'/center/pay/question/create','post',user,
			function(data){
				layer.show("提交成功！");
				$scope.user = {};
				$scope.files = {};
        		$scope.errFiles = {};
			},function(data){
				console.info(data);
			}
		);
	}

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
	$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
		.success(function(data) {
	      if(data.data){
	        $scope.workscopes = data.data;
	      }else{
	      	layer.show("暂无数据！");
	      }
	    }).error(function (data, status) {
	    	if(status == 401){
		        		layer.msg(status);
		        	}
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    });

	    $scope.user = {};
	    //提交问题
		$scope.submit = function(user){
			
			console.info($scope.user);
			$http.post('http://'+$rootScope.hostName+'/question/create',$scope.user)
				.success(function(data) {
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
	        	if(status == 401){
		        		layer.msg(status);
		        	}
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
		$http.get('http://'+$rootScope.hostName+'/question/list_questions?page='+page)
			.success(function(data) {
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
				page++;
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		    })
	}
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
			url = 'http://'+$rootScope.hostName+'/question/list_questions?page='+page;

		}else{ 
			url = 'http://'+$rootScope.hostName+'/question/list_questions?q='+q+'&page='+page;
		}
		$http.get(url)
			.success(function(data) {
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
				page++;
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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
lvtuanApp.controller("questionsviewsCtrl",function($http,$scope,$state,$rootScope,$stateParams,$ionicLoading){
	$scope.show = function() {
		$ionicLoading.show({
			template: 'Loading...'
		});
	};
	$scope.hide = function(){
		$ionicLoading.hide();
	};
	init()
	//获取律师的个人信息
	function init(){ 
		var url = 'http://'+$rootScope.hostName+'/question/'+$stateParams.id;
		$scope.show();
		$http.get(url)
			.success(function(data) {
	        	console.info(data.data)
	        	$scope.items = data.data;
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
		        console.info(JSON.stringify(data));
		    }).finally(function(data) {
		    	$scope.hide();
		    });
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
    	$http.get(url)
    		.success(function(data) {
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
				if(status == 401){
		        		layer.msg(status);
		        	}
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
		$http.get(url)
			.success(function(data) {
	        	$scope.unions = data.data;
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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
		$http.get(url)
			.success(function(data) {
	        	var itmes = data.data;
	        	for(var i=0;i<itmes.length; i++){
					if(id == itmes[i].id){
						$scope.union = itmes[i];
						 break;
					}
				}
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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
		$http.get(url)
			.success(function(data) {
	        	$scope.positions = data.data;
	        	console.info($scope.positions)
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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
		$http.get(url)
			.success(function(data) {
	        	$scope.positions = data.data;
	        	console.info($scope.positions)
			}).error(function (data, status) {
				if(status == 401){
		        		layer.msg(status);
		        	}
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
	$http.get('http://'+$rootScope.hostName+'/center/lawyer/info')
		.success(function(data) {
			if(data && data.data){
				$scope.items = data.data; 
			}else{
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			if(status == 401){
		        		layer.msg(status);
		        	}
	        console.info(JSON.stringify(data));
	        console.info(JSON.stringify(status));
	    })

})
//律师订单 - 全部
lvtuanApp.controller("orderAllCtrl",function($scope,listHelper){
	listHelper.bootstrap('/center/pay/lawyer/question/all', $scope);


})
//律师订单 - 待受理
lvtuanApp.controller("orderNewCtrl",function($scope,listHelper){
	listHelper.bootstrap('/center/pay/lawyer/question/new', $scope);
})
//律师订单 - 待确认
lvtuanApp.controller("orderRepliedCtrl",function($scope,listHelper){
	listHelper.bootstrap('/center/pay/lawyer/question/replied', $scope);
})
//律师订单 - 已完成
lvtuanApp.controller("orderCompleteCtrl",function($scope,listHelper){
	listHelper.bootstrap('/center/pay/lawyer/question/complete', $scope);
})

//律师的工作 - 咨询 － 待受理
lvtuanApp.controller("lawyerquestionNewCtrl",function($scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/lawyer/question/new', $scope);
	//抢单
	$scope.to_take = function(id){
		httpWrapper.request('http://'+$rootScope.hostName+'/question/'+id+'/to_take','post',null,
			function(data){
				layer.show("抢单成功！");
				location.href='#/lawyerquestion/replied';
				window.location.reload();
			},function(data){
				console.info(data);
			}
		);
	}
})
//律师的工作 - 咨询 － 待确认
lvtuanApp.controller("lawyerquestionRepliedCtrl",function($scope,listHelper){
	listHelper.bootstrap('/center/lawyer/question/replied', $scope);
})
//律师的工作 - 咨询 － 已完成
lvtuanApp.controller("lawyerquestionCompleteCtrl",function($scope,listHelper){
	listHelper.bootstrap('/center/lawyer/question/complete', $scope);
})

//律师的工作 - 咨询 - 详情
lvtuanApp.controller("lawyerquestionsviewCtrl",function($http,$scope,$stateParams,$rootScope,httpWrapper){

	httpWrapper.get('http://'+$rootScope.hostName+'/center/lawyer/question/'+$stateParams.id+'/view', function(data){
		$scope.items = data.data;
		console.info($scope.items);
	});

	//删除
	/*$scope.remove = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/remove','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("删除成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//取消
	$scope.cancel = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/cancel','post',null,
			function(data){
				$scope.items[index] = data.data.data;
				layer.show("取消成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//确认
	$scope.complete = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/to_complete','post',null,
			function(data){
				layer.show("确认成功！");
				$scope.items.splice(index, 1);
			},function(data){
				console.info(data);
			}
		);
	}
	//联系律师
	$scope.ask = function(id,index){
		location.href='#/center';
	}

	//送心意
	$scope.pay = function(id){
		location.href='#/pay/'+id;
	}

	//评价
	$scope.evaluate = function(id,index){
		$scope.items.splice(index, 1);
		location.href='#/confirmCompletion/'+id;
	}*/
})

/*———————————————————————————— 我的律团 - 用户的律团 ————————————————————————————*/
//首页 - 我的律团 - 用户的工作台
lvtuanApp.controller("userlvtuanCtrl",function($scope,$rootScope){
	console.info("律师的律团");
})

//用户的工作 - 咨询 － 全部
lvtuanApp.controller("questionAllCtrl",function($scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/question/all', $scope);
	//删除
	$scope.remove = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/remove','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("删除成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//取消
	$scope.cancel = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/cancel','post',null,
			function(data){
				$scope.items[index] = data.data.data;
				layer.show("取消成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//确认
	$scope.complete = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/to_complete','post',null,
			function(data){
				layer.show("确认成功！");
				$scope.items.splice(index, 1);
			},function(data){
				console.info(data);
			}
		);
	}
	//联系律师
	$scope.ask = function(id,index){
		location.href='#/center';
	}

	//送心意
	$scope.pay = function(id){
		location.href='#/pay/'+id;
	}

	//评价
	$scope.evaluate = function(id,index){
		$scope.items.splice(index, 1);
		location.href='#/confirmCompletion/'+id;
	}

})

//用户的工作 - 咨询 － 待受理
lvtuanApp.controller("questionNewCtrl",function($scope,listHelper){
	listHelper.bootstrap('/center/question/new', $scope);
})

//用户的工作 - 咨询 － 待确认
lvtuanApp.controller("questionRepliedCtrl",function($scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/question/replied', $scope);
	//确认
	$scope.complete = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/to_complete','post',null,
			function(data){
				layer.show("确认成功！");
				$scope.items.splice(index, 1);
				location.href='#/userquestion/waitforconfirmation';
				window.location.reload();
			},function(data){
				console.info(data);
			}
		);
	}

})

//用户的工作 - 咨询 － 待评价
lvtuanApp.controller("questionWaitforconfirmationCtrl",function($scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/question/waitforevaluation', $scope);
	//评价
	$scope.evaluate = function(id,index){
		$scope.items.splice(index, 1);
		location.href='#/confirmCompletion/'+id;
	}
})

//用户的工作 - 咨询 － 评价
lvtuanApp.controller("confirmCompletionCtrl",['$scope','$http','$rootScope','$stateParams','listHelper','httpWrapper',
	function($scope,$http,$rootScope,$stateParams,listHelper,httpWrapper){
		listHelper.bootstrap('/center/question/waitforevaluation', $scope);

		  $scope.max = 5;
		  $scope.ratingVal = 5;
		  $scope.readonly = false;
		  $scope.onHover = function(val){
		    $scope.hoverVal = val;
		  };
		  $scope.onLeave = function(){
		    $scope.hoverVal = null;
		  }
		  $scope.onChange = function(val){
		    $scope.ratingVal = val;
		    console.info(val);
		  }

		  //anglarjs 想要input双向绑定，必须先把值初始化一次; 页面input不能清空就是这个问题
		  $scope.user = {
		  	evaluate_comment : ""
		  }

		  //提交
		  $scope.submit = function(){
		  	var data = {};
		  	if($scope.ratingVal){
		  		data["evaluate_score"] = $scope.ratingVal;
		  	}
		  	if($scope.user.evaluate_comment){
		  		data["evaluate_comment"] = $scope.user.evaluate_comment;
		  	}
		  	data = data;
		  	httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+$stateParams.id+'/to_evaluate','post',data,
			function(data){
				layer.show("评价成功！");
				$scope.user = {};
				location.href='#/userquestion/waitforconfirmation';
			},function(data){
				console.info(data);
			})
		  }

		  //取消
		  $scope.cancel = function(){
		 	$scope.ratingVal = 5;
		  	$scope.user = {
			  	evaluate_comment : ""
			}
			window.location.reload();
		  }
}])

//用户 - 我的咨询 - 详情
lvtuanApp.controller("userquestionviewCtrl",function($http,$scope,$stateParams,$rootScope,httpWrapper){
	httpWrapper.get('http://'+$rootScope.hostName+'/center/question/'+$stateParams.id+'/view', function(data){
		$scope.items = data.data;
	});

	//删除
	$scope.remove = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/remove','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("删除成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//取消
	$scope.cancel = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/cancel','post',null,
			function(data){
				$scope.items[index] = data.data.data;
				layer.show("取消成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//确认
	$scope.complete = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/to_complete','post',null,
			function(data){
				layer.show("确认成功！");
				$scope.items.splice(index, 1);
			},function(data){
				console.info(data);
			}
		);
	}
	//联系律师
	$scope.ask = function(id,index){
		location.href='#/center';
	}

	//送心意
	$scope.pay = function(id){
		location.href='#/pay/'+id;
	}

	//评价
	$scope.evaluate = function(id,index){
		$scope.items.splice(index, 1);
		location.href='#/confirmCompletion/'+id;
	}
})

//用户的订单 - 全部
lvtuanApp.controller("userorderAllCtrl",function($http,$scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/pay/question/all', $scope);

	//删除
	$scope.remove = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/remove','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("删除成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//取消
	$scope.cancel = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/cancel','post',null,
			function(data){
				$scope.items[index] = data.data.data;
				layer.show("取消成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//确认
	$scope.complete = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/to_complete','post',null,
			function(data){
				layer.show("确认成功！");
				$scope.items.splice(index, 1);
			},function(data){
				console.info(data);
			}
		);
	}
	//联系律师
	$scope.ask = function(id,index){
		location.href='#/center';
	}

	//送心意
	$scope.pay = function(id){
		location.href='#/pay/'+id;
	}

	//评价
	$scope.evaluate = function(id,index){
		$scope.items.splice(index, 1);
		location.href='#/confirmCompletion/'+id;
	}

})

//用户的订单 - 待付款
lvtuanApp.controller("userorderPendingCtrl",function($scope,listHelper){
	listHelper.bootstrap('/center/pay/question/waitpay', $scope);
})
//用户的订单 - 待受理
lvtuanApp.controller("userorderNewCtrl",function($scope,listHelper){
	listHelper.bootstrap('/center/pay/question/new', $scope);
})
//用户的订单 - 待确认
lvtuanApp.controller("userorderRepliedCtrl",function($scope,listHelper){
	listHelper.bootstrap('/center/pay/question/replied', $scope);
})
//用户的订单 - 待评价
lvtuanApp.controller("userorderWaitforevaluationCtrl",function($scope,listHelper){
	listHelper.bootstrap('/center/pay/question/waitforevaluation', $scope);
})


//用户的订单 - 订单详情
lvtuanApp.controller("userOrderDetailCtrl",function($http,$scope,$state,$rootScope,$stateParams,$interval){
	$http.get('http://'+$rootScope.hostName+'/center/pay/question/'+$stateParams.id+'/view')
		.success(function(data) {
			if(data && data.data){
				$scope.item = data.data; 
				return true;
			}else{
				layer.show('暂无数据！');
				return false;
			}
		}).error(function (data, status) {
			if(status == 401){
		        		layer.msg(status);
		        	}
	        console.info(JSON.stringify(data));
	    })
})

/*———————————————————————————— 首页 - 法律文书 ————————————————————————————*/
//首页 - 法律文书
//法律文书
lvtuanApp.controller("documentlistCtrl",function($http,$scope,$state,$rootScope,$timeout){

	//选择类型
$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
	.success(function(data) {
      if(data.data){
        $scope.workscopes = data.data;
      }else{
      	layer.show("暂无数据！");
      }
    }).error(function (data, status) {
    	if(status == 401){
		        		layer.msg(status);
		        	}
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

    	$http.get(url)
    		.success(function(data) {
	        	console.info('法律文书',data.data)
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
				if(status == 401){
		        		layer.msg(status);
		        	}
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

//法律文书 - 详情 - 下载
lvtuanApp.controller("documentownloadlistCtrl",function($http,$scope,$state,$rootScope,$stateParams){
	$http.get('http://'+$rootScope.hostName+'/knowledge/document/'+$stateParams.id+'/view')
	.success(function(data) {
    	console.info('法律文书详情',data.data)
    	$scope.itmes = data.data;
	}).error(function (data, status) {
		if(status == 401){
		        		layer.msg(status);
		        	}
        console.info(JSON.stringify(data));
    })
})

//小微企服
lvtuanApp.controller("corporateservicesCtrl",function($http,$scope,$state,$rootScope,$stateParams){
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
	$http.get('http://'+$rootScope.hostName+'/company/product/list?page='+page++)
		.success(function(data) {
        	console.info("待确认",data.data);
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
			if(status == 401){
		        		layer.msg(status);
		        	}
	        console.info(JSON.stringify(data));
	    })
	};

})

//小微企服
lvtuanApp.controller("corporatelistCtrl",function($scope,$state,$http,$rootScope,$stateParams,$ionicPopup, $timeout){
	//创建tabs列表
	$scope.tabs = [{
            title: '产品详情',
            url: 'list-detail.tpl.html'
        }, {
            title: '评价',
            url: 'list-evaluate.tpl.html'
    }];
    $scope.currentTab = 'list-detail.tpl.html'; //默认第一次显示的tpl

    $scope.onClickTab = function (tab) { //点击tab赋值url
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {  //给选中的url的a 标签样式
        return tabUrl == $scope.currentTab;
    }

    //详情
    $http.get('http://'+$rootScope.hostName+'/company/product/'+$stateParams.id+'/view')
    	.success(function(data) {
        	console.info("详情",data.data);				
        	$scope.items = data.data; 
		}).error(function (data, status) {
	        console.info(JSON.stringify(data));
	    })

})

//评价
lvtuanApp.controller("corporatelistevaluateCtrl",function($scope,$http,$rootScope,$stateParams){
	console.info("id",$stateParams.id);
	
	 $http.get('http://'+$rootScope.hostName+'/company/product/'+$stateParams.id+'/comments')
	 	.success(function(data) {
        	console.info("评价详情",data.data);				
        	$scope.items = data.data; 
        	$scope.ratingVal = [];
			for(var i=0; i<$scope.items.length; i++){
				$scope.ratingVal.push($scope.items[i].score);
			}
		}).error(function (data, status) {
			if(status == 401){
        		layer.msg(status);
        	}
	        console.info(JSON.stringify(data));
	    })
	    $scope.max = 5;
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

//立即购买
lvtuanApp.controller("corporatebuynowCtrl",function($scope,$http,$rootScope,$stateParams){
	$http.get('http://'+$rootScope.hostName+'/company/product/'+$stateParams.id+'/view')
		.success(function(data) {
        	console.info("详情",data.data);				
        	$scope.items = data.data; 
		}).error(function (data, status) {
			if(status == 401){
        		layer.msg(status);
        	}
	        console.info(JSON.stringify(data));
	    })

	getProvince();
	//获取所在区域 - 省
	function getProvince(){
		$http.get('http://'+$rootScope.hostName+'/area/province')
		.success(function(data) {
        	console.info(data.data)
			$scope.provinces = data.data; 	
		}).error(function (data, status) {
			if(status == 401){
        		layer.msg(status);
        	}
	        console.info(JSON.stringify(data));
	    })
	}

	//获取所在区域 - 市
	$scope.getCity = function(province){
		$http.get('http://'+$rootScope.hostName+'/area/'+province+'/city')
		.success(function(data) {
        	$scope.citys = data.data; 
		}).error(function (data, status) {
			if(status == 401){
		        		layer.msg(status);
		        	}
	        console.info(JSON.stringify(data));
	    })
	}

	//获取所在区域 - 地區
	$scope.getDistrict = function(city){
		$http.get('http://'+$rootScope.hostName+'/area/'+city+'/district')
		.success(function(data) {
			$scope.districts = data.data; 
		}).error(function (data, status) {
			if(status == 401){
		        		layer.msg(status);
		        	}
	        console.info(JSON.stringify(data));
	    })
	}


	$scope.submit = function(user){
		$scope.items = {};
		if(user.contact_phone){
			$scope.items['contact_phone'] = user.contact_phone;
		}
		if(user.email){
			$scope.items['email'] = user.email;
		}
		if(user.company_name){
			$scope.items['company_name'] = user.company_name;
		}
		if(user.contact){
			$scope.items['contact'] = user.contact;
		}
		if(user.memo){
			$scope.items['memo'] = user.memo;
		}
		if(user.province.key){
			$scope.items['province'] = user.province.key;
		}
		if(user.city.key){
			$scope.items['city'] = user.city.key;
		}
		if(user.district.key){
			$scope.items['district'] = user.district.key;
		}
		if(user.invoice == true){
			$scope.items['invoice'] = 'Y';
		}else{
			$scope.items['invoice'] = 'N';
		}
		if($stateParams.id){
			$scope.items['product_id'] = $stateParams.id;
		}
		console.info($scope.items);
		$http.post('http://'+$rootScope.hostName+'/company/order/submit',$scope.items)
			.success(function(data) {
	        	console.log(data.data)
	            layer.show("提交成功！");
	            $scope.user = {};
	            $scope.items = {};
	            location.href='#/corporate';

	        }).error(function (data, status) {
	        	var errMsg = JSON.stringify(data.message);
	        	console.info(errMsg);
	        	layer.show(errMsg);
            });
		
	}
})


//用户律师 - 钱包
lvtuanApp.controller("userwalletCtrl",function($scope,$http,$rootScope,authService){

	if (!authService.isAuthed()) {
		$rootScope.$broadcast('unauthorized');
		return;
	}

	//判断是否是律师
	var currentUser = authService.getUser();
	if(currentUser.user_group_id == 1 || currentUser.user_group_id == 2 && currentUser.is_verified == 0){
		$http.get('http://'+$rootScope.hostName+'/center/customer/wallet')
			.success(function(data) {
				if (data && data.data) {
					$scope.items = data.data; 
					localStorage.setItem("summoney", $scope.items.money);
				}
			}).error(function (data, status) {
				if(status == 401){
	        		layer.msg(status);
	        	}
		        console.info(JSON.stringify(data));
		    })
	}else{
		$http.get('http://'+$rootScope.hostName+'/center/lawyer/wallet')
			.success(function(data) {
				if (data && data.data) {
					$scope.items = data.data; 
					localStorage.setItem("money", $scope.items.money);
				}
			}).error(function (data, status) {
				if(status == 401){
	        		layer.msg(status);
	        	}
		        console.info(JSON.stringify(data));
		    })
	}
})
//用户律师 - 钱包充值
lvtuanApp.controller("usermoneyinCtrl",function($scope,$http,$rootScope,$stateParams){
	$scope.summoney = localStorage.getItem('summoney');
	$scope.submit = function(user){
		$http.post('http://'+$rootScope.hostName+'/wallet/recharge',{
				money 	: user.money
			}).success(function(data) {
	        	localStorage.removeItem('summoney');
	        	$scope.money = data.data.money;
	        	$scope.summoney = $scope.money;
	        	localStorage.setItem("summoney", $scope.summoney);
	            layer.show("提交成功！");
	            $scope.user = {};
	            angular.element("#money").val("");
	            console.info($scope.user);

	        }).error(function (data, status) {
	        	if(status == 401){
	        		layer.msg(status);
	        	}
	        	var errMsg = JSON.stringify(data.message);
	        	console.info(errMsg);
	        	layer.show(errMsg);
	        });
	}
})

//用户律师 - 充值记录
lvtuanApp.controller("userrecordCtrl",function($scope,$http,$rootScope,listHelper){
	//判断是否是律师
	listHelper.bootstrap('/wallet/record?type=recharge', $scope);
})

//用户律师 - 提现
lvtuanApp.controller("usermoneyoutCtrl",function($scope,$http,$rootScope){
	//判断是否是律师
	//listHelper.bootstrap('/wallet/record?type=recharge', $scope);
	$scope.summoney = localStorage.getItem('summoney');
	$scope.submit = function(user){
		$http.post('http://'+$rootScope.hostName+'/wallet/withdraw',user)
			.success(function(data) {
	        	$scope.items = data.data;
	        	console.info($scope.items);
	        	localStorage.setItem("summoney", $scope.items.money);
	        	$scope.summoney = $scope.items.money;
	            layer.show("提交成功！");
	            $scope.user = {};
	            console.info($scope.user)

	        }).error(function (data, status) {
	        	if(status == 401){
	        		layer.msg(status);
	        	}
	        	var errMsg = JSON.stringify(data.message);
	        	console.info(errMsg);
	        	layer.show(errMsg);
	        });
	} 
	
})
//用户律师 - 提现记录
lvtuanApp.controller("userwithdrawCtrl",function($scope,$http,$rootScope,listHelper){
	//判断是否是律师
	listHelper.bootstrap('/wallet/record?type=withdraw', $scope);
})

//用户律师 - 提现记录
lvtuanApp.controller("userpayallCtrl",function($scope,$http,$rootScope,listHelper){
	//判断是否是律师
	$scope.rows_per_page = 15;
	listHelper.bootstrap('/wallet/record', $scope);
})

//用户律师 - 微信支付
lvtuanApp.controller("payCtrl",function($scope,$http,$rootScope,$stateParams,$ionicPopup,listHelper){
	console.info($stateParams.id);
	debugger
	//微信支付
	$scope.pay = function(){
         var confirmPopup = $ionicPopup.confirm({
           title: '是否立即付款？',
           cancelText: '取消', 
           okText: '确认', 
         });
         confirmPopup.then(function(res) {
           if(res) {
            //listHelper.bootstrap('/center/question/'+$stateParams.id+'/wallet/pay', $scope);
	            $http.post('http://'+$rootScope.hostName+'/center/question/'+$stateParams.id+'/wallet/pay',
		            {
		            headers: {
		                'Content-Type': 'application/json' , 
		            	'Authorization': 'bearer ' + $rootScope.token,
		            }
		        }).success(function(data) {
		        	$scope.items = data.data;
		        	console.info($scope.items);
		        	debugger
		            layer.show("付款成功！");

		        }).error(function (data, status) {
		        	console.info(data);
		        	debugger
		        	/*if(status == 401){
		        		layer.msg(status);
		        	}*/
		        	var errMsg = JSON.stringify(data.message);
		        	console.info(errMsg);
		        	layer.show(errMsg);
		        });
           }else{
             return false;
           }
         });
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
      elem.css("text-align", "center");
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