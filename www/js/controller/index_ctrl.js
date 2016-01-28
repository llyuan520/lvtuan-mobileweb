var lvtuanApp = angular.module('lvtuanApp.Ctrl', ['ionic','ngSanitize','ngFileUpload','listModule','authModule','wxModule','locationModule','ngStorage'])
lvtuanApp.constant("HOST", AppSettings.baseApiUrl)

lvtuanApp.controller("MainController",function($rootScope, $scope, $state, $location,$ionicHistory, $http, userService, authService, locationService){
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

	$scope.$on('$ionicView.beforeEnter', function() {
	    $scope.currentUser = authService.getUser();

	    currentLocation = locationService.getLocation();
	    if (!currentLocation || !currentLocation.city_name) {
	    	locationService.fetchLocation($scope);
	    } else {
	        $scope.currentLocation = currentLocation;
	    }
	})

    //返回跳转页面
	$scope.jump = function(url,id){
		if(id){
			location.href=url+$scope.id;
		}
		location.href=url;
		window.location.reload();
	}

	$scope.jumpGo = function(url){
		location.href=url;
	}

	//返回跳转上一次操作的页面
	$scope.jumpGoBack = function(){
		//$ionicHistory.goBack();
		window.history.back();
	}

	var $body = $('body');    
	document.title = '律团';    
	// hack在微信等webview中无法修改document.title的情况    
	var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {      
		setTimeout(function() {        
			$iframe.off('load').remove();      
		}, 0);    
	}).appendTo($body);
})

/****************************************************** 引导页 ******************************************************/

//设置是否显示底部导航 ng-class="{'tabs-item-hide': $root.hideTabs}"
lvtuanApp.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function() {
                scope.$watch(attributes.hideTabs, function(value){
                    if($rootScope.hideTabs == undefined || value == undefined){
                        $rootScope.hideTabs = true;
                    }else{
                        $rootScope.hideTabs = value;
                    }
                    
                });

            });
            scope.$on('$ionicView.beforeLeave', function() {
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = false;
                });
            });
        }
    };
})


//显示星星
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
      //elem.css("text-align", "left");
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
//设置加载动画
lvtuanApp.constant("$ionicLoadingConfig",{
  content: '<ion-spinner icon="ios"></ion-spinner>',animation: 'fade-in',showBackdrop: true,maxWidth: 200,showDelay: 0 
})
//hone 
lvtuanApp.controller("ionicNavBarDelegateCtrl",function($state,$timeout,$http,$location){
	//$ionicNavBarDelegate.showBar(false); //是否显示返回按钮
	$timeout(function(){ //2秒钟后跳转到index页面
		location.href='#/index';
	}, 3000);
})


//首页
lvtuanApp.controller("indexCtrl",function($scope,listHelper,locationService){
	if (locationService.getLocation()) {
		$scope.locations = locationService.getLocation();
		$scope.city = $scope.locations.city_id;
		listHelper.bootstrap('/lawyer/list_lawyers?is_recommended=1&city_id='+$scope.city, $scope);
	} else {
		listHelper.bootstrap('/lawyer/list_lawyers?is_recommended=1', $scope);
	}
    
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
	        });
		}

	}
})

//忘记密码
lvtuanApp.controller("forgotpwdCtrl",function($scope,$http,$rootScope){
	$scope.user = {};
	//获取验证码
	$scope.phonecode = function(phone){
		console.info(phone);
		if(phone == undefined){
			layer.show("请输入手机号！");
			return false;
		}else{
			var param = 'phone='+phone;
			$http.post('http://'+$rootScope.hostName+'/send-code?'+param
			).success(function(data) {
				console.info(data)
	           layer.show("验证码已发送到您的手机！");
	        });
	        return true;
		}
	}
	//用户可以通过手机或者邮箱找回密码
	$scope.submit = function(user){
		console.info(user);
		$scope.user = user;
		$http.post('http://'+$rootScope.hostName+'/forgotpwd', $scope.user
			).success(function(data) {
           $scope.user = {}; //清空数据
           $scope.uid = data.data.uid;
           sessionStorage.setItem("uid", JSON.stringify($scope.uid));
           $("#forgotForm").hide();
           $("#upwdForm").show();
        });
	}
})

//找回密码
lvtuanApp.controller("upwdCtrl",function($scope,$http,$rootScope){

	$scope.user = {};
	$scope.submit = function(user){
		$scope.uid = JSON.parse(sessionStorage.getItem('uid'));
		$scope.user = user;
		if($scope.user.password_1.length != $scope.user.password_2.length){
			layer.show("重置密码的长度不一致！");
			return false;
		}else if($scope.user.password_1 != $scope.user.password_2){
			layer.show("两次输入的密码不一致！");
			return false;
		}else{
			$http.post('http://'+$rootScope.hostName+'/forgotpwd/resetpwd/'+$scope.uid, $scope.user
  			).success(function(data) {
	           layer.show("修改成功！");
	           sessionStorage.removeItem("uid");
	           $scope.user = {}; //清空数据
	           location.href='#/login';
	        });
		}

	}
})

/****************************************************** 微信 ******************************************************/
lvtuanApp.controller("wxAuthCtrl",function($scope,$stateParams,wxService,userService){
	// 获取code和state，通过后端进行登录
	userService.loginWithWx($stateParams.code,$stateParams.state);
})

//自动跳转到微信授权登录页面
lvtuanApp.controller("wxLoginCtrl",function($scope,$http,$rootScope,wxService){
	window.location.replace(wxService.getWxAuthUrl('/wxauth'));
})

/****************************************************** 圈子 ******************************************************/
//圈子
lvtuanApp.controller("groupCtrl",function($scope,$http,$state,$rootScope){
	//跳转到登陆页面
	$scope.jumplogin = function(){
		console.info($rootScope.is_lawyer);
    	location.href='#/login';
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
        });
	}

})

//圈子 - 推荐关注
lvtuanApp.controller("groupAttentionCtrl",function($scope,$http,$state,$rootScope,$ionicLoading){
	var page = 1; //页数
	var rows_per_page = 5; // 每页的数量
	if ($scope.rows_per_page) {
		rows_per_page = $scope.rows_per_page;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

    //搜索问题
	$scope.q = '';
	$scope.$watch('q', function(newVal, oldVal) {
		if(newVal !== oldVal){
			page = 1;
			$scope.items = [];
			getParams();
    	}
	});

	//下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        $scope.loadMore();
        $scope.$broadcast('scroll.refreshComplete');
    };

    //上拉加载
	$scope.loadMore = function() {
		//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
		getParams();
	};

    function getParams(){
    	var param = layer.getParams("#search_form");
    	geturl(param)
    }

    function geturl(param){
		var url;
		if(param.q){
	  		url = 'http://'+$rootScope.hostName+'/group/recommend?q='+param.q+'&rows_per_page='+rows_per_page+'&page='+page;
	    }else{
	    	url = 'http://'+$rootScope.hostName+'/group/recommend?rows_per_page='+rows_per_page+'&page='+page;
	    }
	    $ionicLoading.show();
		$http.get(url)
			.success(function(data) {
	        	console.info(data.data)
	        	if(data && data.data && data.data.length){
					$scope.items = $scope.items.concat(data.data);
					console.info($scope.items);
					if (data.data.length < rows_per_page) {
						$scope.moredata = false;
					} else {
						$scope.moredata = true;
					}
				}else{
					if (page == 1) {
						layer.show('暂无数据！');
					}
					$scope.moredata = false;
				}
				page++;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			})
	}

	$scope.groupjoin = function(id,index){
		page = 1;
		var id = id;
		$http.post('http://'+$rootScope.hostName+'/group/'+id+'/join?rows_per_page='+rows_per_page+'&page='+page++,
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
					$scope.items.splice(index, 1);

					layer.show("已关注 加入成功！");
				}else{
					layer.show("暂无数据！");
					$scope.moredata = false;
					return false;
				}
			})
		    .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
	}
})

//圈子详情
lvtuanApp.controller("groupviewinitCtrl",function($scope,$http,$state,$rootScope,$stateParams,$ionicLoading){
	$ionicLoading.show();
    localStorage.removeItem("easemobParam");
    $scope.$on('$ionicView.beforeEnter', function() {  
        console.info("圈子详情");
        $http.get('http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/chat'
        ).success(function(data) {
            if (data && data.data) {
                console.info('圈子详情',data.data);
                var itmes = data.data;
                $scope.easemobParam = {
                	'user_name' : itmes.user_id,
                	'user_password' : itmes.pwd,
                	'id' : itmes.id,
                	'easemob_id' : itmes.easemob_id,
                	'group_id' : JSON.stringify(itmes.id),
                };

                localStorage.setItem("easemobParam", JSON.stringify($scope.easemobParam));
				$state.go("groupview",{id: $stateParams.id});
            }
            $ionicLoading.hide();
        })

    });
})

//圈子详情
lvtuanApp.controller("groupviewCtrl",function($scope,$http,$state,$rootScope,$stateParams,$ionicLoading){
	$ionicLoading.show();
    $scope.$on('$ionicView.beforeEnter', function() {  
        console.info("圈子详情");
        var easemobParam = JSON.parse(localStorage.getItem('easemobParam'));
        $("#user_name").val();
        $("#user_password").val();
        if (easemobParam != null) {
	        $scope.user_name = easemobParam.user_name;
	        $scope.user_password = easemobParam.user_password;
            $scope.id = easemobParam.id;
            $scope.easemob_id = easemobParam.easemob_id;
        }

        var time = null;
        time = setInterval(function() { 
            if(getuserpwd(easemobParam) == true){
                clearInterval(time);
                login();
            }
        }, 3000); 
        $ionicLoading.hide();
    
        function getuserpwd(easemobParam){
            var name = $("#user_name").val();
            var pwd = $("#user_password").val();
            if(name != null && pwd != null){
                if(name == easemobParam.user_name && pwd == easemobParam.user_password){
                    return true;
                }
            }else{
                return false;
            }
        }

    });
	
	$scope.site = function(id){
		location.href='#/group/site/'+id;
	}
})

//圈子设置
lvtuanApp.controller("groupsiteCtrl",function($scope,$http,$state,$rootScope,$stateParams,$timeout,$ionicPopup,Upload){
	console.info("圈子设置");
	$http.get('http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/detail?ts=dkfdkj'
        ).success(function(data) {
        	if (data && data.data) {
				$scope.group =data.data; 
				$scope.group_name = $scope.group.group_name;
				$scope.is_mine = $scope.group.is_mine;
				$scope.file = $scope.group.group_avatar;
			}
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
	        	$scope.file = response.data.data.file_url;
	        	$scope.file_path = response.data.data.file_path;
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
        	$scope.file = response.data.data.file_url;
        	$scope.group_path = response.data.data.file_path;
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
	       	if(res != undefined){
		         $scope.comments = res;
		         $http.post('http://'+$rootScope.hostName+'/microblog/'+id+'/comment/create',
					{
						content 	: $scope.comments,
						post_id		: id
					}).success(function(data) {

			        	console.info(data);
			        	//var like = data.data;
			        	//$scope.items.post_extra.likes_count = like.likes_count;
			           layer.show("评论成功！");
			        });
			}else{
	      		 myPopup.close(); // 关闭弹窗
	      	}        

       });
	}

})

