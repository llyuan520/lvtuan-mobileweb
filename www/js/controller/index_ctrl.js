var lvtuanApp = angular.module('lvtuanApp.Ctrl', ['ionic'])

/****************************************************** 引导页 ******************************************************/
//hone 
lvtuanApp.controller("ionicNavBarDelegateCtrl",function($state,$timeout,$http){
	//$ionicNavBarDelegate.showBar(false); //是否显示返回按钮
	$timeout(function(){ //2秒钟后跳转到index页面
		$state.go("index");
	}, 2000, [false]);
})


//首页
lvtuanApp.controller("indexCtrl",function($scope,$state,$http,$rootScope,$ionicLoading,$ionicSlideBoxDelegate){

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

	$scope.submit = function(){
		submintForm();
	}
  	var submintForm = function(){
  		var params = layer.getParams("#loginForm");
  		if(params.username == "" || params.password == ""){
  			layer.show("请输入用户名和密码");
  			return false;
  		}else{
  			/*var param = 'username='+params.username+'&password='+params.password;*/
  			$http.post('http://dev.wdlst.law-pc-new/login',
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
            return true;
  		}    
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
  			$http.post('http://dev.wdlst.law-pc-new/register',
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
	//显示列表
	$scope.slideBox = function(index){
		$(".slideBox .hd a:eq("+index+")").addClass("web-borderbottom2").siblings().removeClass("web-borderbottom2");
		$(".slideBox .bd ul:eq("+index+")").show().siblings().hide();
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

/****************************************************** 知识 ******************************************************/
//知识
lvtuanApp.controller("knowledgeCtrl",function($scope,$http){
	console.info("knowledgeCtrl");
	//显示列表
	$(".slideBox .hd a").click(function(){
		var $this = $(this);
		$this.addClass("web-borderbottom2").siblings().removeClass("web-borderbottom2");
		var index = $this.index();
		$(".slideBox .bd ul:eq("+index+")").show().siblings().hide();
	})
})

/****************************************************** 我的 ******************************************************/
/*———————————————————————————— 用户的个人中心 ————————————————————————————*/
//普通用户-我的
lvtuanApp.controller("centerCtrl",function($scope,$http,$rootScope,$ionicPopup,$timeout){
	//普通用户个人信息
	$http.get('http://dev.wdlst.law-pc-new/center/customer/info',
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
	$http.get('http://dev.wdlst.law-pc-new/center/score/list_scores',
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
	$http.get('http://dev.wdlst.law-pc-new/center/collect',
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
	$http.get('http://dev.wdlst.law-pc-new/center/lawyer/info',
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
	console.info("我的关注");

})
//律师的积分
lvtuanApp.controller("listscoreslaywerCtrl",function($scope,$http,$rootScope){
	$http.get('http://dev.wdlst.law-pc-new/center/lawyer/score/list_scores',
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
		$scope.showConfirm2 = function() {
		 var confirmPopup = $ionicPopup.confirm({
		   title: '客服电话',
		   template: '您确定拔打 400-810-810 电话！'
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
	
	var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

    //搜索问题
	$scope.search = function(e){
		localStorage.removeItem('items'); //清空之前的旧数据
		localStorage.removeItem('q');
		page = 1;
		$scope.items = [];
		geturl();
		layer.stopDefault(e);
	}

	//下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        geturl();
    };

    //上拉加载
	$scope.loadMore = function() {
		//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
		geturl();
	};

	function geturl(){
		var q = $.trim($(".search").val());
		var url = "";
		if(q == ""){
			url = 'http://dev.wdlst.law-pc-new/lawyer/list_lawyers?page='+page++;
		}else{ 
			url = 'http://dev.wdlst.law-pc-new/lawyer/list_lawyers?q='+q+'&page='+page++;
		}
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
	init() //初始化数据
	function init(){ 
		var url = 'http://dev.wdlst.law-pc-new/lawyer/'+$stateParams.id;
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
	
	//显示列表
	$(".slideBox .hd a").click(function(){
		var $this = $(this);
		$this.addClass("web-borderbottom2").siblings().removeClass("web-borderbottom2");
		var index = $this.index();
		$(".slideBox .bd ul:eq("+index+")").show().siblings().hide();
	})

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
    $scope.showConfirm2 = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: '客服电话',
       template: '您确定拔打 400-810-810 电话！'
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
lvtuanApp.factory("LawyerCommentAPI",function(){
	var arrayAPI=new Array();
	arrayAPI=[{
		lcTitle:"欠钱不还，怎么起诉，怎么讨要。",
		lcImgSrc:"img/woman.png",
		lcName:"某某律师",
		lcContent:"你好，这里是是律师说的内容，这里是是律师说的内容。",
		lcTime:"2015年09月16日 16:33:00"
	},{
		lcTitle:"欠钱不还，怎么起诉，怎么讨要。",
		lcImgSrc:"img/T01.png",
		lcName:"某某律师",
		lcContent:"你好，这里是是律师说的内容，这里是是律师说的内容。",
		lcTime:"2015年09月16日 16:33:00"
	},{
		lcTitle:"欠钱不还，怎么起诉，怎么讨要。",
		lcImgSrc:"img/T02.png",
		lcName:"某某律师",
		lcContent:"你好，这里是是律师说的内容，这里是是律师说的内容。",
		lcTime:"2015年09月16日 16:33:00"
	},{
		lcTitle:"欠钱不还，怎么起诉，怎么讨要。",
		lcImgSrc:"img/T03.png",
		lcName:"某某律师",
		lcContent:"你好，这里是是律师说的内容，这里是是律师说的内容。",
		lcTime:"2015年09月16日 16:33:00"
	}];
	
	var lcCmtObj={};
	lcCmtObj.getCmtValue=function(){
		return arrayAPI;
	}
	
	return lcCmtObj;
})

//地址
lvtuanApp.factory("AreaAPI",function(){
	var arrayAPI=new Array();
	//areaStyle:"title-bg1",areaStyle:"title-bg2",是前端已经定义好的样式，标题的对应1样式
	arrayAPI=[{
		areaStyle:"title-bg1",
		areaName:"热门地址",
	},{
		areaStyle:"title-bg2",
		areaName:"北京"
	},{
		areaStyle:"title-bg2",
		areaName:"上海"
	},{
		areaStyle:"title-bg2",
		areaName:"广州"
	},{
		areaStyle:"title-bg2",
		areaName:"深圳"
	},{
		areaStyle:"title-bg1",
		areaName:"A"
	},{
		areaStyle:"title-bg2",
		areaName:"安徽"
	},{
		areaStyle:"title-bg2",
		areaName:"安阳"
	},{
		areaStyle:"title-bg2",
		areaName:"安庆"
	},{
		areaStyle:"title-bg2",
		areaName:"安华",
	},{
		areaStyle:"title-bg2",
		areaName:"热门地址",
	},{
		areaStyle:"title-bg2",
		areaName:"北京"
	},{
		areaStyle:"title-bg2",
		areaName:"上海"
	},{
		areaName:"广州"
	},{
		areaStyle:"title-bg2",
		areaName:"深圳"
	},{
		areaStyle:"title-bg1",
		areaName:"B"
	},{
		areaStyle:"title-bg2",
		areaName:"北京"
	},{
		areaStyle:"title-bg2",
		areaName:"北京1"
	},{
		areaStyle:"title-bg2",
		areaName:"北京3"
	},{
		areaStyle:"title-bg2",
		areaName:"北京4",
	}];//这里省略了其它字母
	
	var lcAreaObj={};
	lcAreaObj.getAreaValue=function(){
		return arrayAPI;
	}
	
	return lcAreaObj;
})

//问律师
lvtuanApp.controller("questionsCtrl",function($scope,$state,$http,$rootScope,LawyerCommentAPI,AreaAPI){
	
	//选择类型
	$http.get('http://dev.wdlst.law-pc-new/lawyer/workscopes',
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


	//上拉加载
    var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.list_questions = [];	//创建一个数组接收后台的数据
	$scope.loadMore = function() {
		////获取咨询列表
		$http.get('http://dev.wdlst.law-pc-new/question/list_questions?page='+page++,
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


	//选择类型单击操作-显示/隐藏
	$scope.isShowObj={
		show:false
	};
	$scope.toggleMenu=function(){
		$scope.isShowObj.show=!$scope.isShowObj.show;
		if($scope.isShowObj.show == false){
			var key = this.key;
			var val = this.value;
			var workscopes = document.getElementById("workscopes");
			$scope.cat_id = key;
			angular.element(workscopes).val(val);
			$http.get('http://dev.wdlst.law-pc-new/lawyer/workscopes',
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
  			$http.post('http://dev.wdlst.law-pc-new/question/create',{
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
	$scope.search = function(e){
		localStorage.removeItem('items'); //清空之前的旧数据
		localStorage.removeItem('q');
		geturl();
		layer.stopDefault(e);
	}

	
	function geturl(){
		var q = $.trim($(".search").val());
		var url = "";
		if(q == ""){
			url = 'http://dev.wdlst.law-pc-new/question/list_questions';
		}else{ 
			url = 'http://dev.wdlst.law-pc-new/question/list_questions?q='+q;
		}
		$http.get(url,
	        {
	            headers: {
	                'Content-Type': 'application/json' , 
	            	'Authorization': 'bearer ' + $rootScope.token,
	            }
	        }).success(function(data) {
	        	angular.element(".search").val('');
	        	var items = data.data;
	        	$state.go("questionslist", {reload: true}); 
	        	localStorage.setItem('q',JSON.stringify(q));
	        	localStorage.setItem('items',JSON.stringify(items));
	           
	        }).error(function (data, status) {
	        	var errMsg = JSON.stringify(data.error_messages);
	        	layer.show(errMsg);
	        });
	}

	$scope.lawyerCommentItems=LawyerCommentAPI.getCmtValue();
	$scope.areaItems=AreaAPI.getAreaValue();
	$scope.letterItems=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
})



//问律师列表
lvtuanApp.controller("questionslistCtrl",function($http,$scope,$state,$rootScope){

	$scope.q = JSON.parse(localStorage.getItem('q'));
	angular.element(".search").val($scope.q);
	$scope.items = JSON.parse(localStorage.getItem('items'));
    console.info($scope.items)
    var page = 1; //页数
    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
    $scope.items = [];	//创建一个数组接收后台的数据

    //搜索问题
	$scope.search = function(e){
		localStorage.removeItem('items'); //清空之前的旧数据
		localStorage.removeItem('q');
		page = 1;
		$scope.items = [];
		geturl();
		layer.stopDefault(e);
	}

	//下拉刷新
	$scope.doRefresh = function() {
		page = 1;
		$scope.items = [];
        geturl();
    };

    //上拉加载
	$scope.loadMore = function() {
		//获取推荐的律师 ?is_recommended=1&page=1&rows_per_page=10
		geturl();
	};

	function geturl(){
		var q = $.trim($(".search").val());
		var url = "";
		if(q == ""){
			url = 'http://dev.wdlst.law-pc-new/question/list_questions?page='+page++;
		}else{ 
			url = 'http://dev.wdlst.law-pc-new/question/list_questions?q='+q+'&page='+page++;
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

//法律咨询
lvtuanApp.controller("legaladviceCtrl",function($http,$scope,$state,$rootScope){
	console.info("法律咨询");
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
	console.info("律团联盟");
})

//人才交流
lvtuanApp.controller("talentCtrl",function($http,$scope,$state,$rootScope){
	console.info("人才交流");
})
