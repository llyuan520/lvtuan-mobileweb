var lvtuanApp = angular.module('app', ['ionic','ngSanitize','ngFileUpload','listModule','authModule','wxModule','locationModule','ngStorage','easemobModule','angular-jwt'])
lvtuanApp.constant("HOST", AppSettings.baseApiUrl)

lvtuanApp.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(5);
  // note that you can also chain configs
  $ionicConfigProvider.tabs.position("top");
});

lvtuanApp.controller("MainController",function($rootScope, $scope, $state, $location,$ionicHistory, $http, userService, authService, locationService){
	var self = this;

	// $ImageCacheFactory.Cache([
 //        "http://mobiledev.wdlst.lvtuan-pc-new/img/banner1-01.png",
 //        "http://mobiledev.wdlst.lvtuan-pc-new/img/banner1-02.png",
 //        "http://mobiledev.wdlst.lvtuan-pc-new/img/banner1-03.png"
 //    ]).then(function(){
 //        console.log("Images done loading!");
 //    });

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

	// 通过微信接口获取当前的地理位置，这会设置
	locationService.fetchLocation($scope);
	if (!locationService.sameLocation($scope.currentLocation)) {
		locationService.saveLocation($scope.currentLocation);
	}
	$scope.currentUser = authService.getUser();


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

	$scope.jumpGoBack_rel = function(){
		//$ionicHistory.goBack();
		 window.history.go(-1);
		//window.history.back();
		//window.location.reload();
	}

	// hack在微信等webview中无法修改document.title的情况
	/*var $body = $('body');    
	document.title = '律团';    
	var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {      
		setTimeout(function() {        
			$iframe.off('load').remove();      
		}, 0);    
	}).appendTo($body);*/


	//所有浏览器点击返回按钮的时候如果返回的上一级是支付页面的话就跳转到首页
	if (window.history && window.history.pushState) {
	    $(window).on('popstate', function () {
	        //var hashLocation = location.hash;
	        var current_State = history.state;
       		console.info(current_State);
       		if(current_State){
       			if(current_State.states == 'order' || current_State.states == 'becomenav'){
		       		window.location.replace('#/center');
		        }else if(current_State.states == 'areward'){
		       		window.location.replace('#/questionslist');
		        }
		        /*else{
		        	return false;
	        	}*/
       		}
	    });
	    //window.history.pushState('forward', null, './#forward');
	}

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


//显示星星 <i class="img"></i>
lvtuanApp.directive('star', function () {
  return {
    template: '<ul class="rating" ng-mouseleave="leave()">' +
        '<li ng-repeat="star in stars" ng-class="star" ng-click="click($index + 1)" ng-mouseover="over($index + 1)">' +
        '<i class="img"></i>' +
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
lvtuanApp.controller("indexCtrl",function($scope,$location,listHelper,locationService){

	if (locationService.getLocation()) {
		$scope.locations = locationService.getLocation();
		$scope.city = parseInt($scope.locations.city_id);
		listHelper.bootstrap('/lawyer/list_lawyers?is_recommended=1&city_id='+$scope.city, $scope);
	} else {
		listHelper.bootstrap('/lawyer/list_lawyers?is_recommended=1', $scope);
	}
 
})



//用户登陆
lvtuanApp.controller("loginCtrl",function($state,$scope,$rootScope,$http,userService,wxService){

	var format_email = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	var format_mobile = /^[1][0-9]{10}$/; 
	var format_number=/^[0-9]*$/;
	$scope.submit = function(user){
		$scope.post_id = JSON.parse(localStorage.getItem('post_id'));
		$scope.post_id_status = JSON.parse(localStorage.getItem('post_id_status'));
		if($scope.post_id_status == false){
			$scope.post_id_status = true;
			localStorage.setItem("post_id_status", JSON.stringify($scope.post_id_status));
		}
  		if(checkvaldata(user)){
  			var openid = wxService.getOpenId();
  			userService.login(user.username, user.password, openid, $scope.post_id);
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
lvtuanApp.controller("registerCtrl",function($scope,$rootScope,$http,$interval,$ionicLoading,$location,userService,authService,wxService){

	//第一次获取验证码后要60秒以后才能在次获取
	var t, timePromise;
	$scope.t = 60;  
	var runTiming = function(){
	  timePromise = $interval(function(){
			$scope.t -= 1;
			//console.info($scope.t);
			if($scope.t == 0){
				$scope.phone_disabled = true;
	  			$interval.cancel(timePromise);
	  			timePromise = undefined;
			}
	  }, 1000, 60);
	  return timePromise;
	}

	//获取验证码
	$scope.phone_disabled = true;
	$scope.phonecode = function(phone){
		$ionicLoading.show();
		$scope.t = 60;
		$interval.cancel(timePromise);
	  	timePromise = undefined;
		var param = 'phone='+phone;
		$scope.phone_disabled = false;
		$http.post('http://'+$rootScope.hostName+'/send-code?'+param
		).success(function(data) {
			runTiming();
            layer.show("验证码已发送到您的手机！");
            $ionicLoading.hide();
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
		$ionicLoading.show();
		$scope.post_id = JSON.parse(localStorage.getItem('post_id'));
		$scope.post_id_status = JSON.parse(localStorage.getItem('post_id_status'));
		if($scope.post_id_status == false){
			$scope.post_id_status = true;
			localStorage.setItem("post_id_status", JSON.stringify($scope.post_id_status));
		} 
		var openid = wxService.getOpenId();

		$http.post('http://'+$rootScope.hostName+'/register',
		{
			username  		: $scope.params.username,
			password  		: $scope.params.password,
			phonecode 		: $scope.params.phonecode,
			account_type	: "phone",
			openid          : openid,
			post_id 		: $scope.post_id
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

	    	var goback = sessionStorage.getItem("goback");
			if(goback == null || goback=="" || goback=="undefined"){
				location.href='#/index';
			}else{
    			location.href= goback;
			}
			sessionStorage.removeItem("goback");
            $ionicLoading.hide();
        });
     
	}
})

//修改密码
lvtuanApp.controller("resetpwdCtrl",function($scope,$http,$rootScope,$ionicLoading,$location){
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
			$ionicLoading.show();
			$http.post('http://'+$rootScope.hostName+'/center/reset_pass', $scope.user
  			).success(function(data) {
	           layer.show("修改成功！");
	           $scope.user = {}; //清空数据
	           location.href='#/login';
	           $ionicLoading.hide();
	        });
		}

	}
})

//忘记密码
lvtuanApp.controller("forgotpwdCtrl",function($scope,$http,$rootScope,$ionicLoading){
	$scope.user = {};
	//获取验证码
	$scope.phonecode = function(phone){
		console.info(phone);
		if(phone == undefined){
			layer.show("请输入手机号！");
			return false;
		}else{
			$ionicLoading.show();
			var param = 'phone='+phone;
			$http.post('http://'+$rootScope.hostName+'/send-code?'+param
			).success(function(data) {
				console.info(data)
	           layer.show("验证码已发送到您的手机！");
	           $ionicLoading.hide();
	        });
	        return true;
		}
	}
	//用户可以通过手机或者邮箱找回密码
	$scope.submit = function(user){
		console.info(user);
		$scope.user = user;
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/forgotpwd', $scope.user
			).success(function(data) {
           $scope.user = {}; //清空数据
           $scope.uid = data.data.uid;
           sessionStorage.setItem("uid", JSON.stringify($scope.uid));
           $("#forgotForm").hide();
           $("#upwdForm").show();
           $ionicLoading.hide();
        });
	}
})

//找回密码
lvtuanApp.controller("upwdCtrl",function($scope,$http,$rootScope,$ionicLoading,$location){

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
			$ionicLoading.show();
			$http.post('http://'+$rootScope.hostName+'/forgotpwd/resetpwd/'+$scope.uid, $scope.user
  			).success(function(data) {
	           layer.show("修改成功！");
	           sessionStorage.removeItem("uid");
	           $scope.user = {}; //清空数据
	           location.href='#/login';
	           $ionicLoading.hide();
	        });
		}

	}
})

//绑定手机
lvtuanApp.controller("boundphoneCtrl",function($scope,$http,$rootScope,$ionicLoading){
	$scope.user = {};
	//获取验证码
	$scope.phonecode = function(phone){
		console.info(phone);
		if(phone == undefined){
			layer.show("请输入手机号！");
			return false;
		}else{
			$ionicLoading.show();
			var param = 'phone='+phone;
			$http.post('http://'+$rootScope.hostName+'/send-code?'+param
			).success(function(data) {
				console.info(data)
	           layer.show("验证码已发送到您的手机！");
	           $ionicLoading.hide();
	        });
	        return true;
		}
	}
	//用户必须绑定手机号才能回到主页
	$scope.submit = function(user){
		console.info(user);
		/*$scope.user = user;
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/forgotpwd', $scope.user
			).success(function(data) {
           $scope.user = {}; //清空数据
           $scope.uid = data.data.uid;
           sessionStorage.setItem("uid", JSON.stringify($scope.uid));
           $("#forgotForm").hide();
           $("#upwdForm").show();
           $ionicLoading.hide();
        });*/
	}
})

/****************************************************** 微信 ******************************************************/
lvtuanApp.controller("wxAuthCtrl",function($scope,$stateParams,wxService,userService){
	// 获取code和state，通过后端进行登录
	$scope.post_id = JSON.parse(localStorage.getItem('post_id'));
	if($scope.post_id != null){
		$scope.post_id_status = true;
		localStorage.setItem("post_id_status", JSON.stringify($scope.post_id_status));
	}
	var openid = wxService.getOpenId();
	userService.loginWithWx(openid, $scope.post_id);
})

//自动跳转到微信授权登录页面
lvtuanApp.controller("wxLoginCtrl",function($scope,$http,$rootScope,wxService){
	window.location.href = wxService.getWxAuthUrl('/wxauth');
	//window.location.replace(wxService.getWxAuthUrl('/wxauth'));
})

/****************************************************** 律圈 ******************************************************/
//律圈
lvtuanApp.controller("groupCtrl",function($scope,$http,$state,$rootScope,$location,$ionicPopup){
	//跳转到登陆页面
	$scope.jumplogin = function(){
		console.info($rootScope.is_lawyer);
    	location.href='#/login';
	}

})
//律圈 - 列表
lvtuanApp.controller("groupListCtrl",function($http,$scope,$rootScope,$ionicLoading,$filter,listHelper){
	listHelper.bootstrap('/group/list/mine', $scope);
})

//格式化时间显示方式 - 过滤器
lvtuanApp.filter("formatdate", function() {
    var filterDate = function(thisdate) {
        var date = new Date(),
			syear = date.getFullYear().toString(), //年
			smonth = ((date.getMonth())+1).toString(), //月
			sday = date.getDate().toString(); //日
			if(smonth.length == 1){
				smonth = '0'+((date.getMonth())+1).toString();
			}
			if(sday.length == 1){
				sday = '0'+date.getDate().toString();
			}

			var str = thisdate;
			var arr = new Array();
				arr = str.split("-"),
				year = arr[0],
				month = arr[1],
				day = arr[2].substring(0, 2);
				time = arr[2].substring(3, 8);
			var reset = '';
				if(syear == year && smonth == month && sday == day){
					reset = '今天 '+time;
				}else{
					if((month.substring(0, 1)).toString() == '0'){
						month = month.substring(1);
					}
					if((day.substring(0, 1)).toString() == '0'){
						day = day.substring(1);
					}
					reset = month +'月'+ day +'日 '+ time;
				}

			return reset;
    };
    return filterDate;
});


//律圈 - 推荐关注
lvtuanApp.controller("groupAttentionCtrl",function($scope,$http,$state,$rootScope,$ionicLoading,listHelper){

	listHelper.bootstrap('/group/recommend', $scope);

	//加入关注
	$scope.groupjoin = function(id,index){
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/group/'+id+'/join',
			{},
	        {
		        cache: true,
		        headers: {
		            'Accept': 'application/json'
		       	}
	        }).success(function(data) {
				if(data && data.data){
					//更新当前这条数据
					$scope.items.splice(index, 1);

					layer.show("已关注 加入成功！");
					$ionicLoading.hide();
				}else{
					layer.show("暂无数据！");
					$scope.moredata = false;
					return false;
				}
			})
	}
})

//律圈 - 推荐关注 - 搜索
lvtuanApp.controller("groupAttentionSearchCtrl",function($http,$scope,$state,$rootScope,$ionicLoading){
	angular.element('.search').trigger('focus');
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
		if (newVal && newVal !== oldVal) {
			page = 1;
			$scope.items = [];
	        $scope.loadMore();
	    }else{
	    	page = 1;
			$scope.items = [];
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
			url = 'http://'+$rootScope.hostName+'/group/recommend?q='+params.q+'&rows_per_page='+rows_per_page+'&page='+page;
			console.info(url);
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
							$scope.moredata = false;
							$scope.nodata = false;
							//layer.show('暂无数据！');
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


	//加入关注
	$scope.groupjoin = function(id,index){
		var page = 1;
		var id = id;
		$http.post('http://'+$rootScope.hostName+'/group/'+id+'/join?rows_per_page='+rows_per_page+'&page='+page++,
			{},
	        {
		        cache: true,
		        headers: {
		            'Accept': 'application/json'
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

lvtuanApp.controller("groupviewCtrl",function($scope,$http,$state,$rootScope,$stateParams,$ionicLoading,easemobService,authService){
	
	$scope.$on('$locationChangeSuccess', function(newState,oldState) {  
		if(newState != oldState){
			window.location.reload();
		}else{
			return false;
		}	
	})
	var currentUser = authService.getUser();
		currentUser.associate_id = $stateParams.id;
		localStorage.setItem('currentUser', JSON.stringify(currentUser));

	$scope.$on('$ionicView.beforeEnter', function() {  
		$ionicLoading.show();
		var timestamp=Math.round(new Date().getTime()/1000);
	    $http.get('http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/chat?ts='+timestamp
	    ).success(function(data) {
	        if (data && data.data) {
	            $scope.items = data.data;
	            $scope.group_name = $scope.items.group_name.length > 9 ? $scope.items.group_name.substring(0, 9) + '...' : $scope.items.group_name;

	            var curRoomId = $scope.items.easemob_id;
	            
				$scope.curChatUserId = curRoomId;
				$scope.curUserId = $scope.items.user_id;

				easemobService.init(curRoomId,"groupchat");
				easemobService.login($scope.items.user_id.toString(),$scope.items.pwd);
                    console.info('圈子',$scope.items);
                }
                $ionicLoading.hide();
            })
        });
	
	$scope.site = function(id){
		location.href='#/group/site/'+id;
	}

    var page = 1;
    var rows_per_page = 10;

	$scope.loadMore = function() {
	    var str = '';
	    var url = 'http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/records?page='+page+'&rows_per_page='+rows_per_page;

		$ionicLoading.show();
		$http.get(url)
		.success(function(data) {
            obj = data.data;
            console.info(obj);
        	for(var i=0; i<obj.length; i++){
	                style = "left";
	                if(obj[i].from != $scope.curUserId) {
	                    str+='<div class="easemobmain-record img-right" style="text-align:right;">';
	                    str+='<p1>'+obj[i].created_at+'<span></span></p1>';
	                	str+='<p2>'+obj[i].sender_realname+'<b></b></p2>';
	                } else {
	                    str+='<div class="easemobmain-record img-left" style="text-align:left;">';
	                    str+='<p1>'+obj[i].sender_realname+'<span></span></p1>';
	                	str+='<p2>'+obj[i].created_at+'<b></b></p2>';
	                }
	                
	                str+='<img src='+obj[i].sender_avatar+'><br>';
	                str+='<p3 class="chat-content-p3" className="chat-content-p3">'+obj[i].content+'</p3>';
	                str+='</div>';
            }
            
            if(obj.length < rows_per_page) {
            	$("#comments-list").hide();
            }
            $("#page").after(str);
            $("#page").css('display', 'none');
            page++;
            $ionicLoading.hide();
		}).error(function(data) {
            console.info(data);
            var error =  $.parseJSON(data.responseText);
            layer.show(error.error_messages);
            console.info(error);
		});
	}

	$scope.sendText = function() {
		var result = easemobService.sendText("groupchat");
		console.log(result);
		/*var comment = $('#talkInputId').val();
		if (result) {
			$scope.saveComment(comment);
		}*/
	}

})

//律圈设置
lvtuanApp.controller("groupsiteCtrl",function($scope,$http,$state,$rootScope,$stateParams,$timeout,$ionicPopup,$location,Upload,$ionicLoading){
	console.info("律圈设置");
	var exclude = [];
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/detail'
        ).success(function(data) {
        	if (data && data.data) {
				$scope.items =data.data; 
				console.info($scope.items);
				var obj = $scope.items.members;
				angular.forEach(obj, function(data){
				 if(data.user_id){
				 	exclude.push(data.user_id);
				 }
				});
				sessionStorage.setItem("exclude", JSON.stringify(exclude));
				console.info(exclude);
			
				$scope.group_name = $scope.items.group_name;
				$scope.is_mine = $scope.items.is_mine;

				//$scope.view_title = $scope.is_mine == true ? '律圈设置' : '律圈设置';
				$scope.file = $scope.items.group_avatar;
			}
			$ionicLoading.hide();
		})

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
			            'Content-Type': 'application/json' 
			       		}
			        }).success(function(data) {
			        	layer.show(data.data);
			        	$location.path('/group/list');
					})
               }else{
                 return false;
               }
             });
		}

		//编辑群信息
		$scope.edit = function(id){
			$ionicLoading.show();
			var params =  layer.getParams("#myForm");
			if(params.group_name == ""){
				layer.show("律圈名称不能为空！");
			}else{
				$http.post('http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/edit',{
	  					'group_name'	: params.group_name,
	  					'group_avatar'	: params.group_avatar
			        },
			        {
			        headers: {
			            'Content-Type': 'application/json'
			        }
			    }).success(function(data) {
			       layer.show("修改成功！");
			       $ionicLoading.hide();
			    });
			}
		}
		
		//修改律圈头像
		$scope.uploadFiles = function (group_avatar,errFiles) {
		    $scope.errFiles = errFiles;
		    if($scope.errFiles.length > 0){
		       for(var i=0; i<$scope.errFiles.length; i++){
		       if($scope.errFiles[i].$error == 'maxSize'){
		          layer.show("图片大小不能超过2MB!");
		          return false;
		       }
		      }
		    }else{
		       if(group_avatar) {
		          $ionicLoading.show();
		         $scope.upload(group_avatar);
		       }
		    }
		};

		// 律圈头像上传图片
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
	            $ionicLoading.hide();
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
			        	$location.path('/group/list');
					})
               }else{
                 return false;
               }
             });
		}
	
})