/****************************************************** 知识 ******************************************************/
//知识 - 看新闻
lvtuanApp.controller("knowledgesCtrl",function($scope,$http,$rootScope,listHelper){
	listHelper.bootstrap('/news/list_news', $scope);
})

//知识-文库
lvtuanApp.controller("documentsCtrl",function($scope,$http,$rootScope,listHelper){
	listHelper.bootstrap('/knowledge/article/list_articles', $scope);
})

//知识-案例
lvtuanApp.controller("casesCtrl",function($scope,$http,$rootScope,listHelper){
	listHelper.bootstrap('/case/list_case', $scope);
})

//文章-详情
lvtuanApp.controller("knowledgeViewCtrl",function($scope,$http,$rootScope,$stateParams,$ionicPopup,$ionicPopup,$timeout,$ionicLoading){
	init();
	//获取律师的个人信息
	function init(){ 
		$ionicLoading.show();
		var url = 'http://'+$rootScope.hostName+'/knowledge/'+$stateParams.id+'/view';
		$http.get(url).success(function(data) {
	        	console.info(data.data)
	        	$scope.items = data.data;
	        	sessionStorage.setItem("comments_count", JSON.stringify($scope.items.comments_count));
	        	$ionicLoading.hide();
			})
	}

	//点赞
	$scope.likes = function(id){
		$http.post('http://'+$rootScope.hostName+'/like',
			{
				item_type : 'article',
				item_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json' ,
            	'Authorization': 'bearer ' + $rootScope.token
            }
        }).success(function(data) {
        	var itmes = data.data;
        	$scope.items.likes_count = itmes.likes_count;
        	$scope.items.is_like = true;
           layer.show("点赞成功！");
        });
	}

	//收藏
	$scope.collects = function(id){
		$http.post('http://'+$rootScope.hostName+'/collect',
			{
				collect_type : 3,
				item_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json' ,
            	'Authorization': 'bearer ' + $rootScope.token
            }
        }).success(function(data) {
        	$scope.items.collects_count = $scope.items.collects_count + 1;
        	$scope.items.is_collect = true;
           layer.show("收藏成功！");
        });
	}

	//取消收藏
	$scope.collects_del = function(id){
		$http.post('http://'+$rootScope.hostName+'/collect/delete',
			{
				collect_type : 3,
				item_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json' ,
            	'Authorization': 'bearer ' + $rootScope.token
            }
        }).success(function(data) {
        	$scope.items.collects_count = $scope.items.collects_count - 1 ;
        	$scope.items.is_collect = false;
           layer.show("取消成功！");
        });
	}

	//评论
	$scope.comments = function(id){
		$scope.id = id;
		$scope.data = {}
       // 自定义弹窗
       var myPopup = $ionicPopup.show({
       	template: '<textarea ng-model="data.evaluate_comment" name="evaluate_comment" rows="5" placeholder="想说些什么呢？..."></textarea>',
         title: '评论',
         scope: $scope,
         buttons: [
           { text: '取消' },
           {
             text: '<b>确认</b>',
             type: 'button-positive',
             onTap: function(e) {
               if (!$scope.data.evaluate_comment) {
                 layer.show("内容不能为空！");
                 e.preventDefault();
               }else if($scope.data.evaluate_comment.length > 140){
                 layer.show("内容字数不能大于140字符！");
                 e.preventDefault();
               }else{
                 return $scope.data.evaluate_comment;
               }
             }
           },
         ]
       });
       myPopup.then(function(res) {
	        if(res != undefined){
	        	$scope.evaluate_comment = res;
		        $http.post('http://'+$rootScope.hostName+'/article/'+id+'/comment',
					{
						evaluate_comment 	: $scope.evaluate_comment,
						item_id				: id
					}).success(function(data, status, headers, config) {
			        	$scope.comment = data.data;
			        	$scope.items.comments_count = $scope.comment.comments_count;
			        	sessionStorage.setItem("comments_count", JSON.stringify($scope.items.comments_count));
			           layer.show("评论成功！");
			        });
	      	}else{
	      		 myPopup.close(); // 关闭弹窗
	      	}
	    });
	}
})
//评论-详情
lvtuanApp.controller("commentsViewCtrl",function($scope,$http,$rootScope,$stateParams,$ionicPopup,$ionicPopup,listHelper){
	$scope.comments_count = JSON.parse(sessionStorage.getItem('comments_count'));
	listHelper.bootstrap('/article/'+$stateParams.id+'/comment/list', $scope);
	console.info('/article/'+$stateParams.id+'/comment/list');
	//评论
	$scope.comments = function(){
		$scope.data = {}
       // 自定义弹窗
       var myPopup = $ionicPopup.show({
       	template: '<textarea ng-model="data.evaluate_comment" name="evaluate_comment" rows="5" placeholder="想说些什么呢？..."></textarea>',
         title: '评论',
         scope: $scope,
         buttons: [
           { text: '取消' },
           {
             text: '<b>确认</b>',
             type: 'button-positive',
             onTap: function(e) {
               if (!$scope.data.evaluate_comment) {
                 layer.show("内容不能为空！");
                 e.preventDefault();
               }else if($scope.data.evaluate_comment.length > 140){
                 layer.show("内容字数不能大于140字符！");
                 e.preventDefault();
               }else{
                 return $scope.data.evaluate_comment;
               }
             }
           },
         ]
       });
       myPopup.then(function(res) {
	        if(res != undefined){
	        	$scope.evaluate_comment = res;
		        $http.post('http://'+$rootScope.hostName+'/article/'+$stateParams.id+'/comment',
					{
						evaluate_comment 	: $scope.evaluate_comment,
						item_id				: $stateParams.id
					}).success(function(data, status, headers, config) {
			        	$scope.comment = data.data;
			        	$scope.items = $scope.items.concat($scope.comment);
			        	$scope.comments_count = $scope.comment.comments_count;
			        	sessionStorage.setItem("comments_count", JSON.stringify($scope.comment.comments_count));
			           layer.show("评论成功！");
			        });
	      	}else{
	      		 myPopup.close(); // 关闭弹窗
	      	}
	    });
	}
})

/****************************************************** 我的 ******************************************************/
/*———————————————————————————— 用户的个人中心 ————————————————————————————*/
//普通用户-我的
lvtuanApp.controller("centerCtrl",function($scope,$http,$rootScope,$ionicPopup,$timeout,$ionicLoading,authService){

	$scope.$on('$ionicView.beforeEnter', function() {  
		var currentUser = authService.getUser();
		$scope.currentUser = currentUser;
		var timestamp=Math.round(new Date().getTime()/1000);
		var url = null;
		$ionicLoading.show();
		if(!currentUser.is_verified_lawyer){
			//普通用户个人信息
			url = 'http://'+$rootScope.hostName+'/center/customer/info?ts='+timestamp;
		}else{
			//律师个人信息
			url = 'http://'+$rootScope.hostName+'/center/lawyer/info?ts='+timestamp;
		}

		$http.get(url)
			.success(function(data) {
				if(data && data.data){
					//用于连接两个或多个数组并返回一个新的数组
					$scope.items = data.data; 
					console.info($scope.items);
				}else{
					layer.show('暂无数据！');
					return false;
				}
				$ionicLoading.hide();
			})
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

//律师-普通用户-个人资料
lvtuanApp.controller("infoCtrl",function($scope,$http,$rootScope,$timeout,$ionicLoading,Upload,authService){

	$scope.$on('$ionicView.beforeEnter', function() {  
		//判断是否是律师
		var currentUser = authService.getUser();
		var timestamp=Math.round(new Date().getTime()/1000);
		var url = null;
		$ionicLoading.show();
		if(currentUser.status == 1 || currentUser.status == 2){
			//普通用户个人信息
			url = 'http://'+$rootScope.hostName+'/center/customer/info?ts='+timestamp;
			getDate(url);
		}else{
			//律师个人信息
			url = 'http://'+$rootScope.hostName+'/center/lawyer/info?ts='+timestamp;
			getDate(url);
		}
		function getDate(url){
			$http.get(url)
				.success(function(data) {
					if(data && data.data){
						//用于连接两个或多个数组并返回一个新的数组
						$scope.items = data.data; 
						$scope.file = $scope.items.user.avatar;
						localStorage.setItem("userinfo", JSON.stringify($scope.items));
					}else{
						layer.show('暂无数据！');
						return false;
					}
					$ionicLoading.hide();
				})
		}
	})

	//我的资料个人头像
   $scope.uploadFiles = function (avatar,id) {
   		$ionicLoading.show();
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
            url: 'http://'+$rootScope.hostName+'/center/customer/update_user_image',
            data: {
            	upload_file: avatar,
            	'user_id': id
            }
        }).then(function (response) {
        	var file_path = 'http://'+$rootScope.hostName+'/file/show?path='+response.data.data.file_path;
        	$scope.file = file_path;
            $timeout(function () {
                $scope.result = response.data;
            });
            $ionicLoading.hide();
        }, function (response) {
            if (response.status > 0) {
             	var errorMsg = response.status + ': ' + response.data;
        		console.info('errorMsg',errorMsg);
        		layer.show(errorMsg);
            }
        }, function (evt) {
        	/*var progres = parseInt(100.0 * evt.loaded / evt.total);
        	$scope.progress = progres;*/
        });
    };

})

//个人信息 - 修改姓名
lvtuanApp.controller("valrealnameCtrl",function($scope,$http,$rootScope,$ionicLoading,authService){
	//判断是否是律师
	var currentUser = authService.getUser();
	var timestamp=Math.round(new Date().getTime()/1000);
	$scope.userinfo = JSON.parse(localStorage.getItem('userinfo'));
    console.info($scope.userinfo)
	$scope.user = {
			nikname:$scope.userinfo.user.nikname
		};


	//提交用户的信息
    $scope.submit = function(){
    	$ionicLoading.show();
    	var params = layer.getParams("#niknameForm");
    	var url = null;
    	if(currentUser.status == 1 || currentUser.status == 2){
    		url = 'http://'+$rootScope.hostName+'/center/customer/info?ts='+timestamp;
    	}else{
			url = 'http://'+$rootScope.hostName+'/center/lawyer/info?ts='+timestamp;
    	}
    	$http.post(url,params)
    		.success(function(data) {
	            layer.show("提交成功！");
	            $scope.user = {
					nikname: ""
				};
	            location.href='#/info';
	            $ionicLoading.hide();
	        });
    }
})
//个人信息 - 修改手机
lvtuanApp.controller("valphoneCtrl",function($scope,$http,$rootScope,$ionicLoading,authService){
	//判断是否是律师
	var currentUser = authService.getUser();
	$scope.userinfo = JSON.parse(localStorage.getItem('userinfo'));
	$scope.user = {
			phone:$scope.userinfo.user.phone 
		};

	//获取验证码
	$scope.phonecode = function(phone){
		var param = 'phone='+phone;
		$http.post('http://'+$rootScope.hostName+'/send-code?'+param
		).success(function(data) {
           layer.show("验证码已发送到您的手机！");
        });
	}
	
	//提交用户的信息
    $scope.submit = function(){
    	$ionicLoading.show();
    	var params = layer.getParams("#phoneForm");
		$http.post('http://'+$rootScope.hostName+'/center/update_phone',params)
			.success(function(data) {
	            layer.show("提交成功！");
	            $scope.user = {
						phone: "",
						phonecode : ""
					};
	            location.href='#/info';
	            $ionicLoading.hide();
	        });
	}
})
//个人信息 - 修改邮箱
lvtuanApp.controller("valemailCtrl",function($scope,$http,$rootScope,$ionicLoading,authService){
	//判断是否是律师
	var currentUser = authService.getUser();
	$scope.userinfo = JSON.parse(localStorage.getItem('userinfo'));
	$scope.user = {
			email:$scope.userinfo.user.email 
		};

	//获取验证码
	$scope.phonecode = function(phone){
		var param = 'phone='+phone;
		$http.post('http://'+$rootScope.hostName+'/send-code?'+param
		).success(function(data) {
           layer.show("验证码已发送到您的邮箱！");
        });
	}
	
	//提交用户的信息
    $scope.submit = function(){
    	$ionicLoading.show();
    	var params = layer.getParams("#emailForm");
		$http.post('http://'+$rootScope.hostName+'/center/update_email',params)
			.success(function(data) {
	            layer.show("提交成功！");
	            $scope.user = {
							email: "",
							phonecode : ""
						};
	            location.href='#/info';
	            $ionicLoading.hide();
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

//普通用户-认证为律师的导航
lvtuanApp.controller("becomenavCtrl",function($scope,$http,$rootScope,$ionicPopup,$timeout,$localStorage,$ionicLoading,authService){
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/center/becomelawyer/infochecks')
		.success(function(data) {
			$scope.infochecks = data.data; 
			console.info($scope.infochecks);
			$ionicLoading.hide();
		})

	var currentUser = authService.getUser();
	$scope.currentUser = currentUser;
	if(!currentUser.is_verified_lawyer){
			$scope.submit = function(){
				$http.post('http://'+$rootScope.hostName+'/center/becomelawyer/submit')
					.success(function(data) {
						delete $localStorage.addres;
						layer.show("提交成功！请等待审核...");
						location.href='#/center';

			        }).error(function(data){
						console.info(data);
					});
			}
	
	}else{
		//律师个人信息
		$http.get('http://'+$rootScope.hostName+'/center/lawyer/info')
		.success(function(data) {
			if(data && data.data){
				//用于连接两个或多个数组并返回一个新的数组
				$scope.items = data.data; 
				console.info($scope.items);
				localStorage.setItem("lvinfo", JSON.stringify($scope.items));
			}else{
				layer.show('暂无数据！');
				return false;
			}
		})
	}
	
})

//普通用户- 认证为律师的导航 - 从业信息
lvtuanApp.controller("practitionersCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,$localStorage,$location,Upload,authService) {

		var currentUser = authService.getUser();
		$scope.currentUser = currentUser;
		if(currentUser.is_verified_lawyer){
			$scope.lvinfo = JSON.parse(localStorage.getItem('lvinfo'));
			console.info($scope.lvinfo);
			if($scope.lvinfo){
				$scope.license = $scope.lvinfo.user.lawyer.license;
				$scope.company_name = $scope.lvinfo.user.lawyer.company_name;
				$scope.file = $scope.lvinfo.user.lawyer.license_file;
				var param = $scope.lvinfo.user.lawyer.practice_period;
				$scope.address = $scope.lvinfo.user.province_name +' '+ $scope.lvinfo.user.city_name +' '+ $scope.lvinfo.user.district_name;
				periods();
			}

		}else{

			$scope.address = "";
			$scope.addres_param = {};
			$scope.addres = $localStorage.addres || "";
			$scope.$watch('addres', function(newVal, oldVal) {
				// 监听变化，并获取参数的最新值
			    console.log('newVal: ', newVal);   
			    $localStorage.addres = $scope.addres;
			    $scope.addres_param = $localStorage.addres;
			    if($scope.addres_param){
			    	$scope.address = $scope.addres_param.province.value +" "+ $scope.addres_param.city.value +" "+ $scope.addres_param.district.value;
			   	 	console.info('address',$scope.address);
			    }else{
			    	$scope.address = "";
			    }
			});
			$scope.$watch(function() {
			    return angular.toJson($localStorage);
			}, function() {
			    $scope.addres = $localStorage.addres;
			    console.info($scope.addres);
			});
			
			//律师的从业年限
			periods();
		}

		//律师的从业年限
		function periods(){
			$scope.periods = null;
			$http.get('http://'+$rootScope.hostName+'/lawyer/practiseperiods')
				.success(function(data) {
					$scope.periods = data.data; 
					if(param){
			    		for(var i=0;i<$scope.periods.length; i++){
							if(param == $scope.periods[i].key){
								$scope.practice_period = $scope.periods[i];
								break;
							}
						}
			    	}
				})
		}
		
		//上传执业证书
	    $scope.uploadFiles = function (license_file) {
	        Upload.upload({
	        	headers: {
		            'Content-Type': 'application/json' , 
		            'Authorization': 'bearer ' + $rootScope.token
	       		},
	            url: 'http://'+$rootScope.hostName+'/file/upload/user',
	            data: {
	            	upload_file: license_file,
	            	'user_id': currentUser.id
	            }
	        }).then(function (response) {
	        	$scope.file = response.data.data.file_url;
	        	$scope.file_path = response.data.data.file_path;
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
		

		//获取省市区
		$scope.getAddress = function(){
			delete $localStorage.addres;
			localStorage.setItem("citypicke_goback", $location.path());
			location.href='#/citypicke/all';
		}
		
		
			//提交
		$scope.submit = function(){
			
			var param = layer.getParams("#practitionForm");
			var province =  $scope.addres_param.province.key;
			var city =  $scope.addres_param.city.key;
			var district =  $scope.addres_param.district.key;
			if(province){
				param['province'] = province;
			}
			if(city){
				param['city'] = city;
			}
			if(district){
				param['district'] = district;
			}
			if(!currentUser.is_verified_lawyer){
				if(param.license_file.length < 1){
					layer.show("请上传执业证书！");
					return false;
				}
			}
			console.info(param);
			$http.post('http://'+$rootScope.hostName+'/center/becomelawyer/work', param
			).success(function(data) {
	           layer.show("添加成功！");
	           location.href='#/becomenav';
	        });
		}	

})
//普通用户- 认证为律师的导航 - 实名认证
lvtuanApp.controller("verifiedCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,$localStorage,Upload) {
	//上传身份证
    $scope.uploadFiles = function (license_file) {
        Upload.upload({
        	headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
       		},
            url: 'http://'+$rootScope.hostName+'/file/upload/user',
            data: {
            	upload_file: license_file,
            	'user_id': currentUser.id
            }
        }).then(function (response) {
        	$scope.file = response.data.data.file_url;
        	$scope.file_path = response.data.data.file_path;
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

    //判断是否已经填过数据
    $scope.lvinfo = JSON.parse(localStorage.getItem('lvinfo'));
	console.info($scope.lvinfo);
	if($scope.lvinfo){
		
		$scope.file = $scope.lvinfo.user.lawyer.ID_img;
	}

    //提交
	$scope.submit = function(){
		var param = layer.getParams("#verifiedForm");
		if(param.ID_img.length < 1){
			layer.show("请上传执业证书！");
			return false;
		}
		$http.post('http://'+$rootScope.hostName+'/center/becomelawyer/identity', param
		).success(function(data) {
            layer.show("添加成功！");
            location.href='#/becomenav';
        });
	}
	
})
//普通用户- 认证为律师的导航 - 资费设置
lvtuanApp.controller("tariffsetCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,$localStorage) {
	//判断是否已经填过数据
    $scope.lvinfo = JSON.parse(localStorage.getItem('lvinfo'));
	console.info($scope.lvinfo);
	if($scope.lvinfo){
		$scope.textreplyfee = parseInt($scope.lvinfo.user.lawyer.text_reply_fee);
	    $scope.phonereplyfee = parseInt($scope.lvinfo.user.lawyer.phone_reply_fee);
	}

	//提交
	$scope.submit = function(){
		var param = layer.getParams("#tariffsetForm");
		$http.post('http://'+$rootScope.hostName+'/center/becomelawyer/fee', param
			).success(function(data) {
	            layer.show("添加成功！");
	            location.href='#/becomenav';
	        });
	}
})

//普通用户- 认证为律师的导航 - 擅长领域
lvtuanApp.controller("fieldCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,$localStorage,Upload) {
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

	$scope.inShowscopes = function(workscope, showscopes) {
		var value = false;
		angular.forEach(showscopes, function(item){
			if (item.key == workscope.key) {
				value = true;
			}
		});
		return value;
	}

	//获取擅长领域
	$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
		.success(function(data) {
			$scope.workscopes = data.data; 
			console.info($scope.workscopes);

			//判断是否已经填过数据
		    $scope.lvinfo = JSON.parse(localStorage.getItem('lvinfo'));
			console.info($scope.lvinfo);
			if($scope.lvinfo && $scope.lvinfo.user.lawyer.work_scope.length > 0){
				console.info($scope.lvinfo.user.lawyer.work_scope);
				$scope.showscopes = $scope.lvinfo.user.lawyer.work_scope;
			}else{
				return false;
			}
		})

	$scope.showscopes = [];
	$scope.click_workscope = function(key,value){
		var isvalue = false;
		if($scope.showscopes.length < 3){
			for(var i=0; i<$scope.showscopes.length; i++){
				if($scope.showscopes[i].key == key){
					$scope.showscopes.remove(i);
					isvalue = false;
					return false;
				}
			}
			if(value){
				var workscope = {};
				workscope.key = key;
				workscope.value = value;
				$scope.showscopes.push(workscope);
				isvalue = true;
			}
			return isvalue;
		}else{
			angular.forEach($scope.showscopes, function(item,index){
				if (item.key == key) {
					$scope.showscopes.remove(index);
					console.info($scope.showscopes);
					isvalue = false;
				}
			});
			return isvalue;
			return false;
		}
	}

	//提交
	$scope.submit = function(){
		var param = {};
		var workscope = [];
		if($scope.showscopes.length > 0){
			angular.forEach($scope.showscopes, function(item){
				workscope.push(item.key)
			});
			param['work_scope'] = workscope;
		}else{
			layer.show("请选择擅长领域！")
		}
		console.info(param);
		$http.post('http://'+$rootScope.hostName+'/center/becomelawyer/workscope', param
			).success(function(data) {
				console.info(data);
	            layer.show("添加成功！");
	            location.href='#/becomenav';
	        });
	}
})

//普通用户- 认证为律师的导航 - 经历案例
lvtuanApp.controller("caseCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,$localStorage,Upload) {
	//判断是否已经填过数据
	$scope.lvinfo = JSON.parse(localStorage.getItem('lvinfo'));
	console.info($scope.lvinfo);
	if($scope.lvinfo){
	    $scope.introduce = $scope.lvinfo.user.lawyer.introduce;
	    $scope.experience = $scope.lvinfo.user.lawyer.experience;
	    $scope.law_cases = $scope.lvinfo.user.lawyer.law_cases;
	}

	//提交
	$scope.submit = function(){
		var param = layer.getParams("#caseForm");
		$http.post('http://'+$rootScope.hostName+'/center/becomelawyer/experience', param
			).success(function(data) {
	            layer.show("添加成功！");
	            location.href='#/becomenav';
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
	}

})


/****************************************************** 找律师 ******************************************************/
//找律师的列表
lvtuanApp.controller("lawyerlistCtrl",function($scope,$state,$http,$rootScope,$location,$timeout,$ionicLoading,locationService){

	$scope.locations = locationService.getLocation();
	$scope.city = $scope.locations.city_id;

	$scope.orders = [
					{
						"key"	:"most_popular",
						"value" : "人气最高"
					},
					{
						"key"	:"best_evaluated",
						"value" : "评分最好"
					},
					{
						"key"	:"experience",
						"value" : "执业年限"
					},
					{
						"key"	:"pay_reply_count",
						"value" : "接单数"
					}
				];
	getDistrict();
	getWorkscopes();
	getPractisePeriods();

	//获取所在区域
	function getDistrict(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/area/'+$scope.city+'/district')
			.success(function(data) {
				$scope.districts = data.data; 
				$ionicLoading.hide();
			})
	}
	//获取法律专长
	function getWorkscopes(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
			.success(function(data) {
				$scope.workscopes = data.data;
				$ionicLoading.hide();
			})
	}
	//律师的从业年限
	function getPractisePeriods(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/lawyer/practiseperiods')
			.success(function(data) {
				$scope.periods = data.data; 
				$ionicLoading.hide();
			})
	}

	var page = 1; //页数
	var rows_per_page = 5; // 每页的数量
	if ($scope.rows_per_page) {
		rows_per_page = $scope.rows_per_page;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

	//根据地区查找律师
	$scope.searchCity = function(){
		page = 1;
		$scope.items = [];
	    getParams();
	}

	//搜索问题
	$scope.q = '';
	$scope.$watch('q', function(newVal, oldVal) {
		if(newVal !== oldVal){
			page = 1;
			$scope.items = [];
			getParams();
    	}
	});

	//获取参数，处理被收藏书签的情况
	function getParams(){
		var params = layer.getParams("#searchForm");
	  	var param = [];
	  	if(params.q){
	  		param.push('q=' + params.q);
	  	}
	  	if(params.district_id){
	  		param.push('district_id=' + params.district_id);
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
	  	if($scope.city){
	  		param.push('city_id=' + $scope.city);
	  	}
	  	param = param.join('&');
	  	console.info(param)
	  	geturl(param);
	}

    //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        $scope.loadMore();
        $scope.$broadcast('scroll.refreshComplete');
    };

    //上拉加载
	$scope.loadMore = function() {
		//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
		getParams();
	};

	function geturl(param){
		var url;
		if(param != ""){
	  		url = 'http://'+$rootScope.hostName+'/lawyer/list_lawyers?'+param+'&rows_per_page='+rows_per_page+'&page='+page;
	    }else{
	    	url = 'http://'+$rootScope.hostName+'/lawyer/list_lawyers?rows_per_page='+rows_per_page+'&page='+page;
	    }
	    $ionicLoading.show();
		$http.get(url)
			.success(function(data) {
	        	console.info(data.data)
	        	if(data && data.data && data.data.length){
					$scope.items = $scope.items.concat(data.data);
					console.info($scope.items);
					if (data.data.length < rows_per_page) {
						$scope.moredata = false;
					} else {
						$scope.moredata = true;
					}
				}else{
					if (page == 1) {
						layer.show('暂无数据！');
					}
					$scope.moredata = false;
				}
				page++;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			})
	}
	
	$scope.jumppage = function(id){
		//$location.path('/lawyer/'+id);
		location.href='#/lawyer/'+id;
	}

})


//律师个人主页 - 个人介绍
lvtuanApp.controller("viewCtrl",function($scope,$http,$rootScope,$stateParams,httpWrapper,authService,$ionicLoading){
	$scope.max = 5;
	$scope.ratingVal = 5;
	$scope.readonly = true;
	$scope.onHover = function(val){
		$scope.hoverVal = val;
	};
	$scope.onLeave = function(){
		$scope.hoverVal = null;
	}
	//创建tabs列表
	$scope.tabs = [{
            title: '个人介绍',
            url: 'selfintro.tpl.html'
        }, {
        	title: '文章分享',
            url: 'article.tpl.html'
        }, {
            title: '咨询回复',
            url: 'advisory.tpl.html'
    	}, {
            title: '用户评价',
            url: 'evaluate.tpl.html'
        }, {
            title: '成交记录',
            url: 'dealrecord.tpl.html'
    	 }
    ];

    $scope.currentTab = 'selfintro.tpl.html'; //默认第一次显示的tpl

    $scope.onClickTab = function (tab) { //点击tab赋值url
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {  //给选中的url的a 标签样式
        return tabUrl == $scope.currentTab;
    }

    $ionicLoading.show();
	httpWrapper.get('http://'+$rootScope.hostName+'/lawyer/'+$stateParams.id, function(data){
		$scope.items = data.data;
	    $scope.ratingVal = $scope.items.average_evaluate_score;
		console.info($scope.items);
		$ionicLoading.hide();
	});

   $scope.graphic5 = function(id,index){
   	sessionStorage.setItem("lawyerId", id);
   	sessionStorage.setItem("index", index);
	
	if (index == 5 && $scope.items.text_reply_fee == 0) {
		layer.show("对不起，这个律师还没有开始提供这个服务!");
		return;
	}
	if (index == 6 && $scope.items.phone_reply_fee == 0) {
		layer.show("对不起，这个律师还没有开始提供这个服务!");
		return;
	}


	
	if (index == 5 && $scope.items.text_reply_fee == 0) {
		layer.show("对不起，这个律师还没有开始提供这个服务!");
		return;
	}
	if (index == 6 && $scope.items.phone_reply_fee == 0) {
		layer.show("对不起，这个律师还没有开始提供这个服务!");
		return;
	}

   	var currentUser = authService.getUser();
   	if(currentUser == null){
   		location.href='#/login';
   		return false;
   	}
	if(currentUser.status == 1 || currentUser.status == 2){
		//普通用户个人信息
		location.href='#/graphic';
	}else{
		layer.show("律师没有开通该项服务!");
	}
	
   }

	//关注
	$scope.follow = function(id){
		$http.post('http://'+$rootScope.hostName+'/follow',
			{
				follow_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json' ,
            	'Authorization': 'bearer ' + $rootScope.token
            }
        }).success(function(data) {
        	console.info(data);
        	$scope.items.follower_count++;
        	$scope.items.is_following = true;
           layer.show("关注成功！");
        });
	}

	//取消关注
	$scope.follow_del = function(id){
		$http.post('http://'+$rootScope.hostName+'/follow/remove',
			{
				follow_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json' ,
            	'Authorization': 'bearer ' + $rootScope.token
            }
        }).success(function(data) {
        	console.info(data);
        	$scope.items.follower_count--;
        	$scope.items.is_following = false;
           layer.show("取消成功！");
        });
	}
	
})

//律师个人主页-律师文章
lvtuanApp.controller("viewarticleCtrl",function($scope,$http,$rootScope,$stateParams,listHelper){
	//获取律师文章列表
	listHelper.bootstrap('/lawyer/'+$stateParams.id+'/articles', $scope);
})

//律师个人主页-咨询回复
lvtuanApp.controller("advisoryCtrl",function($scope,$http,$rootScope,$stateParams,listHelper){
	//咨询回复
	listHelper.bootstrap('/lawyer/'+$stateParams.id+'/questions', $scope);
})

//律师个人主页-用户评价
lvtuanApp.controller("evaluateCtrl",function($scope,$http,$rootScope,$stateParams,httpWrapper){

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

	console.info("律师评价");
	//获取律师的评价列表
	var page = 1; //页数
    $scope.moredata = true; 
    $scope.items = [];	//创建一个数组接收后台的数据
    //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.item = [];
        $scope.loadMore();
    };

    $scope.loadMore = function(){
		getEvaluation();
	}
	
	function getEvaluation(){
		var url = 'http://'+$rootScope.hostName+'/lawyer/'+$stateParams.id+'/evaluations?page='+page;
		$http.get(url)
			.success(function(data) {
				if(data.data.length > 0){
					$scope.moredata = true;
					//用于连接两个或多个数组并返回一个新的数组
					$scope.items = $scope.items.concat(data.data); 
					$scope.ratingVal = [];
					for(var i=0; i<$scope.items.length; i++){
						$scope.ratingVal.push($scope.items[i].evaluate_score);
					}

				}else{
					layer.show("暂无数据！")
					$scope.moredata = false;
					return false;
				}
				page++;
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

//律师个人主页-成交记录
lvtuanApp.controller("dealrecordCtrl",function($scope,$http,$rootScope,$stateParams,listHelper){
	//成交记录
	listHelper.bootstrap('/lawyer/'+$stateParams.id+'/evaluations', $scope);
})


//律师个人主页-律师广播
lvtuanApp.controller("viewteleviseCtrl",function($scope,$http,$rootScope,listHelper){
	listHelper.bootstrap('/microblog/list/mine', $scope);
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
        	console.info(data);
        	var itmes = data.data;
        	$scope.items[index].post_extra.likes_count = itmes.likes_count;
           layer.show("点赞成功！");
        });
	}
})

//找律师-图文咨询
lvtuanApp.controller("graphicCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,$ionicLoading,listHelper,httpWrapper,Upload){
	//选择类型
   $ionicLoading.show(); 
	$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
		.success(function(data) {
	      if(data.data){
	        $scope.workscopes = data.data;
	      }else{
	      	layer.show("暂无数据！");
	      }
          $ionicLoading.hide();
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
    $scope.user = {};
    //提交问题
	$scope.submit = function(user){
		$scope.user = user;
		if($scope.file.length > 0){
			$scope.user['file_paths'] = $scope.file;
		}
		if(index){
			$scope.user['type'] = index;
		}
		if(lawyerId){
			$scope.user['lawyer_id'] = lawyerId;
		}
        $ionicLoading.show();
		httpWrapper.request('http://'+$rootScope.hostName+'/center/pay/question/create','post',$scope.user,
			function(data){
				layer.show("提交成功！");
				$scope.user = {};
				$scope.files = {};
        		$scope.errFiles = {};
        		location.href='#/pay/'+data.data.data.id+'?type=question';
			$ionicLoading.hide()
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
lvtuanApp.controller("questionsCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,$state,$ionicLoading,httpWrapper,Upload){
    $ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
		.success(function(data) {
	      if(data.data){
	        $scope.workscopes = data.data;
	      }else{
	      	layer.show("暂无数据！");
	      }
          $ionicLoading.hide();
	    });
	
	//用来存储上传的值
	$scope.file = [];
    $scope.uploadFiles = function(files, errFiles) {
    	
    	if(files == null && $scope.file != null){
    		$scope.file = $scope.file;
    		$scope.files = $scope.files; 
    		return false;
    	}

        if(files && files.length > 2){
	        	layer.show("最多只能上传2个文件或者图片！");
	        	return false;
	        }else{
	        	$ionicLoading.show();
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
		                $ionicLoading.hide();
		            }, function (response) {
		            	var status = response.status
		                if (response.status > 0)
		                    $scope.errorMsg = response.status + ': ' + response.data;
		            }, function (evt) {
		                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		                $scope.progress = file.progress;
		            });
		        });
		}
    }
    $scope.user = {};
    //提交问题
	$scope.submit = function(user){
		$scope.user = user;
		if($scope.file.length > 0){
			$scope.user['file_paths'] = $scope.file;
		}
        $ionicLoading.show();
		httpWrapper.request('http://'+$rootScope.hostName+'/question/create','post',$scope.user,
			function(data){
				layer.show("提交成功！");
				$scope.user = {};
				$scope.files = {};
        		$scope.errFiles = {};
                $ionicLoading.hide();
			},function(data){
	        	console.info(data.error_messages);
	        	var errMsg = JSON.stringify(data.error_messages.content[0]);
	        	layer.show(errMsg);
			}
		);
	}

})

//问律师列表
lvtuanApp.controller("questionslistCtrl",function($http,$scope,$state,$rootScope,$timeout,listHelper){

	listHelper.bootstrap('/question/list_questions', $scope);

})

//问律师搜索
lvtuanApp.controller("questionslistsearchCtrl",function($http,$scope,$state,$rootScope,$timeout,$ionicLoading){
	
	var page = 1; //页数
	var rows_per_page = 5; // 每页的数量
	if ($scope.rows_per_page) {
		rows_per_page = $scope.rows_per_page;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

	//搜索问题
	$scope.q = '';
	$scope.$watch('q', function(newVal, oldVal) {
		if(newVal !== oldVal){
			page = 1;
			$scope.items = [];
	        $scope.loadMore();
	    }
	});

	//下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        $scope.loadMore();
        $scope.$broadcast('scroll.refreshComplete');
    };

    //上拉加载
	$scope.loadMore = function() {
		//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
		var params = layer.getParams("#searchForm");
		var url = "";
		if(params.q != ""){
			url = 'http://'+$rootScope.hostName+'/question/list_questions?q='+params.q+'&rows_per_page='+rows_per_page+'&page='+page;
			$ionicLoading.show();
			$http.get(url)
				.success(function(data) {
					if(data && data.data && data.data.length){
						$scope.items = $scope.items.concat(data.data);
						console.info($scope.items);
						if (data.data.length < rows_per_page) {
							$scope.moredata = false;
						} else {
							$scope.moredata = true;
						}
					}else{
						if (page == 1) {
							layer.show('暂无数据！');
						}
						$scope.moredata = false;
					}
					page++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$ionicLoading.hide();
				})
		}else{
			$scope.moredata = false;
	    	return false;
	    }
		
	};

	$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMore();
	})
	

})

//问律师详情
lvtuanApp.controller("questionsviewsCtrl",function($http,$scope,$state,$rootScope,$stateParams,$ionicLoading){
	init()
	//获取律师的个人信息
	function init(){ 
		var url = 'http://'+$rootScope.hostName+'/question/'+$stateParams.id;
		$ionicLoading.show();
		$http.get(url)
			.success(function(data) {
	        	console.info(data.data)
	        	$scope.items = data.data;
			}).finally(function(data) {
		    	$ionicLoading.hide();
		    });
	}

	//收藏
	$scope.collects = function(id){
		$http.post('http://'+$rootScope.hostName+'/collect',
			{
				collect_type : 1,
				item_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json' ,
            	'Authorization': 'bearer ' + $rootScope.token
            }
        }).success(function(data) {
        	$scope.items.is_collect = true;
           layer.show("收藏成功！");
        });
	}

	//取消收藏
	$scope.collects_del = function(id){
		$http.post('http://'+$rootScope.hostName+'/collect/delete',
			{
				collect_type : 1,
				item_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json' ,
            	'Authorization': 'bearer ' + $rootScope.token
            }
        }).success(function(data) {
        	$scope.items.is_collect = false;
           layer.show("取消成功！");
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
		})

})
//律师订单 - 全部
lvtuanApp.controller("orderAllCtrl",function($http,$scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/pay/lawyer/question/all', $scope);
	//删除
	$scope.remove = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/lawyer/question/'+id+'/remove','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("删除成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//受理
	$scope.accept = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/pay/lawyer/question/'+id+'/accept','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("受理成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//拒绝
	$scope.refuse = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/pay/lawyer/question/'+id+'/refuse','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("拒绝成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//查看评价
	$scope.comment = function(id){
		location.href='#/lawyer/order/comment/'+id;
	}
	//联系客户
	$scope.ask = function(id){
		location.href='#/easemobinit/'+id;
	}

})
//律师订单 - 待受理
lvtuanApp.controller("orderNewCtrl",function($scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/pay/lawyer/question/new', $scope);
	//受理
	$scope.accept = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/pay/lawyer/question/'+id+'/accept','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("受理成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//拒绝
	$scope.refuse = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/pay/lawyer/question/'+id+'/refuse','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("拒绝成功！");
			},function(data){
				console.info(data);
			}
		);
	}
})
//律师订单 - 待确认
lvtuanApp.controller("orderRepliedCtrl",function($http,$rootScope,$scope,listHelper){
	listHelper.bootstrap('/center/pay/lawyer/question/replied', $scope);
	//联系客户
	$scope.ask = function(id){
		location.href='#/easemobinit/'+id;
	}
})
//律师订单 - 已完成
lvtuanApp.controller("orderCompleteCtrl",function($http,$scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/pay/lawyer/question/complete', $scope);
	//查看评价
	$scope.comment = function(id){
		location.href='#/lawyer/order/comment/'+id;
	}
	//删除
	$scope.remove = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/lawyer/question/'+id+'/remove','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("删除成功！");
			},function(data){
				console.info(data);
			}
		);
	}
})
//律师订单 - 详情
lvtuanApp.controller("orderlawyerDetailCtrl",function($http,$scope,$stateParams,$rootScope,httpWrapper){
	httpWrapper.get('http://'+$rootScope.hostName+'/center/pay/lawyer/question/'+$stateParams.id+'/view', function(data){
		$scope.item = data.data;
		console.info($scope.item);
	});
	//删除
	$scope.remove = function(id){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/lawyer/question/'+id+'/remove','post',null,
			function(data){
				layer.show("删除成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//受理
	$scope.accept = function(id){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/pay/lawyer/question/'+id+'/accept','post',null,
			function(data){
				layer.show("受理成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//拒绝
	$scope.refuse = function(id){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/pay/lawyer/question/'+id+'/refuse','post',null,
			function(data){
				layer.show("拒绝成功！");
			},function(data){
				console.info(data);
			}
		);
	}
	//查看评价
	$scope.comment = function(id){
		location.href='#/lawyer/order/comment/'+id;
	}
	//联系客户
	$scope.ask = function(id){
		location.href='#/easemobinit/'+id;
	}
})


//律师订单 - 评价详情
lvtuanApp.controller("commentorderlawyerCtrl",function($http,$scope,$stateParams,$rootScope,$timeout,httpWrapper){

	$scope.max = 5;
	$scope.ratingVal = 5;
	$scope.readonly = true;
	$scope.onHover = function(val){
		$scope.hoverVal = val;
	};
	$scope.onLeave = function(){
		$scope.hoverVal = null;
	}

	httpWrapper.get('http://'+$rootScope.hostName+'/center/lawyer/question/'+$stateParams.id+'/evaluate/view', function(data){
		$scope.item = data.data;
		console.info($scope.item);
		$scope.ratingVal = $scope.item.evaluate_score;
	});

});




//律师的工作 - 咨询 － 待受理
lvtuanApp.controller("lawyerquestionNewCtrl",function($scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/lawyer/question/new', $scope);
	//抢单
	$scope.to_take = function(id){
		httpWrapper.request('http://'+$rootScope.hostName+'/question/'+id+'/to_take','post',null,
			function(data){
				layer.show("抢单成功！");
				location.href='#/lawyerquestion/replied';
			},function(data){
				console.info(data);
			}
		);
	}
})
//律师的工作 - 咨询 － 待确认
lvtuanApp.controller("lawyerquestionRepliedCtrl",function($scope,$rootScope,$http,listHelper,httpWrapper){
	listHelper.bootstrap('/center/lawyer/question/replied', $scope);
	//联系客户
	$scope.ask = function(id){
		location.href='#/easemobinit/'+id;
	}
})
//律师的工作 - 咨询 － 已完成
lvtuanApp.controller("lawyerquestionCompleteCtrl",function($scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/lawyer/question/complete', $scope);
	//查看评价
	$scope.comment = function(id){
		location.href='#/lawyer/order/comment/'+id;
	}
	//删除
	$scope.remove = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/lawyer/question/'+id+'/remove','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("删除成功！");
			},function(data){
				console.info(data);
			}
		);
	}
})

//律师的工作 - 咨询 - 详情
lvtuanApp.controller("lawyerquestionsviewCtrl",function($http,$scope,$stateParams,$rootScope,httpWrapper){

	httpWrapper.get('http://'+$rootScope.hostName+'/center/lawyer/question/'+$stateParams.id+'/view', function(data){
		$scope.items = data.data;
		console.info($scope.items);
	});
	//抢单
	$scope.to_take = function(id){
		httpWrapper.request('http://'+$rootScope.hostName+'/question/'+id+'/to_take','post',null,
			function(data){
				layer.show("抢单成功！");
				location.href='#/lawyerquestion/replied';
			},function(data){
				console.info(data);
			}
		);
	}
	//联系客户
	$scope.ask = function(id){
			location.href='#/easemobinit/'+id;
	}
	//删除
	$scope.remove = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/lawyer/question/'+id+'/remove','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("删除成功！");
			},function(data){
				console.info(data);
			}
		);
	}
})

//咨询和订单的一对一咨询 - 准备 - 即时通讯
lvtuanApp.controller("easemobinitCtrl",function($scope,$http,$state,$rootScope,$stateParams){
	localStorage.removeItem('easemobParam'); //清空之前的旧数据
	$scope.user_name = "";
	$scope.user_password = "";
	$("#user_name").val("");
	$("#user_password").val("");
	$http.get('http://'+$rootScope.hostName+'/center/question/'+$stateParams.id+'/ask'
    ).success(function(data) {
    	if (data && data.data) {
	    	var itmes = data.data;
	    	$scope.user_name = itmes.easemob_id;
	    	$scope.user_password = itmes.easemob_pwd;
	    	$scope.easemobParam = {
	    		'jumpUrl'		:'http://'+$rootScope.hostName+'/question/'+itmes.post_id+'/comment',
	    		'rootUrl'		:'http://'+$rootScope.hostName+'/question/'+itmes.post_id+'/comment_list',
	    		'curChatUserId' : itmes.user_id,
		    	'content'	 	: itmes.content,
		    	'created_at' 	: itmes.created_at.date,
		    	'post_id' 		: itmes.post_id,
		    	'realname' 		: itmes.realname,
		    	'user_avatar' 	: itmes.user_avatar,
		    	'myName' 		: itmes.myName,
		    	'comments'		: itmes.comments,
		    	'easemob_id'    : itmes.easemob_id,
		    	'easemob_pwd'   : itmes.easemob_pwd
	    	};
	    	localStorage.setItem("easemobParam", JSON.stringify($scope.easemobParam));
			$state.go("easemobmain",{id: $stateParams.id});
		}
	})
})

//咨询和订单的一对一咨询 - 即时通讯
lvtuanApp.controller("easemobmainCtrl",function($scope,$http,$state,$rootScope,$stateParams){
    var easemob = JSON.parse(localStorage.getItem('easemobParam'));
    if(easemob != null){
		$("#user_name").val("");
		$("#user_password").val("");
		$scope.user_name = easemob.easemob_id;
		$scope.user_password = easemob.easemob_pwd;
		$scope.curChatUserId = easemob.curChatUserId;
    }

	$scope.jwtToken = localStorage.getItem('jwtToken');
	console.info($scope.jwtToken);
	var time = null;
	time = setInterval(function() { 
		if(getuserpwd(easemob) == true){
    		if(angular.isDefined(login)){
    			login();
    			console.info('login()');
    			clearInterval(time);
    		}
    	}
	}, 1000);
	
	function getuserpwd(itmes){
		var name = $("#user_name").val();
    	var pwd = $("#user_password").val();
    	if(name != null && pwd != null){
    		if(name == itmes.easemob_id && pwd == itmes.easemob_pwd){
    			return true;
    		}
    	}else{
    		return false;
    	}
	}

})


/*———————————————————————————— 我的律团 - 用户的律团 ————————————————————————————*/
//首页 - 我的律团 - 用户的工作台
lvtuanApp.controller("userlvtuanCtrl",function($scope,$rootScope){
	console.info("律师的律团");
})

//用户的工作 - 咨询 － 全部
lvtuanApp.controller("questionAllCtrl",function($http,$scope,$rootScope,listHelper,httpWrapper){
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
	$scope.ask = function(id){
		location.href='#/easemobinit/'+id;
	}

	//送心意
	$scope.send = function(id){
		location.href='#/send/mind/'+id;
	}

	//评价
	$scope.evaluate = function(id,index){
		$scope.items.splice(index, 1);
		location.href='#/confirmCompletion/'+id;
	}

})

//用户的工作 - 咨询 － 待受理
lvtuanApp.controller("questionNewCtrl",function($scope,$rootScope,$http,listHelper,httpWrapper){
	listHelper.bootstrap('/center/question/new', $scope);

	//取消
	$scope.cancel = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/cancel','post',null,
			function(data){
				$scope.items.splice(index, 1);
				layer.show("取消成功！");
			},function(data){
				console.info(data);
			}
		);
	}
})

//用户的工作 - 咨询 － 待确认
lvtuanApp.controller("questionRepliedCtrl",function($http,$scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/question/replied', $scope);
	//确认
	$scope.complete = function(id,index){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/to_complete','post',null,
			function(data){
				layer.show("确认成功！");
				$scope.items.splice(index, 1);
				location.href='#/userquestion/waitforconfirmation';
			},function(data){
				console.info(data);
			}
		);
	}
	//联系律师
	$scope.ask = function(id){
		location.href='#/easemobinit/'+id;
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
		  }
}])

//用户 - 我的咨询 - 详情
lvtuanApp.controller("userquestionviewCtrl",function($http,$scope,$stateParams,$rootScope,httpWrapper){
	httpWrapper.get('http://'+$rootScope.hostName+'/center/question/'+$stateParams.id+'/view', function(data){
		$scope.items = data.data;
	});

	//删除
	$scope.remove = function(id){
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
	$scope.cancel = function(id){
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
	$scope.to_complete = function(id){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/to_complete','post',null,
			function(data){
				layer.show("确认成功！");
				location.href='#/userquestion/waitforconfirmation';
			},function(data){
				console.info(data);
			}
		);
	}
	//联系律师
	$scope.ask = function(id){
		location.href='#/easemobinit/'+id;
	}
	//送心意
	$scope.send = function(id){
		location.href='#/send/mind/'+id;
	}
	//评价
	$scope.evaluate = function(id,index){
		$scope.items.splice(index, 1);
		location.href='#/confirmCompletion/'+id;
	}
})

//用户 - 我的咨询 - 送心意
lvtuanApp.controller("sendmindCtrl",function($http,$scope,$rootScope,$stateParams){
	$scope.submit = function(){
		var money = $scope.user.money;
		if(money <= 0){
			layer.show("金额不能小于0！");
			return false
		}
		if(money > 1000000){
			layer.show("金额不能大于1000000！");
			return false
		}

		$http.post('http://'+$rootScope.hostName+'/wallet/reward',
			{
				user_id : $stateParams.id,
				money	: money
			}
		)
		.success(function(data) {
			layer.show("送心意成功。");
			$scope.user = {};
		})
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
	$scope.ask = function(id){
		location.href='#/easemobinit/'+id;
	}

	//付款
	$scope.pay = function(id){
		location.href='#/pay/'+id+'?type=question';
	}

	//评价
	$scope.evaluate = function(id,index){
		$scope.items.splice(index, 1);
		location.href='#/confirmCompletion/'+id;
	}

})

//用户的订单 - 待付款
lvtuanApp.controller("userorderPendingCtrl",function($http,$scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/pay/question/waitpay', $scope);
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
	//付款
	$scope.pay = function(id){
		location.href='#/pay/'+id+'?type=question';
	}
})
//用户的订单 - 待受理
lvtuanApp.controller("userorderNewCtrl",function($scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/pay/question/new', $scope);
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

})
//用户的订单 - 待确认
lvtuanApp.controller("userorderRepliedCtrl",function($http,$scope,$rootScope,listHelper,httpWrapper){
	listHelper.bootstrap('/center/pay/question/replied', $scope);
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
	$scope.ask = function(id){
		location.href='#/easemobinit/'+id;
	}
})
//用户的订单 - 待评价
lvtuanApp.controller("userorderWaitforevaluationCtrl",function($scope,listHelper){
	listHelper.bootstrap('/center/pay/question/waitforevaluation', $scope);
	//评价
	$scope.evaluate = function(id,index){
		$scope.items.splice(index, 1);
		location.href='#/confirmCompletion/'+id;
	}
})


//用户的订单 - 订单详情
lvtuanApp.controller("userOrderDetailCtrl",function($http,$scope,$state,$rootScope,$stateParams){
	$http.get('http://'+$rootScope.hostName+'/center/pay/question/'+$stateParams.id+'/view')
		.success(function(data) {
			if(data && data.data){
				$scope.item = data.data; 
				return true;
			}else{
				layer.show('暂无数据！');
				return false;
			}
		})

	//删除
	$scope.remove = function(id){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/remove','post',null,
			function(data){
				layer.show("删除成功！");
				location.href='#/orderuser/pending';
			},function(data){
				console.info(data);
			}
		);
	}
	//付款
	$scope.pay = function(id){
		location.href='#/pay/'+id+'?type=question';
	}    

	//取消
	$scope.cancel = function(id){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/cancel','post',null,
			function(data){
				layer.show("取消成功！");
				location.href='#/orderuser/new';
			},function(data){
				console.info(data);
			}
		);
	}
})

/*———————————————————————————— 首页 - 法律文书 ————————————————————————————*/
//首页 - 法律文书
//法律文书
lvtuanApp.controller("documentlistCtrl",function($http,$scope,$state,$rootScope,$timeout,$ionicLoading){

	//选择类型
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
		.success(function(data) {
	      if(data.data){
	        $scope.workscopes = data.data;
	        sessionStorage.setItem("key", JSON.stringify($scope.workscopes[0].key));
	        getParams($scope.workscopes[0].key);
	        $ionicLoading.hide();
	      }else{
	      	layer.show("暂无数据！");
	      }
	    })

	$scope.inShowscopes = function(key) {
		var value = false;
		$scope.key = JSON.parse(sessionStorage.getItem('key'));
		if (key == $scope.key) {
			value = true;
		}
		return value;
	}

	var page = 1; //页数
	var rows_per_page = 5; // 每页的数量
	if ($scope.rows_per_page) {
		rows_per_page = $scope.rows_per_page;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据
    //下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        $scope.loadMore();
        $scope.$broadcast('scroll.refreshComplete');
    };

    //上拉加载
	$scope.loadMore = function() {
		$scope.key = JSON.parse(sessionStorage.getItem('key'));
		getParams($scope.key);
	};

	$scope.ngClick_list = function(key){
		page = 1;
		$scope.items = [];
		sessionStorage.setItem("key", JSON.stringify(key));
		getParams(key);
		
	}
	
	function getParams(key){
		$ionicLoading.show();
		var url = 'http://'+$rootScope.hostName+'/knowledge/document/list_documents?cat_id='+key+'&rows_per_page='+rows_per_page+'&page='+page;
		$http.get(url)
			.success(function(data) {
	        	console.info(data.data)
	        	if(data && data.data && data.data.length){
					$scope.items = $scope.items.concat(data.data);
					console.info($scope.items);
					if (data.data.length < rows_per_page) {
						$scope.moredata = false;
					} else {
						$scope.moredata = true;
					}
				}else{
					if (page == 1) {
						layer.show('暂无数据！');
					}
					$scope.moredata = false;
				}
				page++;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			})
	}

})
//法律文书 - 搜索
lvtuanApp.controller("documentlistsearchCtrl",function($http,$scope,$state,$rootScope,$timeout,$ionicLoading){
	var page = 1; //页数
	var rows_per_page = 5; // 每页的数量
	if ($scope.rows_per_page) {
		rows_per_page = $scope.rows_per_page;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

	//搜索问题
	$scope.q = '';
	$scope.$watch('q', function(newVal, oldVal) {
		if(newVal !== oldVal){
			page = 1;
			$scope.items = [];
	        $scope.loadMore();
	    }
	});

	//下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        $scope.loadMore();
        $scope.$broadcast('scroll.refreshComplete');
    };

    //上拉加载
	$scope.loadMore = function() {
		var params = layer.getParams("#searchForm");
		var url = "";
		if(params.q != ""){
			url = 'http://'+$rootScope.hostName+'/knowledge/document/list_documents?q='+params.q+'&rows_per_page='+rows_per_page+'&page='+page;
			$ionicLoading.show();
			$http.get(url)
				.success(function(data) {
					if(data && data.data && data.data.length){
						$scope.items = $scope.items.concat(data.data);
						console.info($scope.items);
						if (data.data.length < rows_per_page) {
							$scope.moredata = false;
						} else {
							$scope.moredata = true;
						}
					}else{
						if (page == 1) {
							layer.show('暂无数据！');
						}
						$scope.moredata = false;
					}
					page++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$ionicLoading.hide();
				})
		}else{
			$scope.moredata = false;
	    	return false;
	    }
		
	};

	$scope.$on('$stateChangeSuccess', function() {
	    $scope.loadMore();
	})
})

//法律文书 - 详情 - 下载
lvtuanApp.controller("documentownloadlistCtrl",function($http,$scope,$state,$rootScope,$stateParams){
	$http.get('http://'+$rootScope.hostName+'/knowledge/document/'+$stateParams.id+'/view')
	.success(function(data) {
    	console.info('法律文书详情',data.data)
    	$scope.itmes = data.data;
	})
})

//小微企服
lvtuanApp.controller("corporateservicesCtrl",function($http,$scope,$state,$rootScope,$stateParams){

	$scope.counsels = [
					{	
						"img"		:'01.png',
						"title"		:"防范合同风险",
						"content" 	: "商务合同、法律文书一审再审，专业填坑我最强"
					},
					{	
						"img"		:'02.png',
						"title"		:"避免劳资纠纷",
						"content" 	: "从员工入职到离职，全流程风险预警与控制，有效避免劳资纠纷"
					},
					{	
						"img"		:'03.png',
						"title"		:"维护企业权益",
						"content" 	: "一旦企业权益受损，务必全力维权，将损失降至最低"
					},
					{	
						"img"		:'04.png',
						"title"		:"法律风险评估",
						"content" 	: "定期进行专业的企业法律风险评估，并提供靠谱的整改意见"
					},
					{	
						"img"		:'05.png',
						"title"		:"节约时间成本",
						"content" 	: "专业的事交给专业的律师来做，您可以专心管理和经营企业"
					},
					{	
						"img"		:'06.png',
						"title"		:"案件委托优惠",
						"content" 	: "个案委托八五折起，您可以省下大笔律师费，用于企业发展"
					}
				];

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
		})
	};

})