//添加成员 
lvtuanApp.controller("groupaddCtrl",function($scope,$http,$location,$ionicLoading,$timeout,$stateParams,$rootScope,authService){

	//搜索条件和分页
	var timestamp=Math.round(new Date().getTime()/1000);
	var currentUser = authService.getUser();
		$scope.currentUser = currentUser;
    var page = 1; //页数
	var rows_per_page = 10; // 每页的数量
	if ($scope.rows_per_page) {
		rows_per_page = $scope.rows_per_page;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

	$scope.masklayer = true;

	getDistrict();
	getWorkscopes();
	getPractisePeriods();

	//获取所在区域
	$scope.city_cont = true;
	$scope.city_key = "";
    $scope.city_toggle = function () {
        $scope.city_cont = !$scope.city_cont;
        $scope.masklayer = !$scope.masklayer;
    }
	$scope.inCity = function(key) {
		var value = false;
		if (key == $scope.city_key) {
			value = true;
		}
		return value;
	}
	
	$scope.getCitytVal = function(key,val){
    	$scope.city_cont = !$scope.city_cont;
    	$scope.masklayer = !$scope.masklayer;
		$scope.city_name = val;
		$scope.city_key = key;
		page = 1;
		$scope.items = [];
		$scope.loadMore();
    }

	function getDistrict(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostPath+'/lawyer/city')
			.success(function(data) {
				$scope.citys = data.data; 
				$scope.addCitys = [
											{	
												"city_code"		:"",
												"city_name" 	: "城市"
											}
										]
				$scope.citys = $scope.addCitys.concat($scope.citys);
				console.info($scope.citys);
				$scope.city_name = $scope.citys[0].city_name;
				$ionicLoading.hide();
			})
	}


	//获取法律专长
	$scope.workscope_cont = true;
	$scope.workscope_key = "";
    $scope.workscope_toggle = function () {
        $scope.workscope_cont = !$scope.workscope_cont;
        $scope.masklayer = !$scope.masklayer;
    }
	$scope.inWorkscope = function(key) {
		var value = false;
		if (key == $scope.workscope_key) {
			value = true;
		}
		return value;
	}
	
	$scope.getWorkscopeVal = function(key,val){
    	$scope.workscope_cont = !$scope.workscope_cont;
    	$scope.masklayer = !$scope.masklayer;
		$scope.workscope_name = val;
		$scope.workscope_key = key;
		page = 1;
		$scope.items = [];
		$scope.loadMore();
    }

	function getWorkscopes(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
			.success(function(data) {
				$scope.workscopes = data.data;
				$scope.addWorkscopes = [
											{	
												"key"		:"",
												"value" 	: "擅长领域"
											}
										]
				$scope.workscopes = $scope.addWorkscopes.concat($scope.workscopes);
				$scope.workscope_name = $scope.workscopes[0].value;
				$ionicLoading.hide();
			})
	}


	//律师的从业年限
	$scope.period_cont = true;
	$scope.period_key = "";
    $scope.period_toggle = function () {
        $scope.period_cont = !$scope.period_cont;
        $scope.masklayer = !$scope.masklayer;
    }
	$scope.inPeriods = function(key) {
		var value = false;
		if (key == $scope.period_key) {
			value = true;
		}
		return value;
	}
	
	$scope.getPeriodsVal = function(key,val){
    	$scope.period_cont = !$scope.period_cont;
    	$scope.masklayer = !$scope.masklayer;
		$scope.period_name = val;
		$scope.period_key = key;
		page = 1;
		$scope.items = [];
		$scope.loadMore();
    }

	function getPractisePeriods(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/lawyer/practiseperiods')
			.success(function(data) {
				$scope.periods = data.data; 
				$scope.addPeriods = [
											{	
												"key"		:"",
												"value" 	: "执业年限"
											}
										]
				$scope.periods = $scope.addPeriods.concat($scope.periods);
				$scope.period_name = $scope.periods[0].value;
				$ionicLoading.hide();
			})
	}


    //搜索问题
    var timeoutHandler = null;
	$('#search').bind('input propertychange', function() {  
		if(timeoutHandler){
	         clearTimeout(timeoutHandler);
	     }
	     timeoutHandler = setTimeout(function(){
	     	page = 1;
			$scope.items = [];
	        $scope.loadMore();
     	},2000);
		
	});

	//获取参数
	function get_Param(){
		var exclude = JSON.parse(sessionStorage.getItem('exclude'));
		var search = $('#search').val();
		var param = []; //声明一个数组 判断如果有值就push进来
		if(exclude){
			param.push('exclude=' + exclude);
		}
		if(search){
	  		param.push('q=' + search);
	  	}
		if($scope.city_key){
	  		param.push('city_id=' + $scope.city_key);
	  	}
	  	if($scope.workscope_key){
	  		param.push('cat_id=' + $scope.workscope_key);
	  	}
	  	if($scope.period_key){
	  		param.push('experience=' + $scope.period_key);
	  	}
	  	param = param.join('&');  //通过join('&') 把所有的参数都拼接起来
	  	console.info(param);
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
		//获取推荐的律师 ?is_recommended=1&page=1&size=10
		get_Param();
	};

	//根据参数向后台拉取数据
	function geturl(param){
		$scope.nodata = true;
	    $ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/group/create?'+param+'&rows_per_page='+rows_per_page+'&page='+page+'&ts='+timestamp)
			.success(function(data) {
				console.info(data);
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
						$scope.moredata = false;
						$scope.nodata = false;
					}
					$scope.moredata = false;
				}
				page++;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			})
	}

	//判断用户是否选中
	$scope.selIds = [];
	$scope.checkItem = function(obj,id){
		console.info(obj,id);
		 if ($scope.selIds.indexOf(id) == -1){
		 	$scope.selIds.push(id)
		 }else{
		 	$scope.selIds.splice($scope.selIds.indexOf(id), 1);
		 }
		 console.info($scope.selIds);
		
	}

	//在数组中查找，如果存在就高亮显示
	$scope.ischecked = function (id,selIds) {

    	return $.inArray(id, selIds) >= 0;
	}

	//确定添加成员
	$scope.createSubmit = function(){
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/addmember',{
  				'members'	: $scope.selIds
		    }).success(function(data) {
		    	console.info(data);
		    	layer.show(data.data);
		    	location.href='#/group/site/'+$stateParams.id;
		    	window.location.reload();
		    	$ionicLoading.hide();
		    	sessionStorage.removeItem('exclude');
		    });
	}

	//取消
	/*$scope.clearGoBack = function(){
		$scope.selIds = [];
		window.history.back();
	}*/
	
})



//删除成员
lvtuanApp.controller("groupdelCtrl",function($scope,$http,$location,$ionicLoading,$timeout,$stateParams,$ionicPopup,$rootScope,$timeout,authService){ 

	console.info("删除成员");
	console.info( $stateParams.id);
	var currentUser = authService.getUser();
		$scope.currentUser = currentUser;

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

	var timestamp=Math.round(new Date().getTime()/1000);
	var page = 1; //页数
	var rows_per_page = 10; // 每页的数量
	if ($scope.rows_per_page) {
		rows_per_page = $scope.rows_per_page;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

   
	var timeoutHandler = null;
	$('#search').bind('input propertychange', function() {  
		if(timeoutHandler){
	         clearTimeout(timeoutHandler);
	     }
	     timeoutHandler = setTimeout(function(){
	     	page = 1;
			$scope.items = [];
			$scope.loadMore();
     	},2000);
		
	});

	//获取参数，处理被收藏书签的情况
	function get_Param(){
		var search = $('#search').val();
	  	var param = [];
	  	if(search){
	  		param.push('q=' + search);
	  	}
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
		get_Param();
	};

	function geturl(param){
	    $ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/listmembers?'+param+'&rows_per_page='+rows_per_page+'&page='+page+'&ts='+timestamp)
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
						$scope.moredata = false;
						$scope.nodata = false;
						//layer.show('暂无数据！');
					}
					$scope.moredata = false;
				}
				page++;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			})
	}

    
	//判断用户是否选中
	$scope.selIds = [];
	$scope.checkItem = function(obj,id){
		console.info(obj,id);
		 if ($scope.selIds.indexOf(id) == -1){
		 	$scope.selIds.push(id)
		 }else{
		 	$scope.selIds.splice($scope.selIds.indexOf(id), 1);
		 }
		 console.info($scope.selIds);
		
	}

	//在数组中查找，如果存在就高亮显示
	$scope.ischecked = function (id,selIds) {
    	return $.inArray(id, selIds) >= 0;
	}

	//删除成员
	$scope.delSubmit = function(items,selIds){
		var confirmPopup = $ionicPopup.confirm({
               title: '确定删除律圈成员？',
               cancelText: '取消', 
               okText: '确认', 
             });
             confirmPopup.then(function(res) {
               if(res) {
               	 $ionicLoading.show();
                 $http.post('http://'+$rootScope.hostName+'/group/'+$stateParams.id+'/removemembers',{
		  				'members'	: selIds
				    }).success(function(data) {
				    	console.info(data);
				    	//页面删除
				    	/*for(var i=0; i<items.length; i++){
							for(var j=0; j<selIds.length; j++){
								if (items[i].id == selIds[j]) {
									$scope.items = $scope.items.splice($scope.items.indexOf(items[i].id), 1);
									if($scope.selIds.splice(j,1).length > 0){
										$scope.selIds = $scope.selIds.splice(j,1);
									}else{
										$scope.selIds = [];
									}
								}
							}
						}*/
						layer.show(data.data);
						location.href='#/group/site/'+$stateParams.id;
						window.location.reload();
						$ionicLoading.hide();
				   
				    });
               }else{
                 return false;
               }
             });
	}

	/*//取消
	$scope.clearGoBack = function(){
		$scope.selIds = [];
		window.history.back();
	}*/
	
})