//小微企服
lvtuanApp.controller("corporatelistCtrl",function($scope,$state,$http,$rootScope,$stateParams,$ionicPopup,$timeout,$ionicLoading){

	$scope.counsels = {
		"counsels_8800"	:{
			"id":'1',
			"title": "企业法律顾问银卡提供的服务",
            "money": "8800元/年(两年起签)",                         
            "banner_img": "banner_1.png", 
			"counsels_arry" :[
				{	
					"title"		:'电话咨询',
					"content" 	: "不限次，无论您遇到什么问题，一个电话随时连线律师。找律师，从未如此简单。"
				},
				{	
					"title"		:"风险诊断",
					"content" 	: "不限次，企业经营、决策过程中有任何不确定的风险、困惑，我们负责帮您诊断。"
				},
				{	
					"title"		:"文件下载",
					"content" 	: "不限次，由专业律师团队精心整理、审阅过的海量实用文书，您可免费任意下载。"
				},
				{	
					"title"		:"免费律师函",
					"content" 	: "2份，一旦企业权益受损，我们将帮您发出律师函，以及时制止不法的侵权行为。"
				},
				{	
					"title"		:"法律文书制作、修改",
					"content" 	: "5份，企业经营过程中涉及的各类法律文书的制作、修改及审核，包您高枕无忧。"
				},
				{	
					"title"		:"企业管理制度全面规划化",
					"content" 	: "1次，对企业的管理规章制度进行全方位的合法性审查，并给出专业的规划建议。"
				},
				{	
					"title"		:'律师在所会面',
					"content" 	: "2次，在律团的办公场所为您面对面地提供直接、高效的法律服务。服务内容任选。"
				},
				{	
					"title"		:"网上法律实务培训",
					"content" 	: "2次，我们将在网上为您公司的全体员工进行法律实务的专业培训，包括训后咨询。"
				},
				{	
					"title"		:"企业风险评估及整改意见",
					"content" 	: "1份，对您的企业进行专业、全面的法律风险评估，并且提供靠谱的整改意见。"
				},
				{	
					"title"		:"年终企业法律顾问服务总结报告",
					"content" 	: "1份，我们将给出服务期内（一年）法律顾问服务的总结性报告，以供分析、参考。"
				},
				{	
					"title"		:"个案委托",
					"content" 	: "八五折，在法律顾问服务期间，您公司的案件委托一律八五折，不限案件性质及范围。"
				}
			]
		},
		"counsels_18800"	:{
			"id":'2',
			"title": "企业法律顾问金卡提供的服务",
            "money": "18800元/年(一年起签)",                         
            "banner_img": "banner_2.png", 
			"counsels_arry" :[
				{   
                    "title"     :'电话咨询',
                    "content"   :'不限次，无论您遇到什么问题，一个电话随时连线律师。找律师，从未如此简单。',
                },
                {   
                    "title"     :'风险诊断',
                    "content"   :'不限次，企业经营、决策过程中有任何不确定的风险、困惑，我们负责帮您诊断。',

                },
                {   
                    "title"     :'免费律师函',
                    "content"   :'4份，一旦企业权益受损，我们将帮您发出律师函，以及时制止不法的侵权行为。',

                },
                {   
                    "title"     :'法律文书制作、修改',
                    "content"   :'10份，企业经营过程中涉及的各类法律文书的制作、修改及审核，包您高枕无忧。',

                },
                {   
                    "title"     :'企业管理制度全面规划化',
                    "content"   :'1次，对企业的管理规章制度进行全方位的合法性审查，并给出专业的规划建议。',

                },
                {   
                    "title"     :'律师在所会面',
                    "content"   :'4次，在律团的办公场所为您面对面地提供直接、高效的法律服务。服务内容任选。',

                },
                {   
                    "title"     :'上门法律实务培训',
                    "content"   :'1次，我们将拜访您的公司并为全体员工进行法律实务的专业培训，包括训后咨询。',

                },
                {   
                    "title"     :'企业风险评估及整改意见',
                    "content"   :'1份，对您的企业进行专业、全面的法律风险评估，并且提供靠谱的整改意见。',

                },
                {   
                    "title"     :'年终企业法律顾问服务总结报告',
                    "content"   :'1份，我们将给出服务期内（一年）法律顾问服务的总结性报告，以供分析、参考。',

                },
                {   
                    "title"     :'个案委托',
                    "content"   :'八五折，在法律顾问服务期间，您公司的案件委托一律八五折，不限案件性质及范围。',
                }
			]
		},
		"counsels_28800"	:{
			"id":'3',
			"title": "企业法律顾问金卡提供的服务",
            "money": "28800元/年(一年起签)",                         
            "banner_img": "banner_3.png", 
			"counsels_arry" :[
				{   
                    "title"     :'电话咨',
                    "content"   :'不限次，无论您遇到什么问题，一个电话随时连线律师。找律师，从未如此简单。',
                },
                {   
                    "title"     :'风险诊断',
                    "content"   :'不限次，企业经营、决策过程中有任何不确定的风险、困惑，我们负责帮您诊断。',

                },
                {   
                    "title"     :'免费律师函',
                    "content"   :'8份，一旦企业权益受损，我们将帮您发出律师函，以及时制止不法的侵权行为。',

                },
                {   
                    "title"     :'法律文书制作、修改',
                    "content"   :'15份，企业经营过程中涉及的各类法律文书的制作、修改及审核，包您高枕无忧。',

                },
                {   
                    "title"     :'企业管理制度全面规划化',
                    "content"   :'1次，对企业的管理规章制度进行全方位的合法性审查，并给出专业的规划建议。',

                },
                {   
                    "title"     :'律师在所会面',
                    "content"   :'6次，在律团的办公场所为您面对面地提供直接、高效的法律服务。服务内容任选。',

                },
                {   
                    "title"     :'上门法律实务培训',
                    "content"   :'2次，我们将拜访您的公司并为全体员工进行法律实务的专业培训，包括训后咨询。',

                },
                {   
                    "title"     :'企业风险评估及整改意见',
                    "content"   :'1份，对您的企业进行专业、全面的法律风险评估，并且提供靠谱的整改意见。',

                },
                {   
                    "title"     :'年终企业法律顾问服务总结报告',
                    "content"   :'1份，我们将给出服务期内（一年）法律顾问服务的总结性报告，以供分析、参考。',

                },
                {   
                    "title"     :'个案委托',
                    "content"   :'八五折，在法律顾问服务期间，您公司的案件委托一律八五折，不限案件性质及范围。',
                }
			]
		}
	}
	
	$scope.items = null;
	switch($stateParams.id) {
      	case "1":
      		$scope.items = $scope.counsels.counsels_8800;
    		break;
      	case "2":
    		$scope.items = $scope.counsels.counsels_18800;
    		break;
    	case "3":
    		$scope.items = $scope.counsels.counsels_28800;
    		break;
    }

})

//立即购买
lvtuanApp.controller("corporatebuynowCtrl",function($scope,$http,$rootScope,$stateParams,$ionicLoading,$localStorage,$location){
	$scope.user = {};
	$scope.addres_param = {};
	$scope.addres = $localStorage.addres || "";
	$scope.$watch('addres', function(newVal, oldVal) {
		// 监听变化，并获取参数的最新值
	    console.log('newVal: ', newVal);   
	    $localStorage.addres = $scope.addres;
	    $scope.addres_param = $localStorage.addres;
	    if($scope.addres_param){
	    	$scope.user = {
					address : $scope.addres_param.province.value +" "+ $scope.addres_param.city.value +" "+ $scope.addres_param.district.value
				}
	   	 	console.info('address',$scope.address);
	    }else{
	    	$scope.user = {
						address : ""
					}
	    }
	});
	$scope.$watch(function() {
	    return angular.toJson($localStorage);
	}, function() {
	    $scope.addres = $localStorage.addres;
	    console.info($scope.addres);
	});

	//获取省市区
	$scope.getAddress = function(){
		delete $localStorage.addres;
		localStorage.setItem("citypicke_goback", $location.path());
		location.href='#/citypicke/all';
	}

	console.log($stateParams.id);

	$scope.submit = function(user){
		$ionicLoading.show();
		var param = {};
		var province =  $scope.addres_param.province.key;
		var city =  $scope.addres_param.city.key;
		var district =  $scope.addres_param.district.key;

		if(user.email){
			param['email'] = user.email;
		}
		if(user.company_name){
			param['company_name'] = user.company_name;
		}
		if(user.memo){
			param['memo'] = user.memo;
		}
		if(province){
			param['province'] = province;
		}
		if(city){
			param['city'] = city;
		}
		if(district){
			param['district'] = district;
		}
		if(user.invoice == true){
			param['invoice'] = 'Y';
		}else{
			param['invoice'] = 'N';
		}
		if($stateParams.id){
			param['product_id'] = $stateParams.id;
		}
		console.info(param);
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/company/order/submit',param)
			.success(function(data) {
				$ionicLoading.hide();
	        	console.log(data.data);
                $scope.user = {};
                delete $localStorage.addres;
				location.href='#/pay/'+data.data.post.id+'?type=order';
	        });
		
	}
})