//创建律圈
lvtuanApp.controller("groupcreateCtrl",function($scope,$http,$state,$rootScope,$timeout,$ionicLoading,$location, Upload,authService){
	var currentUser = authService.getUser();
	//创建律圈
	$scope.createSubmit = function(){
		sessionStorage.setItem("exclude", JSON.stringify(currentUser.id));
		var params = layer.getParams("#createGroup_form");
  		if(params.group_name == ""){
  			layer.show("请输入律圈名称!");
  			return false;
  		}else if(params.group_avatar == ""){
  			layer.show("请上传律圈头像!");
  			return false;
  		}else{
  			
  			$ionicLoading.show();
  			$http.post('http://'+$rootScope.hostName+'/group/store',{
				'group_name'	: params.group_name,
            	'group_avatar'	: params.group_avatar
            }).success(function(data) {
	           //layer.show("创建成功！");
	           $scope.file = {};
	           $(':input','#questions_form').not('textarea :submit, :reset, :hidden').val('');
	           //$location.path('/group/list');
	           $location.path('/group/add/'+data.data.id);
	           $ionicLoading.hide();
	        });
            return true;
  		}    
	}


	//律圈上传图片
	$scope.uploadFiles = function (group_avatar,errFiles) {
	    $scope.errFiles = errFiles;
	    if($scope.errFiles.length > 0){
	       for(var i=0; i<$scope.errFiles.length; i++){
	       if($scope.errFiles[i].$error == 'maxSize'){
	          layer.show("图片大小不能超过2MB!");
	          return false;
	       }
	      }
	    }else{
	       if(group_avatar) {
	          $ionicLoading.show();
	         $scope.upload(group_avatar);
	       }
	    }
	};

	// 律圈上传图片
	$scope.upload = function (group_avatar) {
	    Upload.upload({
	    	headers: {
	            'Content-Type': 'application/json' 
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
	            $ionicLoading.hide();
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

/****************************************************** 知识 ******************************************************/
//知识 - 看新闻
lvtuanApp.controller("knowledgesCtrl",function($scope,$http,$rootScope,listHelper){
	listHelper.bootstrap('/news/list_news', $scope);
})

//知识 - 学知识
lvtuanApp.controller("documentsCtrl",function($scope,$http,$rootScope,listHelper){
	listHelper.bootstrap('/knowledge/article/list_articles', $scope);
})

//知识 - 搜案例
lvtuanApp.controller("casesCtrl",function($scope,$http,$rootScope,listHelper){
	listHelper.bootstrap('/case/list_case', $scope);
})

//文章-详情
lvtuanApp.controller("knowledgeViewCtrl",function($scope,$http,$rootScope,$stateParams,$ionicPopup,$ionicPopup,$ionicLoading){
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
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/like',
			{
				item_type : 'article',
				item_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
        	var itmes = data.data;
        	$scope.items.likes_count = itmes.likes_count;
        	$scope.items.is_like = true;
            layer.show("点赞成功！");
            $ionicLoading.hide();
        });
	}

	//收藏
	$scope.collects = function(id){
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/collect',
			{
				collect_type : 3,
				item_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
        	$scope.items.collects_count = $scope.items.collects_count + 1;
        	$scope.items.is_collect = true;
            layer.show("收藏成功！");
            $ionicLoading.hide();
        });
	}

	//取消收藏
	$scope.collects_del = function(id){
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/collect/delete',
			{
				collect_type : 3,
				item_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
        	$scope.items.collects_count = $scope.items.collects_count - 1 ;
        	$scope.items.is_collect = false;
            layer.show("取消成功！");
            $ionicLoading.hide();
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

//给安卓用的文章-详情页面
lvtuanApp.controller("knowledgeAndroidViewCtrl",function($scope,$http,$rootScope,$stateParams,$ionicPopup,$ionicPopup,$ionicLoading){
	 $ionicLoading.show({
	    showBackdrop: false
	  });
	$http.get('http://'+$rootScope.hostName+'/knowledge/'+$stateParams.id+'/view').success(function(data) {
        	console.info(data.data)
        	$scope.items = data.data;
        	$ionicLoading.hide();
		})

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
		

		if(currentUser != null){
			if(!currentUser.is_verified_lawyer){
				//普通用户个人信息
				url = 'http://'+$rootScope.hostName+'/center/customer/info?ts='+timestamp;
			}else{
				//律师个人信息
				url = 'http://'+$rootScope.hostName+'/center/lawyer/info?ts='+timestamp;
			}
			$ionicLoading.show();
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

		}else{
			//$rootScope.$broadcast('unauthenticated');
			return false;
		}
		
		
	})

	$scope.jumplogin = function(){
		$rootScope.$broadcast('unauthenticated');
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
lvtuanApp.controller("infoCtrl",function($scope,$http,$rootScope,$timeout,$ionicLoading,$stateParams,Upload,authService){

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
						$scope.file = $scope.items.avatar;
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
   $scope.uploadFiles = function (avatar,errFiles) {
   		$scope.errFiles = errFiles;
   		if($scope.errFiles.length > 0){
   			for(var i=0; i<$scope.errFiles.length; i++){
	        	if($scope.errFiles[i].$error == 'maxSize'){
	    			layer.show("图片大小不能超过2MB!");
	    			return false;
	    		}
	        }
   		}else{
   			if(avatar) {
	   		 	$ionicLoading.show();
		        $scope.upload(avatar);
		      }
   		}
    };

    // 我的资料个人头像上传图片
    $scope.upload = function (avatar) {
    	Upload.upload({
        	headers: {
	            'Content-Type': 'application/json'
       		},
            url: 'http://'+$rootScope.hostName+'/center/update_user_image',
            data: {
            	upload_file: avatar,
            	'user_id': $stateParams.id
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
lvtuanApp.controller("valrealnameCtrl",function($scope,$http,$rootScope,$ionicLoading,$location,$stateParams, authService){

	//判断是否是律师
	var currentUser = authService.getUser();
	var timestamp=Math.round(new Date().getTime()/1000);
	$scope.userinfo = JSON.parse(localStorage.getItem('userinfo'));
    console.info($scope.userinfo)
	$scope.user = {
			nikname:$scope.userinfo.nikname
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
	            $location.path('/info/'+$stateParams.id);
	            $ionicLoading.hide();
	        });
    }
})
//个人信息 - 修改手机
lvtuanApp.controller("valphoneCtrl",function($scope,$http,$rootScope,$ionicLoading,$interval,$location,$stateParams,authService){
	//判断是否是律师
	var currentUser = authService.getUser();
	$scope.userinfo = JSON.parse(localStorage.getItem('userinfo'));
	$scope.user = {
			phone:$scope.userinfo.phone 
		};


	//第一次获取验证码后要60秒以后才能在次获取
	var t, timePromise;
	$scope.t = 60;  
	var runTiming = function(){
	  timePromise = $interval(function(){
			$scope.t -= 1;
			console.info($scope.t);
			if($scope.t == 0){
				$scope.phone_disabled = true;
	  			$interval.cancel(timePromise);
	  			timePromise = undefined;
			}
	  }, 1000, 60);
	  return timePromise;
	}

	//获取验证码
	$scope.phone_disabled = true;
	$scope.phonecode = function(phone){
		$scope.t = 60;
		$interval.cancel(timePromise);
	  	timePromise = undefined;
		var param = 'phone='+phone;
		$scope.phone_disabled = false;
		$http.post('http://'+$rootScope.hostName+'/send-code?'+param
		).success(function(data) {
			runTiming();
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
	            $location.path('/info/'+$stateParams.id);
	            $ionicLoading.hide();
	        });
	}
})
//个人信息 - 修改邮箱
lvtuanApp.controller("valemailCtrl",function($scope,$http,$rootScope,$ionicLoading,$location,$stateParams, authService){
	//判断是否是律师
	var currentUser = authService.getUser();
	$scope.userinfo = JSON.parse(localStorage.getItem('userinfo'));
	$scope.user = {
			email:$scope.userinfo.email 
		};

	//第一次获取验证码后要60秒以后才能在次获取
	var t, timePromise;
	$scope.t = 60;  
	var runTiming = function(){
	  timePromise = $interval(function(){
			$scope.t -= 1;
			console.info($scope.t);
			if($scope.t == 0){
				$scope.phone_disabled = true;
	  			$interval.cancel(timePromise);
	  			timePromise = undefined;
			}
	  }, 1000, 60);
	  return timePromise;
	}

	//获取验证码
	$scope.phone_disabled = true;
	$scope.phonecode = function(phone){
		var param = 'phone='+phone;
		$scope.t = 60;  
		$interval.cancel(timePromise);
	  	timePromise = undefined;
		$scope.phone_disabled = false;
		$http.post('http://'+$rootScope.hostName+'/send-code?'+param
		).success(function(data) {
			runTiming();
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
	            $location.path('/info/'+$stateParams.id);
	            $ionicLoading.hide();
	        });
	}
})

//普通用户的积分
lvtuanApp.controller("listscoresCtrl",function($scope, listHelper, authService) {
	var currentUser = authService.getUser();
	$scope.currentUser = currentUser;
	$scope.rows_per_page = 20;
	listHelper.bootstrap('/center/score/list_scores', $scope);
	$scope.click = function(){
		layer.show("敬请期待!");
	}
})

//普通用户和律师的我的消息
lvtuanApp.controller("messagesCtrl",function($scope) {
	$scope.visible = true;
	$scope.itemcheckbox = '';
    $scope.toggle = function () {
    	$scope.itemcheckbox == '' ? $scope.itemcheckbox = 'item-checkbox' : $scope.itemcheckbox = '';
        $scope.visible = !$scope.visible;
    }
})

//普通用户和律师的我的消息
lvtuanApp.controller("mymesgCtrl",function($scope, $http, $rootScope, $ionicLoading, listHelper) {
	listHelper.bootstrap('/letter/users', $scope); 
	//删除消息
	$scope.messgs_del = function(id,index){
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/letter/'+id+'/delete',
			{
				collect_type : 3,
				item_id   : id
        }).success(function(data) {
        	$scope.items.splice(index, 1);
        	$ionicLoading.hide();
            layer.show("删除消息成功！");
        });
	}
})

//普通用户和律师的系统消息
lvtuanApp.controller("sysmesgCtrl",function($scope, $http, $rootScope, $ionicLoading, listHelper) {
	listHelper.bootstrap('/letter/sys', $scope);
	//删除消息
	$scope.messgs_del = function(id,index){
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/letter/'+id+'/delete',
			{
				collect_type : 3,
				item_id   : id
        }).success(function(data) {
        	$scope.items.splice(index, 1);
        	$ionicLoading.hide();
            layer.show("删除系统消息成功！");
        });
	}

})



//我的消息-消息详情
lvtuanApp.controller("viewMessageCtrl",function($scope,$http,$rootScope,$interval,$stateParams,$ionicLoading){
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/letter/sys-letters/'+$stateParams.id).success(function(data) {
		if (data && data.data) {
    		$scope.item = data.data;
    		$ionicLoading.hide();
    	}
	})
})

//普通用户和律师的收藏
lvtuanApp.controller("collectCtrl",function($scope, $http, $rootScope, listHelper) {
	$scope.visible = true;
	$scope.itemcheckbox = '';
    $scope.toggle = function () {
    	$scope.itemcheckbox == '' ? $scope.itemcheckbox = 'item-checkbox' : $scope.itemcheckbox = '';
        $scope.visible = !$scope.visible;
    }
    
	listHelper.bootstrap('/center/collect', $scope);

	//取消收藏
	$scope.collects_del = function(id,index){
		$http.post('http://'+$rootScope.hostName+'/collect/delete',
			{
				collect_type : 3,
				item_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
        	$scope.items.splice(index, 1);
            layer.show("已取消收藏！");
        });
	}

})

//普通用户的评论
lvtuanApp.controller("commentCtrl",function($scope, listHelper) {
	listHelper.bootstrap('/center/blog/reply', $scope);

})

//普通用户-我的关注
lvtuanApp.controller("followedCtrl",function($scope,$rootScope,$http,listHelper) {

	listHelper.bootstrap('/center/mylawyer/followed', $scope);

	//取消关注
	$scope.follow_del = function(id,index){
		$http.post('http://'+$rootScope.hostName+'/follow/remove',
			{
				follow_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
        	console.info(data);
        	$scope.items.splice(index, 1);
            layer.show("取消成功！");
        });
	}
	
})



//普通用户-认证为律师的导航
lvtuanApp.controller("becomenavCtrl",function($scope,$http,$rootScope,$ionicPopup,$localStorage,$ionicLoading,$location, authService){

	var currentUser = authService.getUser();
	$scope.currentUser = currentUser;
	var timestamp=Math.round(new Date().getTime()/1000);

	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/center/becomelawyer/infochecks?ts='+timestamp)
		.success(function(data) {
			$scope.infochecks = data.data; 
			console.info($scope.infochecks);
			$ionicLoading.hide();
		})

	$scope.submit = function(){
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/center/becomelawyer/submit')
			.success(function(data) {
				delete $localStorage.addres;
				layer.show("提交成功！请等待审核...");
				$location.path('/center');
				$ionicLoading.hide();
	        }).error(function(data){
				console.info(data);
			});
	}

	
})

//普通用户- 认证为律师的导航 - 从业信息
lvtuanApp.controller("practitionersCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,$localStorage,$location,$ionicLoading,Upload,authService) {

		var timestamp=Math.round(new Date().getTime()/1000);
		var currentUser = authService.getUser();
		$scope.currentUser = currentUser;

		//用户个人信息
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/center/becomelawyer/work?ts='+timestamp)
		.success(function(data) {
			if(data && data.data){
				//用于连接两个或多个数组并返回一个新的数组
				$scope.items = data.data; 
				console.info($scope.items);
				getDate($scope.items);
			}else{
				layer.show('暂无数据！');
				return false;
			}
			$ionicLoading.hide();
		})

		//获取执业地址
		$scope.file = "";
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
		    	$scope.province =  $scope.addres_param.province.key;
				$scope.city =  $scope.addres_param.city.key;
				$scope.district =  $scope.addres_param.district.key;
		   	 	console.info('address',$scope.address);
		    }else{
		    	$scope.address = "";
		    	$scope.province = "";
				$scope.city =  "";
				$scope.district =  "";
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

		//律师的从业年限
		function periods(param){
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
	   $scope.uploadFiles = function (license_file,errFiles) {
	   		$scope.errFiles = errFiles;
	   		if($scope.errFiles.length > 0){
	   			for(var i=0; i<$scope.errFiles.length; i++){
		        	if($scope.errFiles[i].$error == 'maxSize'){
		    			layer.show("图片大小不能超过2MB!");
		    			return false;
		    		}
		        }
	   		}else{
	   			if(license_file) {
		   		 	$ionicLoading.show();
			        $scope.upload(license_file);
			      }
	   		}
	    };

	    // 上传执业证书
	    $scope.upload = function (license_file) {
	    	Upload.upload({
	        	headers: {
			            'Content-Type': 'application/json'
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
			$location.path('/citypicke/all');
		}
		
		//提交
		$scope.submit = function(){
			var param = layer.getParams("#practitionForm");

			/*var province =  $scope.addres_param.province.key;
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
			*/
			console.info(param);
			if(param.license_file.length < 1){
				layer.show("请上传执业证书！");
				return false;
			}else{
				var license_file = param.license_file.split('=');
				if(license_file[1]){
					param['license_file'] = license_file[1];
				}else{
					param['license_file'] = param.license_file;
				}
			}
			
			console.info(param);
			$ionicLoading.show();
			$http.post('http://'+$rootScope.hostName+'/center/becomelawyer/work', param
			).success(function(data) {
	           layer.show("添加成功！");
	           var stateObj = { states: "becomenav" };
			   history.replaceState(stateObj, "becomenav", $location.absUrl());
	           location.href = '#/becomenav';
	           window.location.reload();
	           $ionicLoading.hide();
	        });
		}	

		function getDate(items){
			$scope.license = items.license;
			$scope.company_name = items.company_name;
			$scope.file = items.license_file;
			$scope.file_path = items.license_file;
			var param = items.practice_period;
			$scope.address = items.province +''+ items.city +''+ items.district;
			periods(param);
		}
})
//普通用户- 认证为律师的导航 - 实名认证
lvtuanApp.controller("verifiedCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,$localStorage,$ionicLoading,$location, Upload,authService) {

	var timestamp=Math.round(new Date().getTime()/1000);
	var currentUser = authService.getUser();
	$scope.currentUser = currentUser;

	//用户个人信息
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/center/becomelawyer/identity?ts='+timestamp)
	.success(function(data) {
		if(data && data.data){
			//用于连接两个或多个数组并返回一个新的数组
			$scope.items = data.data; 
			console.info($scope.items);
			//判断是否已经填过数据
		    if($scope.items){
				$scope.realname = $scope.items.realname;
				$scope.file = $scope.items.ID_img;
				$scope.file_path = $scope.items.ID_img;
			}
		}else{
			layer.show('暂无数据！');
			return false;
		}

		$ionicLoading.hide();
	})
	
	//上传身份证
	$scope.uploadFiles = function (license_file,errFiles) {
	    $scope.errFiles = errFiles;
	    if($scope.errFiles.length > 0){
	       for(var i=0; i<$scope.errFiles.length; i++){
	       if($scope.errFiles[i].$error == 'maxSize'){
	          layer.show("图片大小不能超过2MB!");
	          return false;
	       }
	      }
	    }else{
	       if(license_file) {
	          $ionicLoading.show();
	         $scope.upload(license_file);
	       }
	    }
	};

	// 上传执业证书
	$scope.upload = function (license_file) {
	 Upload.upload({
	   headers: {
	            'Content-Type': 'application/json'
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


    //提交
	$scope.submit = function(){
		var param = layer.getParams("#verifiedForm");
		if(param.ID_img.length < 1){
			layer.show("请上传执业证书！");
			return false;
		}
		else{
		 	var ID_img = param.ID_img.split('=');
		 	if(ID_img[1]){
		 		param['ID_img'] = ID_img[1];
		 	}else{
		 		param['ID_img'] = param.ID_img;
		 	}
		}

		console.log(param);
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/center/becomelawyer/identity', param
		).success(function(data) {
            layer.show("添加成功！");
            var stateObj = { states: "becomenav" };
			history.replaceState(stateObj, "becomenav", $location.absUrl());
            location.href = '#/becomenav';
            window.location.reload();
            $ionicLoading.hide();
        });
	}

})
//普通用户- 认证为律师的导航 - 资费设置
lvtuanApp.controller("tariffsetCtrl",function($scope,$http,$rootScope,$stateParams,$localStorage,$ionicLoading,$location, authService) {
	//判断是否已经填过数据
	var timestamp=Math.round(new Date().getTime()/1000);
	var currentUser = authService.getUser();
	$scope.currentUser = currentUser;

	//律师个人信息
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/center/becomelawyer/fee?ts='+timestamp)
	.success(function(data) {
		if(data && data.data){
    		$scope.items = data.data;
			$scope.textreplyfee = parseInt($scope.items.text_reply_fee);
   			$scope.phonereplyfee = parseInt($scope.items.phone_reply_fee);
    	}
    	$ionicLoading.hide();
	})

	//提交
	$scope.submit = function(){
		var param = layer.getParams("#tariffsetForm");
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/center/becomelawyer/fee', param
			).success(function(data) {
				if(data.data){
					$scope.textreplyfee = data.data.text_reply_fee;
		    		$scope.phonereplyfee = data.data.phone_reply_fee;
		            layer.show("添加成功！");
		            var stateObj = { states: "becomenav" };
					history.replaceState(stateObj, "becomenav", $location.absUrl());
		            location.href = '#/becomenav';
		            window.location.reload();
		            $ionicLoading.hide();
				}
				
	        });
	}
})

//普通用户- 认证为律师的导航 - 擅长领域
lvtuanApp.controller("fieldCtrl",function($scope,$http,$rootScope,$stateParams,$localStorage,$ionicLoading,$location,authService) {

	var timestamp=Math.round(new Date().getTime()/1000);
	var currentUser = authService.getUser();
	$scope.currentUser = currentUser;

	//用户个人信息
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/center/becomelawyer/workscope?ts='+timestamp)
	.success(function(data) {
		if(data && data.data){
			//用于连接两个或多个数组并返回一个新的数组
			$scope.items = data.data; 
			if($scope.items.work_scope.length > 0){
				console.info($scope.items.work_scope);
				$scope.showscopes = $scope.items.work_scope;
			}
		}else{
			layer.show('暂无数据！');
			return false;
		}
		$ionicLoading.hide();
	})


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
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
		.success(function(data) {
			$scope.workscopes = data.data; 
			console.info($scope.workscopes);
			$ionicLoading.hide();
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
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/center/becomelawyer/workscope', param
			).success(function(data) {
				console.info(data);
	            layer.show("添加成功！");
	            var stateObj = { states: "becomenav" };
				history.replaceState(stateObj, "becomenav", $location.absUrl());
	            location.href = '#/becomenav';
	            window.location.reload();
	            $ionicLoading.hide();
	        });
	}
})

//普通用户- 认证为律师的导航 - 经历案例
lvtuanApp.controller("caseCtrl",function($scope,$http,$rootScope,$stateParams,$localStorage,$ionicLoading,$location,authService) {

	var timestamp=Math.round(new Date().getTime()/1000);
	var currentUser = authService.getUser();
	$scope.currentUser = currentUser;

	//用户个人信息
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/center/becomelawyer/experience?ts='+timestamp)
	.success(function(data) {
		if(data && data.data){
			//用于连接两个或多个数组并返回一个新的数组
			$scope.items = data.data; 
			console.info($scope.items);

			$scope.introduce = $scope.items.introduce;
		    $scope.experience = $scope.items.experience;
		    $scope.law_cases = $scope.items.law_cases;

			$ionicLoading.hide();
		}else{
			layer.show('暂无数据！');
			return false;
		}
	})


	//提交
	$scope.submit = function(){
		var param = layer.getParams("#caseForm");
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/center/becomelawyer/experience', param
			).success(function(data) {
	            layer.show("添加成功！");
	            var stateObj = { states: "becomenav" };
				history.replaceState(stateObj, "becomenav", $location.absUrl());
	            location.href = '#/becomenav';
	            window.location.reload();
	            $ionicLoading.hide();
	        });
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

//个人中心公用-用户协议
lvtuanApp.controller("userpactCtrl",function($scope,$http,$ionicLoading,$rootScope ){
	console.info("用户协议");
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/siteinfo/list_siteinfo')
		.success(function(data) {
			if(data && data.data && data.data.length){
        		$scope.items = data.data; 
        	}
        	$ionicLoading.hide();
		})

})

//个人中心公用-设置
lvtuanApp.controller("siteCtrl",function($scope,$http,$rootScope,$location,authService){
	console.info("设置");
	$scope.logout = function(){
		authService.logout();
		localStorage.removeItem('post_id_status');
		localStorage.removeItem('post_id');
		$location.path('/login');
	}

})


/****************************************************** 找律师 ******************************************************/
//找律师的列表
lvtuanApp.controller("lawyerlistCtrl",function($scope,$state,$http,$rootScope,$location,$stateParams,$ionicLoading,locationService,listHelper){
	console.info($stateParams.type);
	$scope.type = $stateParams.type;

	$scope.masklayer = true;

	getDistrict();
	getWorkscopes();
	getPractisePeriods();

	//获取所在区域
	$scope.city_cont = true;
	$scope.city_key = "";
    $scope.city_toggle = function () {
        $scope.city_cont = !$scope.city_cont;
        $scope.masklayer = !$scope.masklayer;
    }
	$scope.inCity = function(key) {
		var value = false;
		if (key == $scope.city_key) {
			value = true;
		}
		return value;
	}
	
	$scope.getCitytVal = function(key,val){
    	$scope.city_cont = !$scope.city_cont;
    	$scope.masklayer = !$scope.masklayer;
		$scope.city_name = val;
		$scope.city_key = key;
		page = 1;
		$scope.items = [];
		get_Param();
    }

	function getDistrict(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostPath+'/lawyer/city')
			.success(function(data) {
				$scope.citys = data.data; 
				$scope.addCitys = [
											{	
												"city_code"		:"",
												"city_name" 	: "城市"
											}
										]
				$scope.citys = $scope.addCitys.concat($scope.citys);
				console.info($scope.citys);
				$scope.city_name = $scope.citys[0].city_name;
				$ionicLoading.hide();
			})
	}


	//获取法律专长
	$scope.workscope_cont = true;
	$scope.workscope_key = "";
    $scope.workscope_toggle = function () {
        $scope.workscope_cont = !$scope.workscope_cont;
        $scope.masklayer = !$scope.masklayer;
    }
	$scope.inWorkscope = function(key) {
		var value = false;
		if (key == $scope.workscope_key) {
			value = true;
		}
		return value;
	}
	
	$scope.getWorkscopeVal = function(key,val){
    	$scope.workscope_cont = !$scope.workscope_cont;
    	$scope.masklayer = !$scope.masklayer;
		$scope.workscope_name = val;
		$scope.workscope_key = key;
		page = 1;
		$scope.items = [];
		get_Param();
    }

	function getWorkscopes(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
			.success(function(data) {
				$scope.workscopes = data.data;
				$scope.addWorkscopes = [
											{	
												"key"		:"",
												"value" 	: "擅长领域"
											}
										]
				$scope.workscopes = $scope.addWorkscopes.concat($scope.workscopes);
				$scope.workscope_name = $scope.workscopes[0].value;
				$ionicLoading.hide();
			})
	}


	//律师的从业年限
	$scope.period_cont = true;
	$scope.period_key = "";
    $scope.period_toggle = function () {
        $scope.period_cont = !$scope.period_cont;
        $scope.masklayer = !$scope.masklayer;
    }
	$scope.inPeriods = function(key) {
		var value = false;
		if (key == $scope.period_key) {
			value = true;
		}
		return value;
	}
	
	$scope.getPeriodsVal = function(key,val){
    	$scope.period_cont = !$scope.period_cont;
    	$scope.masklayer = !$scope.masklayer;
		$scope.period_name = val;
		$scope.period_key = key;
		page = 1;
		$scope.items = [];
		get_Param();
    }

	function getPractisePeriods(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/lawyer/practiseperiods')
			.success(function(data) {
				$scope.periods = data.data; 
				$scope.addPeriods = [
											{	
												"key"		:"",
												"value" 	: "执业年限"
											}
										]
				$scope.periods = $scope.addPeriods.concat($scope.periods);
				$scope.period_name = $scope.periods[0].value;
				$ionicLoading.hide();
			})
	}

	//综合排序
	$scope.orders = [
					{
						"key"	:"",
						"value" : "综合排序"
					},
					{
						"key"	:"case_count",
						"value" : "接单数量"
					},
					{
						"key"	:"best_evaluated",
						"value" : "评分最高"
					},
					{
						"key"	:"price",
						"value" : "价格最低"
					}
				];

	$scope.order_cont = true;
	$scope.orders_name = $scope.orders[0].value;
	$scope.orders_key = "";
    $scope.orders_toggle = function () {
        $scope.order_cont = !$scope.order_cont;
        $scope.masklayer = !$scope.masklayer;
    }
	$scope.inOrders = function(key) {
		var value = false;
		if (key == $scope.orders_key) {
			value = true;
		}
		return value;
	}
	
	$scope.getOrderVal = function(key,val){
    	$scope.order_cont = !$scope.order_cont;
    	$scope.masklayer = !$scope.masklayer;
		$scope.orders_name = val;
		$scope.orders_key = key;
		page = 1;
		$scope.items = [];
		get_Param();
    }


    //搜索条件和分页

    var page = 1; //页数
	var size = 5; // 每页的数量
	if ($scope.size) {
		size = $scope.size;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

	//获取参数
	function get_Param(){
		var param = []; //声明一个数组 判断如果有值就push进来
		if($scope.city_key){
	  		param.push('city_id=' + $scope.city_key);
	  	}
	  	if($scope.workscope_key){
	  		param.push('cat_id=' + $scope.workscope_key);
	  	}
	  	if($scope.period_key){
	  		param.push('experience=' + $scope.period_key);
	  	}
	  	if($scope.orders_key){
	  		param.push('order_by=' + $scope.orders_key);
	  	}
	  	if($stateParams.type){
	  		param.push('type=' + $stateParams.type);
	  	}
	  	param = param.join('&');  //通过join('&') 把所有的参数都拼接起来
	  	console.info($scope.param)
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
		//获取推荐的律师 ?is_recommended=1&page=1&size=10
		get_Param();
	};

	//根据参数向后台拉取数据
	function geturl(param){
		$scope.nodata = true;
		var url;
		if(param != ""){
	  		url = 'http://'+$rootScope.hostName+'/lawyer/list_lawyers?'+param+'&size='+size+'&page='+page;
	    }else{
	    	url = 'http://'+$rootScope.hostName+'/lawyer/list_lawyers?size='+size+'&page='+page;
	    }
	    console.info(url);
	    $ionicLoading.show();
		$http.get(url)
			.success(function(data) {
	        	console.info(data.data)
	        	if(data && data.data && data.data.length){
					$scope.items = $scope.items.concat(data.data);
					console.info($scope.items);
					if (data.data.length < size) {
						$scope.moredata = false;
					} else {
						$scope.moredata = true;
					}
				}else{
					if (page == 1) {
						$scope.moredata = false;
						$scope.nodata = false;
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

//一对一咨询
lvtuanApp.controller("lawyerOneQuestionsCtrl",function($http,$scope,$state,$rootScope,$ionicLoading){

	$http.get('http://'+$rootScope.hostPath+'/evaluate?type=all')
		.success(function(data) {
			$scope.items = data.data.extras;
			console.info($scope.items);
		})

	$scope.visible = true;
	$scope.one_question_val = null;
	$scope.toggle = function(val){
		$scope.one_question_val = val;
		if(val == 'pay_text'){
			$scope.visible = true;
		}else{
			$scope.visible = false;
		}
	}

	$scope.jumpGoQuestionsList = function(){
		if($scope.one_question_val == null){
			$scope.one_question_val = 'pay_text';
		}else{
			$scope.one_question_val = $scope.one_question_val;
		}
		location.href='#/lawyer/list/'+$scope.one_question_val;
	}

})

//律师的全部评价
lvtuanApp.controller("lawyerAllEvaluateCtrl",function($http,$scope,$state,$rootScope,$ionicLoading){
	console.info('律师的全部评价');

	$scope.evaluate_key = 'all';
	$scope.inEvaluate = function(key) {
		var value = false;
		if (key == $scope.evaluate_key) {
			value = true;
		}
		return value;
	}

	$scope.click_evaluate = function(key){
		page = 1;
		$scope.items = [];
		$scope.evaluate_key = key;
		get_Param(key);

	}

	var page = 1; //页数
	var size = 5; // 每页的数量
	if ($scope.size) {
		size = $scope.size;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

	//获取参数
	function get_Param(key){
		var param = []; //声明一个数组 判断如果有值就push进来
		switch(key) {
			case "all":
				param.push('type=' + key);
				break;
			case "high":
				param.push('type=score');
				param.push('score=' + key);
				break;
			case "intermediate":
				param.push('type=score');
				param.push('score=' + key);
				break;
			case "low":
				param.push('type=score');
				param.push('score=' + key);
				break;
			default:
				param.push('type=all');
		}
		
	  	param = param.join('&');  //通过join('&') 把所有的参数都拼接起来
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
		//获取推荐的律师 ?is_recommended=1&page=1&size=10
		get_Param();
	};

	//根据参数向后台拉取数据
	function geturl(param){
		
		$scope.nodata = true;
		var timestamp=Math.round(new Date().getTime()/1000);
	    $ionicLoading.show();
		$http.get('http://'+$rootScope.hostPath+'/evaluate?'+param+'&size='+size+'&page='+page+'&ts='+timestamp)
			.success(function(data) {
				$scope.extras = data.data.extras;
	        	if(data && data.data.list && data.data.list.length){
					$scope.items = $scope.items.concat(data.data.list);
					console.info($scope.items);
					if (data.data.list.length < size) {
						$scope.moredata = false;
					} else {
						$scope.moredata = true;
					}
				}else{
					if (page == 1) {
						$scope.moredata = false;
						$scope.nodata = false;
					}
					$scope.moredata = false;
				}
				page++;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			})
	}

})

//律师的全部评价
lvtuanApp.controller("lawyerOneAllEvaluateCtrl",function($http,$scope,$state,$rootScope,$ionicLoading,$stateParams){
	console.info('律师的全部评价');
	$scope.evaluate_key = 'all';
	$scope.inEvaluate = function(key) {
		var value = false;
		if (key == $scope.evaluate_key) {
			value = true;
		}
		return value;
	}

	$scope.click_evaluate = function(key){
		page = 1;
		$scope.items = [];
		$scope.evaluate_key = key;
		get_Param(key);

	}

	var page = 1; //页数
	var size = 5; // 每页的数量
	if ($scope.size) {
		size = $scope.size;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

	//获取参数
	function get_Param(key){
		var param = []; //声明一个数组 判断如果有值就push进来
		switch(key) {
			case "all":
				break;
			case "high":
				param.push('type=score');
				param.push('score=' + key);
				break;
			case "intermediate":
				param.push('type=score');
				param.push('score=' + key);
				break;
			case "low":
				param.push('type=score');
				param.push('score=' + key);
				break;
		}

		
	  	param = param.join('&');  //通过join('&') 把所有的参数都拼接起来
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
		//获取推荐的律师 ?is_recommended=1&page=1&size=10
		get_Param();
	};

	//根据参数向后台拉取数据
	function geturl(param){
		
		$scope.nodata = true;
		var timestamp=Math.round(new Date().getTime()/1000);
	    $ionicLoading.show();
	    var url;
		if(param != ""){
	  		url = 'http://'+$rootScope.hostPath+'/evaluate/'+$stateParams.id+'?'+param+'&size='+size+'&page='+page+'&ts='+timestamp
	    }else{
	    	url = 'http://'+$rootScope.hostPath+'/evaluate/'+$stateParams.id+'?size='+size+'&page='+page+'&ts='+timestamp
	    }
		$http.get(url)
			.success(function(data) {
				$scope.extras = data.data.extras;
	        	if(data && data.data.list && data.data.list.length){
					$scope.items = $scope.items.concat(data.data.list);
					console.info($scope.items);
					if (data.data.list.length < size) {
						$scope.moredata = false;
					} else {
						$scope.moredata = true;
					}
				}else{
					if (page == 1) {
						$scope.moredata = false;
						$scope.nodata = false;
					}
					$scope.moredata = false;
				}
				page++;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			})
	}

})

//律师一对一搜索
//问律师搜索
lvtuanApp.controller("lawyerlistsearchCtrl",function($http,$scope,$state,$rootScope,$stateParams,$ionicLoading){
	angular.element('.search').trigger('focus');
	$scope.type = $stateParams.type;
	var page = 1; //页数
	var size = 5; // 每页的数量
	if ($scope.size) {
		size = $scope.size;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

	//搜索问题
	$scope.q = '';
	$scope.$watch('q', function(newVal, oldVal) {
		if (newVal && newVal != oldVal) {
			page = 1;
			$scope.items = [];
	        $scope.loadMore();
	    }else{
	    	page = 1;
			$scope.items = [];
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
			url = 'http://'+$rootScope.hostName+'/lawyer/list_lawyers?type='+$scope.type+'&q='+params.q+'&size='+size+'&page='+page;
			$ionicLoading.show();
			console.info(url);
			$http.get(url)
				.success(function(data) {
					if(data && data.data && data.data.length){
						$scope.items = $scope.items.concat(data.data);
						console.info($scope.items);
						if (data.data.length < size) {
							$scope.moredata = false;
						} else {
							$scope.moredata = true;
						}
					}else{
						if (page == 1) {
							$scope.moredata = false;
							$scope.nodata = false;
							//layer.show('暂无数据！');
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

//律师个人主页 - 个人介绍
lvtuanApp.controller("lawyerViewCtrl",function($scope,$http,$rootScope,$stateParams,$ionicLoading,$ionicPopup,httpWrapper,authService){

   var timestamp=Math.round(new Date().getTime()/1000);
   	$scope.isshow = false;
    $scope.context_min100 = '';
    $scope.context_all = '';
 	$ionicLoading.show();
	httpWrapper.get('http://'+$rootScope.hostName+'/lawyer/'+$stateParams.id, function(data){
		$scope.items = data.data;
		$scope.info = $scope.items.introduce + $scope.items.experience + $scope.items.signature;
		$scope.dian = '...';
		if($scope.info == "null"){
			$scope.isshow = false;
			$scope.context = false;
		}else if($scope.info != 0){
			$scope.context_min100 = $scope.info.substr(0, 90);
			$scope.context_all = $scope.info.substr(90);
			$scope.isshow = true;
		}else{
			$scope.context = false;
		}
		sessionStorage.setItem("lawyer_id", JSON.stringify($scope.items.id));
		console.info($scope.items);
		$ionicLoading.hide();
	});

	$http.get('http://'+$rootScope.hostName+'/lawyer/'+$stateParams.id+'/articles?order=latest&rows_per_page=1&ts='+timestamp).success(function(data) {
        	$scope.articles = data.data[0];
		})

	$http.get('http://'+$rootScope.hostPath+'/evaluate/'+$stateParams.id+'?size=1&ts='+timestamp).success(function(data) {
        	$scope.extras = data.data.extras;
		})


	//显示隐藏
	$scope.context = true;
	$scope.context_toggle = function(){
		$scope.context = !$scope.context;
		$(".context").slideToggle(1500); 
	}

	//关注
	$scope.follow = function(id){
		$http.post('http://'+$rootScope.hostName+'/follow',
			{
				follow_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
        	console.info(data);
        	$scope.items.follower_count--;
        	$scope.items.is_following = false;
           layer.show("取消成功！");
        });
	}

	//立即预约
	$scope.active = true;
	$scope.question_type = 'pay_text';
	$scope.toggle = function(val){
		if(val == 'pay_text'){
			$scope.active = true;
		}else{
			$scope.active = false;
		}
		//$scope.active = !$scope.active;
		$scope.question_type = val;
	}
	$scope.showIonicPopup = function(){
		var currentUser = authService.getUser();
		console.info(currentUser);
		if(currentUser == null){
			$rootScope.$broadcast('unauthenticated');
		}else{
			// 自定义弹窗
	        var myPopup = $ionicPopup.show({
	       	 templateUrl: 'my-reservationNow.html',
	         scope: $scope,
	         buttons: [
	           { text: '取消',
	           	 type:'button-light'
	       		},
	           {
	             text: '确认',
	             type: 'button-cff2f5f',
	             onTap: function(e) {
	             	location.href='#/graphic/'+$scope.question_type+'?id='+$scope.items.id;
	             	myPopup.close();
	             }
	           },
	         ]
	       });
	       myPopup.then(function(res) {
	         
	       });
		}
	}
})

//找律师-图文咨询
lvtuanApp.controller("graphicCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,$ionicLoading,listHelper,httpWrapper,authService){

    $scope.type = $stateParams.type;
    $scope.id = $stateParams.id;

    $scope.content; //假设这是你textarea上的绑定
	var limit_content = 300; // 假设文本长度为 300
	$scope.$watch('content', function(newVal, oldVal) {
	    if (newVal && newVal != oldVal) {
	        if (newVal.length >= limit_content) {
	            $scope.content = newVal.substr(0, limit_content); // 这里截取有效的300个字符
	        }
	    }
	})

    //提交问题
	$scope.submit = function(){
		var currentUser = authService.getUser();
		if(currentUser.status == 1 || currentUser.status == 2){
			var param = {};
			if($scope.id){
				param['lawyer_id'] = $scope.id;
			}
			if($scope.content){
				param['content'] = $scope.content;
			}
			console.info(param);
	        $ionicLoading.show();
			httpWrapper.request('http://'+$rootScope.hostName+'/center/question/create/'+$scope.type,'post',param,
				function(data){
					layer.show("提交成功！");
					location.href='#/questions/order/pay/'+data.data.data;
					$ionicLoading.hide()
				},function(data){
					console.info(data);
				}
			);
		}else{
			layer.show("您是律师用户，无此服务!");
		}
	}

})

//律师个人主页 - 发表文章 -点赞最多
lvtuanApp.controller("lawyerArticleLikeMostCtrl",function($scope,$http,$rootScope,$stateParams,listHelper){
	//点赞最多
	var id = JSON.parse(sessionStorage.getItem("lawyer_id"));
	listHelper.bootstrap('/lawyer/'+id+'/articles?order=like', $scope);
})
//律师个人主页 - 发表文章 -最近发布
lvtuanApp.controller("lawyerArticleLatelyEditingCtrl",function($scope,$http,$rootScope,$stateParams,listHelper){
	//最近发布
	var id = JSON.parse(sessionStorage.getItem("lawyer_id"));
	listHelper.bootstrap('/lawyer/'+id+'/articles?order=latest', $scope);
})






//律师个人主页-咨询回复
lvtuanApp.controller("advisoryCtrl",function($scope,$http,$rootScope,$stateParams,listHelper){
	//咨询回复
	listHelper.bootstrap('/lawyer/'+$stateParams.id+'/questions', $scope);
})

//律师个人主页-成交记录
lvtuanApp.controller("dealrecordCtrl",function($scope,$http,$rootScope,$stateParams,listHelper){
	//成交记录
	listHelper.bootstrap('/lawyer/'+$stateParams.id+'/deals', $scope);
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
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
        	console.info(data);
        	var itmes = data.data;
        	$scope.items[index].post_extra.likes_count = itmes.likes_count;
           layer.show("点赞成功！");
        });
	}
})



/****************************************************** 问律师 ******************************************************/

//问律师
lvtuanApp.controller("questionsCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,$state,$ionicLoading,$location,httpWrapper,authService){
	/*$('.textareacss').focus();
	angular.element('.textareacss').focus();*/

	
	/*$scope.textfocus = function(){
		$scope.isActive = true;
		 var windowHeight = document.documentElement.clientHeight;
    	document.body.style.height = windowHeight + 'px';

	}
	$scope.textblur = function(){
		$scope.isActive = false;
	}*/

/*

	$("textarea").focus(function(){
		document.activeElement.blur();
 $("input").blur();
	  setTimeout(function() {        
	  	document.activeElement.focus();
 $("input").focus();
			$('.scroll-content').css({
								  "height":"100%"
								  });    
		}, 2000);   
	     
	});
	$("input").focus(function(){

	  
document.activeElement.blur();
 $("input").blur();
	setTimeout(function() {      
	document.activeElement.focus();
 $("input").focus();  
			$('.scroll-content').css({
								  "height":"100%"
								  });    
		}, 2000);   
	});*/

	$scope.post_id_status = JSON.parse(localStorage.getItem('post_id_status'));
	var timeoutHandler = null;
	if($scope.post_id_status == true){
	
		//普通用户个人信息
		layer.show('提交成功！');
		if(timeoutHandler){
	         clearTimeout(timeoutHandler);
	     }
	     timeoutHandler = setTimeout(function(){
	         location.href='#/questionslist';
	         localStorage.removeItem('post_id_status');
	         localStorage.removeItem('post_id');
     	},2000);
		
	}
	
	var currentUser = authService.getUser();
    $ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/lawyer/workscopes')
		.success(function(data) {
	      if(data.data){
	        $scope.workscopes = data.data;
	        $scope.addArry = [
											{	
												"key"		:"",
												"value" 	: "选择咨询类别"
											}
										]
			        
			$scope.workscopes = $scope.addArry.concat($scope.workscopes);
			$scope.name = $scope.workscopes[0].value;
	      }else{
	      	layer.show("暂无数据！");
	      }
          $ionicLoading.hide();
	    });
	
	$scope.visible = true;
	$scope.rgba = true;
	$scope.key = "";
    $scope.toggle = function () {
        $scope.visible = !$scope.visible;
        $scope.rgba = !$scope.rgba;
    }
	$scope.inShowscopes = function(key) {
		var value = false;
		if (key == $scope.key) {
			value = true;
		}
		return value;
	}
	
	$scope.getval = function(key,val){
    	$scope.visible = !$scope.visible;
    	$scope.rgba = !$scope.rgba;
		$scope.name = val;
		$scope.key = key;
    }

    //用户输入框字数限制
	$scope.title; //假设这是你input上的绑定
	var limit_title = 100; // 假设文本长度为 100
	$scope.$watch('title', function(newVal, oldVal) {
	    if (newVal && newVal != oldVal) {
	        if (newVal.length >= limit_title) {
	            $scope.title = newVal.substr(0, limit_title); // 这里截取有效的30个字符
	        }
	    }
	})

	$scope.content; //假设这是你textarea上的绑定
	var limit_content = 1000; // 假设文本长度为 1000
	$scope.$watch('content', function(newVal, oldVal) {
	    if (newVal && newVal != oldVal) {
	        if (newVal.length >= limit_content) {
	            $scope.content = newVal.substr(0, limit_content); // 这里截取有效的300个字符
	        }
	    }
	})

    //提交问题
	$scope.question_Submit = function(){
		var param = layer.getParams("#questions_form");
		if($scope.key.length < 1){
			layer.show("请选择咨询类别！");
			return false;
		}else{
			param['cat_id'] = $scope.key;;
		}
		console.info(param);

       $ionicLoading.show();
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/insert/question','post',param,
			function(data){
				console.info(data);
				var post_id = data.data.data.post_id;
				localStorage.setItem("post_id", JSON.stringify(post_id));
				if(currentUser == null){
					$scope.post_id_status = false;
					localStorage.setItem("post_id_status", JSON.stringify($scope.post_id_status));
					sessionStorage.setItem("goback", $location.absUrl());
					layer.show("请先登录！");
					location.href='#/login';
				}else{
					if(currentUser.status == 3){
						layer.show("律师不能提交问题！");
						return false;
					}else{
						layer.show("提交成功！");
	                	$ionicLoading.hide();
	                	location.href='#/questionslist';
					}
				}
			},function(data){
	        	console.info(data.error_messages);
	        	if(data.error_messages != undefined){
	        		var errMsg = JSON.stringify(data.error_messages.content[0]);
	        		layer.show(errMsg);
	        	}
	        	
	        	
			}
		);
	}

})

//问律师列表
lvtuanApp.controller("questionslistCtrl",function($http,$scope,$state,$rootScope,$ionicLoading,authService){

	$scope.orders = [
						{
							"key"	:"",
							"value" : "筛选"
						},
						{
							"key"	:"collect",
							"value" : "收藏最多"
						},
						{
							"key"	:"comment",
							"value" : "回答最多"
						}
					];


	getWorkscopes();
	//获取法律专长

	function getWorkscopes(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostPath+'/workscope')
			.success(function(data) {
				$scope.workscopes = data.data;
				if($scope.workscopes.length > 0){
					$scope.showscopes = $scope.workscopes;
					$scope.workscopes = data.data;
			        $scope.addArry = [
											{	
												"key"		:"",
												"value" 	: "咨询类别"
											}
										]
			        
					$scope.workscopes = $scope.addArry.concat($scope.workscopes);
					$scope.workscope = $scope.workscopes[0].value;	
				}
				$ionicLoading.hide();
			})
	}

	//声明变量并赋值
	$scope.visible = true;  	//咨询类别下拉列表
	$scope.visible1 = true;		//筛选下拉列表
	$scope.masklayer = true; 	//遮罩层
	$scope.order = $scope.orders[0].value;
	$scope.scopes_key = "";
	$scope.orders_key = "";

	//显示隐藏层
    $scope.toggle = function () {
        $scope.visible = !$scope.visible;
        $scope.masklayer = !$scope.masklayer;
    }

    $scope.toggle1 = function () {
        $scope.visible1 = !$scope.visible1;
        $scope.masklayer = !$scope.masklayer;
    }

    //给弹出层选中的项加上背景颜色
	$scope.inShowscopes = function(key) {
		var value = false;
		$scope.key = $scope.scopes_key;
		if (key == $scope.key) {
			value = true;
		}
		return value;
	}
	$scope.inorders = function(key) {
		var value = false;
		$scope.key = $scope.orders_key;
		if (key == $scope.key) {
			value = true;
		}
		return value;
	}
	
	//获取咨询类别选中的值
	$scope.getWorkscopeVal = function(key,val){
    	$scope.visible = !$scope.visible;
    	$scope.masklayer = !$scope.masklayer;
		$scope.workscope = val;
		$scope.scopes_key = key;
		page = 1;
		$scope.items = [];
		get_Param();
    }
    //获取筛选选中的值
    $scope.getOrderVal = function(key,val){
		$scope.visible1 = !$scope.visible1;
		$scope.masklayer = !$scope.masklayer;
		$scope.order = val;
		$scope.orders_key = key;
		page = 1;
		$scope.items = [];
		get_Param();
    }


    var page = 1; //页数
	var size = 5; // 每页的数量
	if ($scope.size) {
		size = $scope.size;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据
    var timestamp=Math.round(new Date().getTime()/1000);

	//获取参数
	function get_Param(){
		var param = []; //声明一个数组 判断如果有值就push进来
		if($scope.scopes_key){
	  		param.push('post_category=' + $scope.scopes_key);
	  	}
	  	if($scope.orders_key){
	  		param.push('order=' + $scope.orders_key);
	  	}
	  	param = param.join('&');  //通过join('&') 把所有的参数都拼接起来
	  	console.info($scope.param)
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
		//获取推荐的律师 ?is_recommended=1&page=1&size=10
		get_Param();
	};

	//根据参数向后台拉取数据
	function geturl(param){
		$scope.nodata = true;
		var url;
		if(param != ""){
	  		url = 'http://'+$rootScope.hostPath+'/question?type=question&'+param+'&size='+size+'&page='+page+'&ts='+timestamp;
	    }else{
	    	url = 'http://'+$rootScope.hostPath+'/question?type=question&size='+size+'&page='+page+'&ts='+timestamp;
	    }
	    $ionicLoading.show();
		$http.get(url)
			.success(function(data) {
	        	console.info(data.data)
	        	if(data && data.data && data.data.length){
					$scope.items = $scope.items.concat(data.data);
					console.info($scope.items);
					if (data.data.length < size) {
						$scope.moredata = false;
					} else {
						$scope.moredata = true;
					}
				}else{
					if (page == 1) {
						$scope.moredata = false;
						$scope.nodata = false;
					}
					$scope.moredata = false;
				}
				page++;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			})
	}

	//发布问题
	//判断是否是律师
	$scope.jumpGoQuestions = function(){
		var currentUser = authService.getUser();
		if(currentUser == null){
	   		location.href='#/questions';
	   		return false;
	   	}else{
	   		if(currentUser.status == 1 || currentUser.status == 2){
				//普通用户个人信息
				location.href='#/questions';
			}else{
				//律师个人信息
				layer.show('您是律师用户，无此服务!');
			}
	   	}
	}

})

//问律师搜索
lvtuanApp.controller("questionslistsearchCtrl",function($http,$scope,$state,$rootScope,$ionicLoading){
	angular.element('.search').trigger('focus');
	var page = 1; //页数
	var size = 5; // 每页的数量
	if ($scope.size) {
		size = $scope.size;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

	//搜索问题
	$scope.q = '';
	$scope.$watch('q', function(newVal, oldVal) {
		if (newVal && newVal !== oldVal) {
			page = 1;
			$scope.items = [];
	        $scope.loadMore();
	    }else{
	    	page = 1;
			$scope.items = [];
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
		var timestamp=Math.round(new Date().getTime()/1000);
		var url = "";
		if(params.q != ""){
			url = 'http://'+$rootScope.hostPath+'/question?type=question&q='+params.q+'&size='+size+'&page='+page+'&ts='+timestamp;
			$ionicLoading.show();
			$http.get(url)
				.success(function(data) {
					if(data && data.data && data.data.length){
						$scope.items = $scope.items.concat(data.data);
						console.info($scope.items);
						if (data.data.length < size) {
							$scope.moredata = false;
						} else {
							$scope.moredata = true;
						}
					}else{
						if (page == 1) {
							$scope.moredata = false;
							$scope.nodata = false;
							//layer.show('暂无数据！');
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
lvtuanApp.controller("questionsviewsCtrl",function($http,$scope,$rootScope,$stateParams,$ionicLoading,authService){

	//获取律师的个人信息
	var timestamp=Math.round(new Date().getTime()/1000);
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/question/'+$stateParams.id+'?ts='+timestamp)
		.success(function(data) {
        	console.info(data.data);
        	$scope.items = data.data;
        	$ionicLoading.hide();
		})/*.finally(function(data) {
	    	$ionicLoading.hide();
	    });*/


	var currentUser = authService.getUser();
	$scope.isUser = function(id){
		if(currentUser == null){
			$rootScope.$broadcast('unauthenticated');
		}else{
			if(currentUser.status == 1 || currentUser.status == 2){
				layer.show('普通用户无法回答问题');
			}else{
				location.href = '#/questions/comment/'+id;
			}
		}
		
	}



	//收藏
	$scope.collects = function(id){

		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/collect',
			{
				collect_type : 1,
				item_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
        	$scope.items.post_extra.collects_count = data.data;
        	$scope.items.is_collect = true;
        	$ionicLoading.hide();
            layer.show("收藏成功！");
        });
	}

	//取消收藏
	$scope.collects_del = function(id){
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/collect/delete',
			{
				collect_type : 1,
				item_id   : id
			},
			{
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
        	$scope.items.post_extra.collects_count -= 1;;
        	$scope.items.is_collect = false;
        	$ionicLoading.hide();
            layer.show("成功取消收藏！");
        });
	}

	//点赞
	$scope.likes = function(id,index){
		$http.post('http://'+$rootScope.hostName+'/like',
		{
			item_type : 'comment',
			item_id   : id
		}).success(function(data) {
        	var likes_count = data.data.likes_count;
        	$scope.items.comments[index].like_count = likes_count;
        	$scope.items.comments[index].is_liked = true;
            layer.show("点赞成功！");
        });
	}

	//取消点赞
	$scope.likes_del = function(){
		layer.show("你已经点赞啦！");
	}

	//打赏
	$scope.areward = function(id){
		localStorage.setItem("questions_back_id", JSON.stringify($stateParams.id));
	   	if(currentUser == null){
	   		location.href='#/login';
	   		return false;
	   	}
		if(currentUser.status == 1 || currentUser.status == 2){
			//普通用户个人信息
			location.href = '#/questions/areward/'+id;
		}else{
			layer.show("您是律师用户，无此服务!");
		}
		
	}

})

//咨询评论
lvtuanApp.controller("questionsCommentCtrl",function($http,$scope,$rootScope,$stateParams,$ionicLoading,authService){
	console.info($stateParams.id);
	$scope.currentUser = authService.getUser();

	$scope.submit = function(){
		console.info($scope.comment);
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/question/'+$stateParams.id+'/comment',
		{
			comment 	: $scope.comment,
			creator_id	: $scope.currentUser.id
		}).success(function(data) {
	    	console.info(data);
	    	location.href = '#/questionsview/'+$stateParams.id;
	        layer.show("回答成功！");
	        $ionicLoading.hide();
	    });
	}
	
})

//送心意 - 打赏
lvtuanApp.controller("questionsArewardCtrl",function($scope,$http,$rootScope,$stateParams,$ionicPopup,$location,$ionicLoading,authService,wxService){

	var num_arr = [1,2,3,4,5,6,7,8,9];
	var index = parseInt((Math.random() * num_arr.length));
	$scope.money = num_arr[index];
	//产生随机数
	$scope.mathRandom = function(){
		var index = parseInt((Math.random() * num_arr.length));
		$scope.money = num_arr[index];
		console.info(num_arr[index]);
	}

	//去打赏
	$scope.rewardsPlay = function(){
		$ionicLoading.show();
		$scope.freeQuestion = 'areward';
		localStorage.setItem("lawyer_id", JSON.stringify($stateParams.id));
		localStorage.setItem("freeQuestion", JSON.stringify($scope.freeQuestion));
		localStorage.setItem("lawyer_order_moeny", JSON.stringify($scope.money));
		$http.post('http://'+$rootScope.hostName+'/order/reward',
		{
			lawyer_id : $stateParams.id,
			money 	: $scope.money
		}).success(function(data) {
			location.href = '#/questions/areward/pay/'+data.data.order_id+'?lawyer_id='+$stateParams.id;
	       $ionicLoading.hide();
	    });
	}
})



//送心意
lvtuanApp.controller("questionsArewardPayCtrl",function($scope,$http,$rootScope,$stateParams,$location,$ionicLoading,authService,wxService){
	console.info($stateParams.id);

	$scope.user = {
		'radioval' : 'wx_pub'
	}
	$scope.questions_back_id = JSON.parse(localStorage.getItem('questions_back_id'));
	$scope.lawyer_order_moeny = JSON.parse(localStorage.getItem('lawyer_order_moeny'));
	console.info($scope.mymoney);

	$ionicLoading.show();
	var timestamp=Math.round(new Date().getTime()/1000);
    $http.get('http://'+$rootScope.hostName+'/center/pay/question/'+$stateParams.id+'/view?type=1&ts='+timestamp)
    .success(function(data) {
        $scope.items = data.data;
        console.info($scope.items);
        $ionicLoading.hide();  
    })
	
	//微信支付
    $scope.wap_pay = function(user){
    		console.info(user);
            if (user.radioval == 'qianbao') {
            	$ionicLoading.show();
                $http.post('http://'+$rootScope.hostName+'/wallet/reward', 
                {
					user_id : $stateParams.lawyer_id,
					money	: $scope.items.price,
					order_id: $scope.items.id
				}).success(function(data) {
					console.info(data);
					var stateObj = { states: "areward" };
					history.replaceState(stateObj, "areward", $location.absUrl());

					location.href = '#/questionsview/'+$scope.questions_back_id;
					layer.show("送心意成功！");
					localStorage.removeItem('questions_back_id');
					localStorage.removeItem('lawyer_order_moeny');
                    $ionicLoading.hide();
                });

            } else {

				main(wxService.getOpenId(),$scope.lawyer_order_moeny);
			}

		function main(openid,money){
	    	var currentUser = authService.getUser();
	    	var param = {};
				param.device = 'wechat';
				param.channel = user.radioval;
				param.amount = money * 100;
				param.subject = '免费咨询';
				param.body = '送心意';
				param.open_id = openid;
				param.current_user_id = currentUser.id;
				param.metadata = {};
				param.metadata.pay_type = 'wallet_reward';
				param.metadata.user_id = $stateParams.id;
				param.metadata.from_user_id = currentUser.id;

	        	console.info(param);
	        $ionicLoading.show();
	    	$http.post('http://'+$rootScope.hostName+'/payment_gateway/charge',param)
			.success(function(data) {
	        	console.log(data);
	        	pingpp.createPayment(data, function(result, error){
				    if (result == "success") {
				        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
						location.href = '#/questionsview/'+$scope.questions_back_id;
						layer.show("送心意成功！");
						localStorage.removeItem('questions_back_id');
						localStorage.removeItem('lawyer_order_moeny');
	                    $ionicLoading.hide();

				    } else if (result == "fail") {
				        // charge 不正确或者微信公众账号支付失败时会在此处返回
				        layer.show("支付失败，请稍候再试。");
				        $ionicLoading.hide();
				    } else if (result == "cancel") {
				        // 微信公众账号支付取消支付
				        layer.show("您已取消支付。");
				        $ionicLoading.hide();
				    }
				});

	        });
	    }
    }
})

//订单支付
lvtuanApp.controller("questionsOrderPpayCtrl",function($scope,$http,$rootScope,$stateParams,$ionicPopup,$location,$ionicLoading,authService,wxService,listHelper,httpWrapper){
	console.info($stateParams.id);
	$scope.user = {
		'radioval' : 'wx_pub'
	}

	$ionicLoading.show();
	var timestamp=Math.round(new Date().getTime()/1000);
	$scope.items = {};
    $http.get('http://'+$rootScope.hostName+'/center/pay/question/'+$stateParams.id+'/view?ts='+timestamp)
    .success(function(data) {
        $scope.items = data.data;
        console.info($scope.items);
        $ionicLoading.hide();  
    })
	
	//微信支付
	$scope.wap_pay = function(user){
		alert('0',JSON.stringify(user));
            if(user.radioval == 'qianbao') {
					var confirmPopup = $ionicPopup.confirm({
						title: '是否立即付款？',
						cancelText: '取消',
						okText: '确认',
	        		});
             		confirmPopup.then(function(res) {
		               if(res) { 
		               		$ionicLoading.show();
			               	httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+$stateParams.id+'/pay/wallet','post',null,
								function(data){
			                        $scope.items = data.data;
			                        var stateObj = { states: "order" };
									history.replaceState(stateObj, "order", $location.absUrl());

									location.href = '#/user/order/list';
									layer.show("付款成功！");
			                        $ionicLoading.hide();
								},function(data){
									console.info(data);
								}
							);

		               }else{
		                 return false;
		               }
             		});
            } else {
				main(wxService.getOpenId());
			}

		function main(openid){
	    	var currentUser = authService.getUser();
	    	var type = 'order';
	    	var param = {};
	    		param.order_no = $scope.items.order_no;
				param.device = 'wechat';
				param.channel = user.radioval;
				param.amount = $scope.items.price * 100;
				param.subject = $scope.items.type;
				param.body = $scope.items.title;
				param.open_id = openid;
				param.current_user_id = currentUser.id;
				param.metadata = {};
				param.metadata.pay_type = type;
				if(type != null){
	        		if(type == 'order' ){
	        			param.metadata.question_id = $scope.items.post_id;
	        		}
	        	}
	        	console.log(param);
	        	alert('1',JSON.stringify(param));
	        $ionicLoading.show();
	    	$http.post('http://'+$rootScope.hostName+'/payment_gateway/charge',param)
			.success(function(data) {
	        	console.log(data);
	        	pingpp.createPayment(data, function(result, error){
				    if (result == "success") {
				        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
	                    location.href = '#/user/order/list';
						layer.show("付款成功！");
                    	$ionicLoading.hide();
				    } else if (result == "fail") {
				        // charge 不正确或者微信公众账号支付失败时会在此处返回
				        layer.show("支付失败，请稍候再试。");
				        $ionicLoading.hide();
				    } else if (result == "cancel") {
				        // 微信公众账号支付取消支付
				        layer.show("您已取消支付。");
				        $ionicLoading.hide();
				    }
				});

	        });
	    }
    }

})
/*———————————————————————————— 首页八模块 ————————————————————————————*/

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


/*———————————————————————————— 我的律团 - 律师的律团 ————————————————————————————*/

//咨询和订单的一对一咨询 - 即时通讯
lvtuanApp.controller("easemobmainCtrl",function($scope,$http,$state,$rootScope,$stateParams,$timeout,$ionicLoading,easemobService,httpWrapper,authService){
	$scope.$on('$locationChangeSuccess', function(newState,oldState) {  
		if(newState != oldState){
			window.location.reload();
		}else{
			return false;
		}	
	})

	var currentUser = authService.getUser();
		currentUser.associate_id = $stateParams.id;
		localStorage.setItem('currentUser', JSON.stringify(currentUser));

	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/center/question/'+$stateParams.id+'/ask'
    ).success(function(data) {
    	if (data && data.data) {
	    	$scope.items = data.data;
	    	console.info($scope.items);
			$scope.curChatUserId = $scope.items.user_id;
			$scope.curUserId = $scope.items.easemob_id;
			easemobService.init($scope.items.user_id,"chat");
			easemobService.login($scope.items.easemob_id.toString(), $scope.items.easemob_pwd);
		}
	})

    /*$scope.visible = true;
    $scope.toggle = function(){
    	$scope.visible = !$scope.visible;
    }*/

    $scope.arry = [];
    var page = 1;
    var rows_per_page = 10;

	$scope.loadMore = function() {
	    var str = '';
	    var url = 'http://'+$rootScope.hostName+'/question/'+$stateParams.id+'/comment_list?page='+page+'&rows_per_page='+rows_per_page;

		$ionicLoading.show();
		$http.get(url)
		.success(function(data) {
            obj = data.data.comments;

            console.info(obj);
            console.info($scope.arry);

            if($scope.arry.length > 0) {
            	for(var i=0; i<obj.length; i++){
            		//判断是否有重复的数据
            		for(var j=0; j<$scope.arry.length;j++){
            			if(obj[i].id == $scope.arry[j]){
            				console.info(obj[i].id,$scope.arry[j]);
            				continue;
            			}else{
            				console.info(obj[i].id);
            				style = "left";
			                if(obj[i].creator_id == $scope.curUserId) {
			                    str+='<div class="easemobmain-record img-right" style="text-align:right;">';
			                } else {
			                    str+='<div class="easemobmain-record img-left" style="text-align:left;">';
			                }
			                str+='<p1>'+obj[i].created_at+'<span></span></p1>';
			                str+='<p2>'+obj[i].creator_name+'<b></b></p2>';
			                str+='<img src='+obj[i].creator_avatar+'><br>';
			                str+='<p3 class="chat-content-p3" className="chat-content-p3">'+obj[i].content+'</p3>';
			                str+='</div>';
            			}
            		}
	            }
            }else{
            	for(var i=0; i<obj.length; i++){
	                style = "left";
	                if(obj[i].creator_id == $scope.curUserId) {
	                    str+='<div class="easemobmain-record img-right" style="text-align:right;">';
	                } else {
	                    str+='<div class="easemobmain-record img-left" style="text-align:left;">';
	                }
	                str+='<p1>'+obj[i].created_at+'<span></span></p1>';
	                str+='<p2>'+obj[i].creator_name+'<b></b></p2>';
	                str+='<img src='+obj[i].creator_avatar+'><br>';
	                str+='<p3 class="chat-content-p3" className="chat-content-p3">'+obj[i].content+'</p3>';
	                str+='</div>';
	            }
            }

            if(obj.length < rows_per_page) {
            	$("#comments-list").hide();
            }
            $("#page").after(str);
            $("#page").css('display', 'none');
            page++;
            $ionicLoading.hide();

		}).error(function(data) {
            console.info(data);
            var error =  $.parseJSON(data.responseText);
            layer.show(error.error_messages);
            console.info(error);
		});
	}

	$scope.sendText = function() {
		var comment = $('#talkInputId').val();
		var result = easemobService.sendText("chat");
		if (result) {
			$scope.saveComment(comment);
		}
	}
	
	/*$scope.textKeyDown = function($event) {
		if ($event.keyCode == 13) {
	        if ($event.altKey) {
	            e = $event.target.value;
	            $(this).val(e + '\n');
	        } else {
	            $scope.sendText();
	            $event.preventDefault();
	        }
		}
	}*/


	$scope.saveComment = function(comment) {
        var comment = comment;
        var creator_id = $scope.curUserId;
        var url = 'http://'+$rootScope.hostName+'/question/'+$stateParams.id+'/comment';

		$http.post(url,
			{
				comment : comment,
				creator_id	: creator_id
			}
		)
		.success(function(data) {
            console.info(data);
            $scope.arry.push(data.data.id);
            console.info($scope.arry);
		})
		.error(function(data) {
            console.info(data);
		})
	}

	/*$scope.textClick = function(){
		$(".chat02").addClass("activer");
	}

	$scope.textBlur = function(){
		$(".chat02").removeClass("activer");
	}*/


})


/*———————————————————————————— 我的律团 - 用户的律团 ————————————————————————————*/


/*———————————————————————————— 用户 - 我的 - 咨询管理 ————————————————————————————*/
//用户 - 咨询管理
lvtuanApp.controller("userQuestionListCtrl",function($scope,$rootScope,$ionicLoading,listHelper_hostPath){

	listHelper_hostPath.bootstrap('/user/question?type=creator', $scope);
})
//用户 - 订单管理
lvtuanApp.controller("userOrderListCtrl",function($scope,$rootScope,$ionicLoading,listHelper,listHelper_hostPath,httpWrapper){
	listHelper.bootstrap('/center/question/list', $scope);
})
//用户 - 订单管理
lvtuanApp.controller("userOrderViewCtrl",function($scope,$rootScope,$ionicLoading,$stateParams,$ionicPopup,httpWrapper){
	console.info("咨询详情");

	$ionicLoading.show();
	httpWrapper.get('http://'+$rootScope.hostName+'/center/question/'+$stateParams.id+'/view', function(data){
		$scope.items = data.data;
		if($scope.items.transitions.length > 0){
			$scope.isHastabs = 'has-tabs';
		}else{
			$scope.isHastabs = 'not';
		}
		console.info($scope.items);
		$ionicLoading.hide();
		console.info($scope.items);
		$ionicLoading.hide();
	});


	//确认完成
	//确认
	/*$scope.to_complete = function(url){
		var confirmPopup = $ionicPopup.confirm({
	           title: '律师已经解答您的问题？',
	           cancelText: '取消',
	           okText: '确认',
	        });
			confirmPopup.then(function(res) {
               if(res) {
                    httpWrapper.request(url,'post',null,
						function(data){
							layer.show("确认成功！");
							window.location.reload();
						},function(data){
							console.info(data);
						}
					);
               }else{
                 return false;
               }
            });
	}*/

	$scope.to_complete = function(url){
		var confirmPopup = $ionicPopup.confirm({
			   template: '<p style="text-align: center;">律师已经解答您的问题？</p>', // String (可选)。放在弹窗body内的html模板。
	           cancelText: '取消',
	           cancelType: 'button-light',
	           okText: '确认',
	           okType: 'button-positive'
	        });
			confirmPopup.then(function(res) {
               if(res) {
               		$ionicLoading.show();
                    httpWrapper.request(url,'post',null,
						function(data){
							$ionicLoading.hide();
							layer.show("确认成功！");
							window.location.reload();
						},function(data){
							console.info(data);
						}
					);
               }else{
                 return false;
               }
            });
	}

    // 联系律师
    $scope.to_lawyer = function() {
	    var alertPopup = $ionicPopup.alert({
	     	title: '<div class="popup-head1">正在与您连接律师，请稍后...</div>',
	       template: '<div style="text-align: center;padding-top:20px;"><img ng-src="../img/phone.gif" style="width: 80%;"></div>',
	       okText: '返回',
		   okType: 'button-cff2f5f'
	    });
	    alertPopup.then(function(res) {
       		alertPopup.close();
        });
		httpWrapper.request('http://'+$rootScope.hostPath+'/callback/'+$stateParams.id,'get',null,
			function(data){
				$timeout(function(){
					alertPopup.close();
				}, 5000);
			},function(data){
				alertPopup.close(); 
			}
		);
	};

	//服务评价
	$scope.to_evaluate = function(id){
		location.href='#/confirmCompletion/'+id;
	}

	//联系律师
	$scope.to_ask = function(id){
		location.href='#/easemobmain/'+id;
	}

})

//用户的工作 - 咨询 － 评价
lvtuanApp.controller("confirmCompletionCtrl",['$scope','$http','$rootScope','$stateParams','$ionicLoading','httpWrapper',
  function($scope,$http,$rootScope,$stateParams,$ionicLoading,httpWrapper){
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
    $scope.tags = {
					"tags_1_2" :[
						'服务态度差','专业能力差','办事效率低','回复速度慢'
					],
					"tags_3" :[
						'服务态度一般','专业能力一般','办事效率一般','回复速度一般'
					],
					"tags_4_5" :[
						'服务态度好','回复速度快','专业程度高','主动热情','解答详细'
					]
						
				}

      $scope.max = 5;
	  $scope.ratingVal = 5;
	  $scope.readonly = false;
	  $scope.evaluates = $scope.tags.tags_4_5;
	  $scope.onHover = function(val){
	    $scope.hoverVal = val;
	  };
	  $scope.onLeave = function(){
	    $scope.hoverVal = null;
	  }
	  $scope.onChange = function(val){
	  	console.info(val);
	    $scope.ratingVal = val;
	    if(val == 1 || val == 2){
	    	$scope.evaluates = $scope.tags.tags_1_2;
	    }else if(val == 3){
			$scope.evaluates = $scope.tags.tags_3;
	    }else{
	    	$scope.evaluates = $scope.tags.tags_4_5;
	    }

	  }

    $scope.type = JSON.parse(localStorage.getItem('type'));


    //anglarjs 想要input双向绑定，必须先把值初始化一次; 页面input不能清空就是这个问题
    $scope.inShowtags = function(key){
      var value = false;
      for(var i=0; i<$scope.tag_arry.length; i++){
        if($scope.tag_arry[i] == key){
          value = true;
        }
      }
      return value;
    }

    $scope.tag_arry = [];
    $scope.click_tag = function(key,val){
      if($scope.tag_arry.length < 1){
        $scope.tag_arry.push(key);
      }else{
        for(var i=0; i<$scope.tag_arry.length; i++){
          if($scope.tag_arry[i] == key){
            $scope.tag_arry.remove(i);
            console.info('01',$scope.tag_arry);
            return false;
          }
          continue;
        }

        $scope.tag_arry.push(key);
        console.info('1',$scope.tag_arry);
        return false;

      }
    }

      //提交
      $scope.submit = function(){
      	var evaluate_comment = $('.evaluate_comment').val();
      	var params = {};
		if($scope.ratingVal){
			params["evaluate_score"] = $scope.ratingVal;
		}
		if(evaluate_comment.length > 0){
			params["evaluate_comment"] = evaluate_comment;
		}else{
			layer.show("请评价律师的服务！");
			return false;
		}
		if($scope.tag_arry.length > 0){
			params["evaluate_tags"] = $scope.tag_arry;
		}else{
			layer.show("请评价律师的服务！");
			return false;
		}
        httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+$stateParams.id+'/evaluate','post',params,
	      function(data){
	        layer.show("评价成功！");
	        $scope.tag_arry = [];
	        $scope.evaluates = $scope.tags.tags_4_5;
	        location.href='#/user/order/list';
	        window.location.reload();
	      },function(data){
	        console.info(data);
	      })
      }

}])

//用户的工作 - 咨询 － 聊天记录
lvtuanApp.controller("userEasemobViewCtrl",function($http,$scope,$rootScope,$ionicLoading,$stateParams,listHelper_hostPath,httpWrapper,authService){
	console.info('聊天记录');

	var timestamp=Math.round(new Date().getTime()/1000);
	$scope.currentUser = authService.getUser();
	var page = 1; //页数
	var rows_per_page = 10; // 每页的数量
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
			$ionicLoading.show();
			$http.get('http://'+$rootScope.hostName+'/question/'+$stateParams.id+'/comment_list?page='+page+'&rows_per_page='+rows_per_page+'&ts='+timestamp)
				.success(function(data) {
					if(data && data.data.comments && data.data.comments.length){
						$scope.items = $scope.items.concat(data.data.comments);
						console.info($scope.items);
						if (data.data.length < rows_per_page) {
							$scope.moredata = false;
						} else {
							$scope.moredata = true;
						}
					}else{
						if (page == 1) {
							$scope.moredata = false;
							$scope.nodata = false;
						}
						$scope.moredata = false;
					}
					page++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$ionicLoading.hide();
				})
		
	};
})

/*———————————————————————————— 律师 - 我的 - 咨询管理 ————————————————————————————*/

//咨询管理 - 未参与
lvtuanApp.controller("lawyerQuestionNotCtrl",function($scope,$rootScope,$ionicLoading,listHelper_hostPath,httpWrapper){
	console.info('未参与');
	listHelper_hostPath.bootstrap('/user/question?type=not_reply', $scope);
})

//咨询管理 - 已参与
lvtuanApp.controller("lawyerQuestionAlreadyCtrl",function($scope,$rootScope,$ionicLoading,listHelper_hostPath,httpWrapper){
	console.info('已参与');
	listHelper_hostPath.bootstrap('/user/question?type=reply', $scope);
})

// 律师 - 订单管理
lvtuanApp.controller("lawyerOrderListCtrl",function($scope,$rootScope,$ionicLoading,listHelper,listHelper_hostPath,httpWrapper){
	listHelper.bootstrap('/center/question/list', $scope);
})
// 律师 - 订单详情
lvtuanApp.controller("lawyerOrderViewCtrl",function($scope,$rootScope,$ionicLoading,$stateParams,$ionicPopup,$timeout,httpWrapper){
	$ionicLoading.show();
	httpWrapper.get('http://'+$rootScope.hostName+'/center/question/'+$stateParams.id+'/view', function(data){
		$scope.items = data.data;
		if($scope.items.transitions.length > 0){
			$scope.isHastabs = 'has-tabs';
		}else{
			$scope.isHastabs = 'not';
		}
		console.info($scope.items);
		$ionicLoading.hide();
	});

	//受理
	$scope.to_accept = function(url){
		$ionicLoading.show();
		httpWrapper.request(url,'post',null,
			function(data){
				$ionicLoading.hide();
				layer.show("受理成功！");
				window.location.reload();
			},function(data){
				console.info(data);
			}
		);
	}

	//服务评价
	$scope.to_evaluate = function(id){
		location.href='#/lawyer/comment/'+id;
	}

	//联系用户
	$scope.to_ask = function(id){
		location.href='#/easemobmain/'+id;
	}	

	// 联系用户
	$scope.to_user = function() {
	    var alertPopup = $ionicPopup.alert({
	     	title: '<div class="popup-head1">正在与您连接用户，请稍后...</div>',
	       template: '<div style="text-align: center;padding-top:20px;"><img ng-src="../img/phone.gif" style="width: 80%;"></div>',
	       okText: '返回',
		   okType: 'button-cff2f5f'
	    });
	    alertPopup.then(function(res) {
       		alertPopup.close();
        });
        httpWrapper.request('http://'+$rootScope.hostPath+'/callback/'+$stateParams.id,'get',null,
			function(data){
			 	$timeout(function(){
					alertPopup.close();
				}, 5000);
			},function(data){
				alertPopup.close(); 
			}
		);

	};
})


//律师订单 - 评价详情
lvtuanApp.controller("lawyerCommentCtrl",function($http,$scope,$stateParams,$rootScope,$ionicLoading,httpWrapper){

	$ionicLoading.show();
	httpWrapper.get('http://'+$rootScope.hostName+'/center/lawyer/question/'+$stateParams.id+'/evaluate/view', function(data){
		$scope.items = data.data;
		console.info($scope.items);
		$ionicLoading.hide();
	});

});


//首页 - 我的 - 付费 法律顾问
//咨询 - 待受理
lvtuanApp.controller("questionPaycompanyNewCtrl",function($scope,$rootScope,listHelper,httpWrapper){
  console.info("待受理");
  listHelper.bootstrap('/center/question/list?type=pay_company&status=new', $scope);

  //取消
  $scope.to_cancel = function(url,item){
    httpWrapper.request(url,'post',null,
      function(data){
        $scope.items.splice($scope.items.indexOf(item), 1);
        layer.show("取消成功！");
      },function(data){
        console.info(data);
      }
    );
  }

  //抢单
  $scope.to_take = function(url,item){
    httpWrapper.request(url,'post',null,
      function(data){
        layer.show("抢单成功！");
        $scope.items.splice($scope.items.indexOf(item), 1);
        location.href='#/question/paycompany/waitforconfirmation';
      },function(data){
        console.info(data);
      }
    );
  }

})

//咨询 - 待确认
lvtuanApp.controller("questionPaycompanyWaitforconfirmationCtrl",function($scope,$rootScope,$ionicPopup,listHelper,httpWrapper){
  console.info("待确认");
  listHelper.bootstrap('/center/question/list?type=pay_company&status=replied', $scope);

  //确认
  $scope.to_complete = function(url,item){
    var confirmPopup = $ionicPopup.confirm({
             title: '律师已经与您签署《法律顾问协议》？',
             cancelText: '取消',
             okText: '确认',
          });

  		confirmPopup.then(function(res) {
               if(res) {
                    httpWrapper.request(url,'post',null,
			            function(data){
			              $scope.items.splice($scope.items.indexOf(item), 1);
			              layer.show("确认成功！");
			              location.href='#/question/paycompany/waitforevaluation';
			            },function(data){
			              console.info(data);
			            }
			          );
               }else{
                 return false;
               }
            });
  }


})

//咨询 - 待评价
lvtuanApp.controller("questionPaycompanyWaitforevaluationCtrl",function($scope,$rootScope,listHelper,httpWrapper){
  console.info("待评价");
  listHelper.bootstrap('/center/question/list?type=pay_company&status=wait_for_evaluation', $scope);

    //评价
	$scope.to_evaluate = function(id,type){
		//$scope.items.splice(index, 1);
		localStorage.setItem("type", JSON.stringify(type));
		location.href='#/confirmCompletion/'+id;
	}
})

//咨询 - 已完成
lvtuanApp.controller("questionPaycompanyCompleteCtrl",function($scope,$rootScope,listHelper,httpWrapper){
  console.info("已完成");
  listHelper.bootstrap('/center/question/list?type=pay_company&status=complete', $scope);

  //删除
  $scope.to_remove = function(url,item){
    httpWrapper.request(url,'post',null,
      function(data){
        $scope.items.splice($scope.items.indexOf(item), 1);
        layer.show("删除成功！");
      },function(data){
        console.info(data);
      }
    );
  }

})

//咨询 - 已取消
lvtuanApp.controller("questionPaycompanyCancelledCtrl",function($scope,$rootScope,listHelper,httpWrapper){
  console.info("已取消");
  listHelper.bootstrap('/center/question/list?type=pay_company&status=cancelled', $scope);
  
  //删除
  $scope.to_remove = function(url,item){
    httpWrapper.request(url,'post',null,
      function(data){
        $scope.items.splice($scope.items.indexOf(item), 1);
        layer.show("删除成功！");
      },function(data){
        console.info(data);
      }
    );
  }
})

//咨询 - 咨询详情
lvtuanApp.controller("questionPaycompanyViewCtrl",function($scope,$rootScope,$ionicLoading,$stateParams,$ionicPopup,httpWrapper){
	console.info("咨询详情");

	$ionicLoading.show();
	httpWrapper.get('http://'+$rootScope.hostName+'/center/question/'+$stateParams.id+'/view', function(data){
		$scope.items = data.data;
		console.info($scope.items);
		$ionicLoading.hide();
	});

	//取消
	$scope.to_cancel = function(url,item){
	httpWrapper.request(url,'post',null,
	  function(data){
	    $scope.items.splice($scope.items.indexOf(item), 1);
	    layer.show("取消成功！");
	  },function(data){
	    console.info(data);
	  }
	);
	}

	//抢单
	$scope.to_take = function(url,item){
	httpWrapper.request(url,'post',null,
	  function(data){
	    layer.show("抢单成功！");
	    $scope.items.splice($scope.items.indexOf(item), 1);
	    location.href='#/question/paycompany/waitforconfirmation';
	  },function(data){
	    console.info(data);
	  }
	);
	}

	//确认
	$scope.to_complete = function(url){
		var confirmPopup = $ionicPopup.confirm({
	           title: '律师已经与您签署《法律顾问协议》？',
	           cancelText: '取消',
	           okText: '确认',
	        });

			confirmPopup.then(function(res) {
               if(res) {
                    httpWrapper.request(url,'post',null,
					  function(data){
					    layer.show("确认成功！");
					    location.href='#/question/paycompany/waitforevaluation';
					  },function(data){
					    console.info(data);
					  }
					);
               }else{
                 return false;
               }
            });
	}

	//评价
	$scope.to_evaluate = function(id,type){
	//$scope.items.splice(index, 1);
	localStorage.setItem("type", JSON.stringify(type));
	location.href='#/confirmCompletion/'+id;
	}

	//删除
	$scope.to_remove = function(url,item){
	httpWrapper.request(url,'post',null,
	  function(data){
	    $scope.items.splice($scope.items.indexOf(item), 1);
	    layer.show("删除成功！");
	  },function(data){
	    console.info(data);
	  }
	);
	}
  

})



//我的商品 - 列表
lvtuanApp.controller("commodityListCtrl",function($scope,$rootScope,listHelper,httpWrapper){
	console.info("我的商品");
	listHelper.bootstrap('/center/order/list', $scope);

	//取消订单
	$scope.to_cancel = function(id,item){
		httpWrapper.request('http://'+$rootScope.hostName+'/center/question/'+id+'/cancel','post',null,
			function(data){
				$scope.items.splice($scope.items.indexOf(item), 1);
				layer.show("取消成功！");
			},function(data){
				console.info(data);
			}
		);
	}

	//支付订单
	$scope.to_payorder = function(id,type){
		localStorage.setItem("type", JSON.stringify(type));
		//location.href='#/pay/'+id+'?type=order';
		location.href='#/questions/order/pay/'+id;
	}
	
})


/*———————————————————————————— 首页 - 法律文书 ————————————————————————————*/
//首页 - 法律文书
//法律文书
lvtuanApp.controller("documentlistCtrl",function($http,$scope,$state,$rootScope,$ionicLoading){

	$scope.orders = [
						{
							"key"	:"downs",
							"value" : "下载最多"
						},
						{
							"key"	:"views",
							"value" : "浏览最多"
						}
					];


	getWorkscopes();
	//获取法律专长

	function getWorkscopes(){
		$ionicLoading.show();
		$http.get('http://'+$rootScope.hostName+'/knowledge/document/categories')
			.success(function(data) {
				$scope.workscopes = data.data;
				if($scope.workscopes.length > 0){
			        $scope.addArry = [
											{	
												"key"		:"",
												"value" 	: "文书类别"
											}
										]
			        
					$scope.workscopes = $scope.addArry.concat($scope.workscopes);
					$scope.workscope = $scope.workscopes[0].value;	
				}
				$ionicLoading.hide();
			})
	}

	//声明变量并赋值
	$scope.visible = true;  	//咨询类别下拉列表
	$scope.visible1 = true;		//筛选下拉列表
	$scope.masklayer = true; 	//遮罩层
	$scope.order = $scope.orders[0].value;
	$scope.scopes_key = "";
	$scope.orders_key = $scope.orders[0].key;

	//显示隐藏层
    $scope.toggle = function () {
        $scope.visible = !$scope.visible;
        $scope.masklayer = !$scope.masklayer;
    }

    $scope.toggle1 = function () {
        $scope.visible1 = !$scope.visible1;
        $scope.masklayer = !$scope.masklayer;
    }

    //给弹出层选中的项加上背景颜色
	$scope.inShowscopes = function(key) {
		var value = false;
		$scope.key = $scope.scopes_key;
		if (key == $scope.key) {
			value = true;
		}
		return value;
	}
	$scope.inorders = function(key) {
		var value = false;
		$scope.key = $scope.orders_key;
		if (key == $scope.key) {
			value = true;
		}
		return value;
	}
	
	//获取咨询类别选中的值
	$scope.getWorkscopeVal = function(key,val){
    	$scope.visible = !$scope.visible;
    	$scope.masklayer = !$scope.masklayer;
		$scope.workscope = val;
		$scope.scopes_key = key;
		page = 1;
		$scope.items = [];
		get_Param();
    }
    //获取筛选选中的值
    $scope.getOrderVal = function(key,val){
		$scope.visible1 = !$scope.visible1;
		$scope.masklayer = !$scope.masklayer;
		$scope.order = val;
		$scope.orders_key = key;
		page = 1;
		$scope.items = [];
		get_Param();
    }


    var page = 1; //页数
	var rows_per_page = 5; // 每页的数量
	if ($scope.rows_per_page) {
		rows_per_page = $scope.rows_per_page;
	}
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据
    var timestamp=Math.round(new Date().getTime()/1000);

	//获取参数
	function get_Param(){
		var param = []; //声明一个数组 判断如果有值就push进来
		if($scope.scopes_key){
	  		param.push('cat_id=' + $scope.scopes_key);
	  	}
	  	if($scope.orders_key){
	  		param.push('order=' + $scope.orders_key);
	  	}
	  	param = param.join('&');  //通过join('&') 把所有的参数都拼接起来
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
		//获取推荐的律师 ?is_recommended=1&page=1&size=10
		get_Param();
	};

	//根据参数向后台拉取数据
	function geturl(param){
		$scope.nodata = true;
		var url;
	
		if(param != ""){
	  		url = 'http://'+$rootScope.hostName+'/knowledge/document/list_documents?'+param+'&rows_per_page='+rows_per_page+'&page='+page+'&ts='+timestamp;
	    }else{
	    	url = 'http://'+$rootScope.hostName+'/knowledge/document/list_documents?rows_per_page='+rows_per_page+'&page='+page;+'&ts='+timestamp;
	    }
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
						$scope.moredata = false;
						$scope.nodata = false;
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
lvtuanApp.controller("documentlistsearchCtrl",function($http,$scope,$state,$rootScope,$ionicLoading){

	angular.element('.search').trigger('focus');
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
		if (newVal && newVal !== oldVal) {
			page = 1;
			$scope.items = [];
	        $scope.loadMore();
	    }else{
	    	page = 1;
			$scope.items = [];
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
		$ionicLoading.show();
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
						$ionicLoading.hide();
						if (data.data.length <= rows_per_page) {
							$scope.moredata = false;
						} else {
							$scope.moredata = true;
						}
					}else{
						if (page == 1) {
							$scope.moredata = false;
							$scope.nodata = false;
							//layer.show('暂无数据！');
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
lvtuanApp.controller("documentownloadlistCtrl",function($http,$scope,$state,$rootScope,$stateParams,$ionicLoading){
	$ionicLoading.show();
	$http.get('http://'+$rootScope.hostName+'/knowledge/document/'+$stateParams.id+'/view')
	.success(function(data) {
    	console.info('法律文书详情',data.data)
    	$scope.itmes = data.data;
    	$ionicLoading.hide();
	})
})

//法律顾问
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

})

//法律顾问
lvtuanApp.controller("corporatelistCtrl",function($scope,$state,$http,$rootScope,$stateParams,$ionicPopup,$ionicLoading,authService){

	var currentUser = authService.getUser();
	$scope.buynow_btn = function(id){
		if(currentUser.status == 1 || currentUser.status == 2){
			//普通用户个人信息
			location.href='#/corporate/buynow/'+id;
		}else{
			layer.show("您是律师用户，无此服务!");
		}
	}

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
lvtuanApp.controller("corporatebuynowCtrl",function($scope,$http,$rootScope,$timeout,$stateParams,$ionicLoading,$localStorage,$location){

	delete $localStorage.addres;

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
		

	//获取省市区
	$scope.getAddress = function(){
		delete $localStorage.addres;
		localStorage.setItem("citypicke_goback", $location.path());
		location.href='#/citypicke/all';
	}
	
	console.log($stateParams.id);

	$scope.submit = function(){
		$ionicLoading.show();
		var param = layer.getParams("#buynowForm");
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

		if($scope.invoice == true){
			param['invoice'] = 'Y';
		}else{
			param['invoice'] = 'N';
		}

		if($stateParams.id){
			param['product_id'] = $stateParams.id;
		}
		console.info(param);
		$ionicLoading.show();
		$http.post('http://'+$rootScope.hostName+'/center/question/create/pay_company',param)
			.success(function(data) {
				$ionicLoading.hide();
	        	console.log(data.data);
	        	localStorage.setItem("type", JSON.stringify('pay_company'));
				location.href='#/pay/'+data.data+'?type=order';
	        });
		
	}
})


//用户律师 - 钱包
lvtuanApp.controller("userwalletCtrl",function($scope,$http,$rootScope,$ionicLoading,authService,listHelper){

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
					sessionStorage.setItem("summoney", $scope.items.money);
				}
				$ionicLoading.hide();
			})
		}

	});


	//创建tabs列表
	$scope.tabs = [{
            title: '最新交易记录',
            url: 'latest_record.tpl.html'
        }, {
        	title: '充值记录',
            url: 'recharge_record.tpl.html'
        }, {
            title: '提现记录',
            url: 'withdraw_record.tpl.html'
    	}
    ];

    $scope.currentTab = 'latest_record.tpl.html'; //默认第一次显示的tpl

    $scope.onClickTab = function (tab) { //点击tab赋值url
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {  //给选中的url的a 标签样式
        return tabUrl == $scope.currentTab;
    }

})

lvtuanApp.controller("wxCheckOpenIdCtrl",function($scope,$http,$rootScope,$stateParams,$ionicHistory,authService,wxService){
	$scope.$on('$ionicView.beforeEnter', function() {
        localStorage.setItem("goto", "/");
		if (!wxService.getOpenId()) {
			window.location.replace(wxService.getWxAuthUrl('/wxobtainopenid'));
		} else {
            location.href = localStorage.getItem("goto");
        }
	})
})

//获取openid以供支付使用 
lvtuanApp.controller("wxObtainOpenIdCtrl",function($scope,$http,$rootScope,$stateParams,authService,wxService,$ionicLoading){
	var code = $stateParams.code;
	var state = $stateParams.state;

	$ionicLoading.show();
  	$http.get('http://' + AppSettings.baseApiUrl + '/openid?code='+code+'&state='+state).then(
    	function (res) {
	    	var authData = res.data ? res.data.data : null;
			wxService.saveOpenId(authData.openid);
			$ionicLoading.hide();
			location.href = localStorage.getItem('goto');	
    	}
    ).catch(function(response) {
	  	console.error('Gists error', response.status, response.data);
	  	if (response.status === 400) {
	  	}
	});
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
lvtuanApp.controller("usermoneyinCtrl",function($scope,$http,$rootScope,$stateParams,$ionicPopup,$location,$ionicLoading,authService,wxService){
	$scope.summoney = sessionStorage.getItem('summoney');
	$scope.user = {
		radioval : 'wx_pub'
	}
	$scope.$on('$ionicView.beforeEnter', function() {
		console.info(sessionStorage.getItem('summoney'));
		$scope.summoney = sessionStorage.getItem('summoney');
	});

	//微信支付
    $scope.wap_pay = function(user){
		main(wxService.getOpenId(),user.money);

		function main(openid,money){
	    	var currentUser = authService.getUser();
	    	var param = {};
				param.device = 'wechat';
				param.channel = user.radioval;
				param.amount = money * 100;
				param.subject = '充值';
				param.body = '充值到钱包';
				param.open_id = openid;
				param.current_user_id = currentUser.id;
				param.metadata = {};
				param.metadata.pay_type = 'wallet_recharge';
				param.metadata.user_id = currentUser.id;

	        	console.info(param);
	        $ionicLoading.show();
	    	$http.post('http://'+$rootScope.hostName+'/payment_gateway/charge',param)
			.success(function(data) {
	        	console.log(data);
	        	pingpp.createPayment(data, function(result, error){
				    if (result == "success") {
				        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
	                    location.href='#/user/wallet';
					    sessionStorage.setItem('summoney', sessionStorage.getItem('summoney')+user.money);
						layer.show("充值成功。");
						$ionicLoading.hide();
				    } else if (result == "fail") {
				        // charge 不正确或者微信公众账号支付失败时会在此处返回
				        layer.show("支付失败，请稍候再试。");
				        $ionicLoading.hide();
				    } else if (result == "cancel") {
				        // 微信公众账号支付取消支付
				        layer.show("您已取消支付。");
				        $state.go("user/wallet");
				        $ionicLoading.hide();
				    }
				});

	        });
	    }
    }
})


lvtuanApp.directive("money",function ($filter, $locale) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, el, attr, ctrl) {
      // format on init
      formatMoney();

      function formatMoney() {
        var value = ctrl.$modelValue;

        // remove all separaters first
        var groupsep = $locale.NUMBER_FORMATS.GROUP_SEP;
        var re = new RegExp(groupsep, 'g');
        value = String(value).replace(re, '');

        // format using angular
        var currencyFilter = $filter('currency');
        var value = currencyFilter(value, "");

        // sorry but no cents
        var decimalsep = $locale.NUMBER_FORMATS.DECIMAL_SEP;
        value = value.split(decimalsep)[0];

        // render
        ctrl.$viewValue = value;
        ctrl.$render();
      };

      // subscribe on changes
      scope.$watch(attr.ngModel, function() {
        formatMoney();
      });
    }
  };
});

//用户律师 - 充值记录
lvtuanApp.controller("userrecordCtrl",function($scope,$http,$rootScope,$ionicLoading,listHelper){
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
	listHelper.bootstrap('/wallet/record?type=withdraw', $scope);
})

//用户律师 - 最新交易记录
lvtuanApp.controller("userpayallCtrl",function($scope,$http,$rootScope,$ionicLoading,listHelper){
	listHelper.bootstrap('/wallet/record', $scope);
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
		var newHash = id;
		if ($location.hash() !== newHash) {
          // set the $location.hash to `newHash` and
          // $anchorScroll will automatically scroll to it
          $location.hash(id);
        } else {
          // call $anchorScroll() explicitly,
          // since $location.hash hasn't changed
          $anchorScroll();
        }
       /* $location.hash(id);
        $anchorScroll(); */ //设置页内跳转锚点
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
			location.href='#'+$scope.url;
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

	//设置 bug 如果是页面用了ionic的<ion-content> 这个代码，那么页面的点击事件执行后，滚动条就会失效
	$scope.goto = function (id) {
        var newHash = id;
		if ($location.hash() !== newHash) {
          // set the $location.hash to `newHash` and
          // $anchorScroll will automatically scroll to it
          $location.hash(id);
        } else {
          // call $anchorScroll() explicitly,
          // since $location.hash hasn't changed
          $anchorScroll();
        }
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