//用户律师 - 钱包
lvtuanApp.controller("userwalletCtrl",function($scope,$http,$rootScope,authService,$ionicLoading){

	$scope.$on('$ionicView.beforeEnter', function() {  
		
		//判断是否是律师
		var currentUser = authService.getUser();
		var timestamp=Math.round(new Date().getTime()/1000);
		$scope.items = {};
		$ionicLoading.show();
		if(currentUser.status == 1 || currentUser.status == 2){
			$http.get('http://'+$rootScope.hostName+'/center/customer/wallet?ts='+timestamp)
				.success(function(data) {
					if (data && data.data) {
						$scope.items = data.data; 
						sessionStorage.setItem("summoney", $scope.items.money);
					}
					$ionicLoading.hide();
				})
		}else{
			$http.get('http://'+$rootScope.hostName+'/center/lawyer/wallet?ts='+timestamp)
			.success(function(data) {
				if (data && data.data) {
					$scope.items = data.data; 
					localStorage.setItem("summoney", $scope.items.money);
				}
				$ionicLoading.hide();
			})
		}

	});
})

lvtuanApp.controller("wxCheckOpenIdCtrl",function($scope,$http,$rootScope,$stateParams,authService,wxService){
	$scope.$on('$ionicView.beforeEnter', function() {
		if (!wxService.getOpenId()) {
			window.location.replace(wxService.getWxAuthUrl('/wxauthpayment'));
		} else {
			location.href = "#/user/moneyin";
		}
	})
})

//获取openid以供支付使用 
lvtuanApp.controller("wxAuthPaymentCtrl",function($scope,$http,$rootScope,$stateParams,authService,wxService,$ionicLoading){
	var code = $stateParams.code;
	var state = $stateParams.state;

	$ionicLoading.show();
  	$http.get('http://' + AppSettings.baseApiUrl + '/openid?code='+code+'&state='+state).then(
    	function (res) {
	    	var authData = res.data ? res.data.data : null;
			wxService.saveOpenId(authData.openid);
			$ionicLoading.hide();
			location.href = "#/user/moneyin";	
    	}
    ).catch(function(response) {
	  	console.error('Gists error', response.status, response.data);
	  	if (response.status === 400) {
	  	}
	});
})

//用户律师 - 钱包充值
lvtuanApp.controller("usermoneyinCtrl",function($scope,$http,$rootScope,$stateParams,authService,wxService,$ionicLoading){
	var self = this;
	var currentUser = authService.getUser();

	$scope.summoney = sessionStorage.getItem('summoney');
	var params = null;

	$scope.$on('$ionicView.beforeEnter', function() {
		console.info(sessionStorage.getItem('summoney'));
		$scope.summoney = sessionStorage.getItem('summoney');
	});

	self.jsApiCall = function(user)
	{
		if (wxService.getOpenId()) {
			var attach_params = {};
			attach_params.platform = 'wechat';
			attach_params.type = 'wallet';
			attach_params.user_id = currentUser.id;
			attach_params.money = user.money;
			attach_str = JSON.stringify(attach_params);
			var timestamp=Math.round(new Date().getTime()/1000);
			$ionicLoading.show();
			$http.get('http://'+$rootScope.hostName+'/payment/jsapiparams/'+wxService.getOpenId()+'/'+attach_str+'?ts='+timestamp,{
			}).success(function(data) {
				$ionicLoading.hide();
				console.info(data);
				if (data && data.data && data.data.params) {
					self.params = data.data.params;
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest',
						self.params,
						function(res){
							WeixinJSBridge.log(res.err_msg);
							switch(res.err_msg) {
								case "get_brand_wcpay_request:ok":
									location.href='#/user/wallet';
								    sessionStorage.setItem('summoney', sessionStorage.getItem('summoney')+user.money);
									layer.show("充值成功。");
									break;
								case "get_brand_wcpay_request:fail":
									layer.show("充值失败，请稍候再试。");
									break;
								case "get_brand_wcpay_request:cancel":
									layer.show("您已取消充值。");
									$state.go("user/wallet");
									break;
							}
						}
					);
				}
			});
		} else {
			layer.show("用户需要先通过微信登录才可以使用这个功能");
		}
	}

	self.callpay = function(user)
	{
		if (typeof WeixinJSBridge == "undefined"){
		    if( document.addEventListener ){
		        document.addEventListener('WeixinJSBridgeReady', self.jsApiCall(user), false);
		    }else if (document.attachEvent){
		        document.attachEvent('WeixinJSBridgeReady', self.jsApiCall(user)); 
		        document.attachEvent('onWeixinJSBridgeReady', self.jsApiCall(user));
		    }
		}else{
		    self.jsApiCall(user);
		}
	}

	$scope.submit = function(user){
		self.callpay(user);
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
	$scope.summoney = sessionStorage.getItem('summoney');
	$scope.submit = function(user){
		$http.post('http://'+$rootScope.hostName+'/wallet/withdraw',user)
			.success(function(data) {
	        	$scope.items = data.data;
	        	console.info($scope.items);
	        	sessionStorage.setItem("summoney", $scope.items.money);
	        	$scope.summoney = $scope.items.money;
	            layer.show("提交成功！");
	            $scope.user = {};
	            console.info($scope.user)

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
lvtuanApp.controller("payCtrl",function($scope,$http,$rootScope,$stateParams,$ionicPopup,listHelper,authService,wxService,$ionicLoading){
	$scope.user = {};
        $ionicLoading.show();
        $http.get('http://'+$rootScope.hostName+'/center/pay/question/'+$stateParams.id+'/view')
        .success(function(data) {
                $ionicLoading.hide();
                if(data && data.data){
                        $scope.item = data.data;
                        console.info($scope.item);
                        return true;
                }else{
                        layer.show('暂无数据！');
                        return false;
                }
        })

        $scope.obj = "";
        $scope.change = function(val){
            $scope.obj = val;
        }
            //微信支付
        $scope.pay = function(user){
            var currentUser = authService.getUser();
            console.info($scope.obj);
            if(user.radioval == 'weixin'){
                var attach_params = {};
                attach_params.platform = 'wechat';
	            attach_params.type = $stateParams.type;
	            attach_params.item_id = $stateParams.id;
	            attach_params.user_id = currentUser.id;
	            attach_params.money = $scope.item.price;
	            attach_str = JSON.stringify(attach_params);
	            var timestamp=Math.round(new Date().getTime()/1000);
	            $ionicLoading.show();
	            $http.get('http://'+$rootScope.hostName+'/payment/jsapiparams/'+wxService.getOpenId()+'/'+attach_str+'?ts='+timestamp,{
	            }).success(function(data) {
                $ionicLoading.hide();
                console.info(data);
                if (data && data.data && data.data.params) {
                        self.params = data.data.params;
                        WeixinJSBridge.invoke(
                                'getBrandWCPayRequest',
                                self.params,
                                function(res){
                                        WeixinJSBridge.log(res.err_msg);
                                        switch(res.err_msg) {
                                                case "get_brand_wcpay_request:ok":
                                                        $ionicLoading.show();
                                                        location.href='#/orderuser/new';
                                                        break;
                                                case "get_brand_wcpay_request:fail":
                                                        layer.show("支付失败，请稍候再试。");
                                                        break;
                                                case "get_brand_wcpay_request:cancel":
                                                        layer.show("您已取消支付。");
                                                        break;
                                        }
                                }
                        );
                }
            });
                }else if (user.radioval == 'qianbao') {
                        var confirmPopup = $ionicPopup.confirm({
                   title: '是否立即付款？',
                   cancelText: '取消',
                   okText: '确认',
                 });
                 confirmPopup.then(function(res) {
                   if(res) {
                        $http.post('http://'+$rootScope.hostName+'/center/question/'+$stateParams.id+'/wallet/pay',{},
                        {
                            headers: {
                                'Content-Type': 'application/json' ,
                                'Authorization': 'bearer ' + $rootScope.token,
                            }
                        }).success(function(data) {
                            $scope.items = data.data;
                            layer.show("付款成功！");
                            location.href='#/orderuser/new';
                        });
                   }else{
                     return false;
                   }
                 });
                } else {
			layer.show("请先选择支付方式");
		}
        }

})


lvtuanApp.controller("citypickerCtrl",function($http,$location,$scope,$rootScope,$anchorScroll,$ionicHistory,$stateParams,$ionicLoading,$ionicScrollDelegate,locationService){
	//获取地址定位 根据a-z排序显示
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/area/province/letters')
	.success(function(data) {
		$scope.provinces = data.data;
		$ionicLoading.hide();
	})

	$scope.str = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

	//设置
	$scope.goto = function (id) {
        $location.hash(id);
        $anchorScroll();  //设置页内跳转锚点
    }

    $scope.province_city_id = null;
    $scope.province_city_name = null;
    //获取 省份
	$scope.province = function(val){
		$scope.province_city_id = val.key;
    	$scope.province_city_name = val.value;

		$(".citypicker .province,.navbar").hide();
		$scope.province = val.key;
		$(".citypicker .cities").show();
		getCityParm($scope.province);
		//回到顶部
		$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
	}

	//获取 市区
	function getCityParm(province){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/area/'+province+'/city')
		.success(function(data) {
			if(data && data.data && data.data.length){
        		$scope.citys = data.data; 
        	}else{
        		$scope.items = {
					'city_id' : angular.toJson($scope.province_city_id, true),
					'city_name' : $scope.province_city_name
				}
				locationServices($scope.items);
        	}
        	$ionicLoading.hide();
		})
	}

	$scope.citie = function(val){
		$(".citypicker .province,.citypicker .cities").hide();
		$scope.items = {
			'city_id' : angular.toJson(val.key, true),
			'city_name' : val.value
		}
		
		locationServices($scope.items);
	}
	
	//公共调用服务器返回来的数据并且显示到地址定位上
	function locationServices(obj){
		var locations = locationService.getLocation();

		locations.city_id = obj.city_id;
		locations.city_name = obj.city_name;
		locationService.saveLocation(locations);

		if($stateParams.id == "index"){
			location.href='#/index';
		}else{
			location.href='#/lawyerlist';
		}
	}

	$scope.jump_citypicke_GoBack = function(){
		$ionicHistory.goBack();
	}

})

lvtuanApp.controller("citypickeAllCtrl",function($http,$state,$location,$scope,$rootScope,$anchorScroll,$ionicHistory,$stateParams,$ionicLoading,$ionicScrollDelegate,$localStorage){

	//获取地址定位 根据a-z排序显示
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/area/province/letters')
	.success(function(data) {
		$scope.provinces = data.data;
		$ionicLoading.hide();
	})

	$scope.str = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

	//设置
	$scope.goto = function (id) {
        $location.hash(id);
        $anchorScroll();  //设置页内跳转锚点
    }

    $scope.province = null;
    $scope.city = null;
    $scope.district = null;
    //获取 省份
	$scope.province = function(province){
		$scope.province = province;
		$(".citypicker .province,.navbar").hide();
		$(".citypicker .cities").show();
		getCityParm($scope.province.key);
		//回到顶部
		$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
	}
	//获取 省份
	$scope.citie = function(city){
		$ionicLoading.show();
		$scope.city = city;
		$(".citypicker .province,.citypicker .cities").hide();
		$(".citypicker .districts").show();
		getDistrictsParm($scope.city.key);
		//回到顶部
		$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();

	}
	//获取 市
	$scope.district = function(district){
		$scope.addres = {
			'province' : $scope.province,
			'city' 	   : $scope.city,
			'district' : district
		};

		// 定义并初始化localStorage中的addres属性
		$scope.$storage = $localStorage.$default({
		    addres: $scope.addres
		});

		$scope.url = localStorage.getItem('citypicke_goback');
		console.info('#'+$scope.url);
		location.href='#'+$scope.url;


	}

	//获取 区
	function getCityParm(province){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/area/'+province+'/city')
		.success(function(data) {
			if(data && data.data && data.data.length){
        		$scope.citys = data.data; 
        	}
        	$ionicLoading.hide();
		})
	}

	//获取 区
	function getDistrictsParm(city){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/area/'+city+'/district')
		.success(function(data) {
			if(data && data.data && data.data.length){
        		$scope.districts = data.data; 
        	}
        	$ionicLoading.hide();
		})
	}

	$scope.jump_citypicke_GoBack = function(){
		$ionicHistory.goBack();
	}

})
