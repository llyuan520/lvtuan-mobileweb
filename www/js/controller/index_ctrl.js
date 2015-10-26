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
		           layer.show("登陆成功！");
		           
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

/****************************************************** 圈子 ******************************************************/
//圈子
lvtuanApp.controller("groupCtrl",function($scope,$http){
	console.info("groupCtrl");
})

/****************************************************** 知识 ******************************************************/
//知识
lvtuanApp.controller("knowledgeCtrl",function($scope,$http){
	console.info("knowledgeCtrl");
})

/****************************************************** 我的 ******************************************************/
//我的
lvtuanApp.controller("centerCtrl",function($scope,$http){
	console.info("centerCtrl");
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

//找律师列表
lvtuanApp.factory("InAreaOfCity",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{value:0,name:"所在区域"},{value:1,name:"不限"},{value:2,name:"宝安区"},{value:3,name:"南山区"},{value:4,name:"福田区"},{value:5,name:"罗湖区"},{value:6,name:"龙岗区"}];
	
	var inAreaOfCityAPIServer={};
	inAreaOfCityAPIServer.getAreaOfCityValue=function(){
		return arrayAPI;
	}
		
	return inAreaOfCityAPIServer;
})

lvtuanApp.factory("LegalExpertiseAPI",function(){
	//法律专长
	var arrayAPI=new Array();
	arrayAPI=[{value:0,name:"法律专长"},{value:1,name:"刑事辩护"},{value:2,name:"公司法务"},{value:3,name:"劳动纠纷"},{value:4,name:"交通事故"},{value:5,name:"合同纠纷"}];
	
	var LegalExpertiseAPIServer={};
	LegalExpertiseAPIServer.getLEValue=function(){
		return arrayAPI;
	}
	
	return LegalExpertiseAPIServer;
})

lvtuanApp.factory("ProfesionalLifeAPI",function(){
	//职业年限
	var arrayAPI=new Array();
	arrayAPI=[{value:0,name:"职业年限"},{value:1,name:"不限"},{value:2,name:"1-3年"},{value:3,name:"3-5年"},{value:4,name:"5-7年"},{value:5,name:"1-10年"},{value:6,name:"10年以上"}];
	
	var ProfesionalLifeAPIServer={};
	ProfesionalLifeAPIServer.getPLValue=function(){
		return arrayAPI;
	}
	
	return ProfesionalLifeAPIServer;
})

lvtuanApp.factory("lawyerTypeDefaultAPI",function(){
	//职业年限
	var arrayAPI=new Array();
	arrayAPI=[{value:0,name:"默认"},{value:1,name:"离我最近"},{value:2,name:"人气最高"},{value:3,name:"评价最好"}];
	
	var lawyerTypeDefaultAPIServer={};
	lawyerTypeDefaultAPIServer.getTypeDefaultValue=function(){
		return arrayAPI;
	}
	
	return lawyerTypeDefaultAPIServer;
})

//律师相关信息
lvtuanApp.factory("lawyerInfoAPI",function(){
	//职业年限
	var arrayAPI=new Array();
	arrayAPI=[{
		iconHeader:"img/icon-header.png",
		name:"王克",
		level:"高级律师",
		isDispVipImg:1,//1 显示，0不显示
		beGoodAtField:"领域1，领域2，领域3",//擅长领域
		address:"广东省深圳市宝安区XXX",
		jobYear:"3年",
		haveUsers:177,
		praised:32,
		commented:120
	},{
		iconHeader:"img/icon-header.png",
		name:"王克",
		level:"高级律师",
		isDispVipImg:1,//1 显示，0不显示
		beGoodAtField:"领域1，领域2，领域3",//擅长领域
		address:"广东省深圳市宝安区XXX",
		jobYear:"3年",
		haveUsers:177,
		praised:32,
		commented:120
	},{
		iconHeader:"img/icon-header.png",
		name:"王克",
		level:"高级律师",
		isDispVipImg:0,//1 显示，0不显示
		beGoodAtField:"领域1，领域2，领域3",//擅长领域
		address:"广东省深圳市宝安区XXX",
		jobYear:"3年",
		haveUsers:177,
		praised:32,
		commented:120
	}
	];
	
	var lawyerInfoAPIServer={};
	lawyerInfoAPIServer.getLawyerInfoValue=function(){
		return arrayAPI;
	}
	
	return lawyerInfoAPIServer;
})
lvtuanApp.controller("lawyerlistCtrl",function($scope,InAreaOfCity,LegalExpertiseAPI,ProfesionalLifeAPI,lawyerTypeDefaultAPI,lawyerInfoAPI){
	$scope.areaItems=InAreaOfCity.getAreaOfCityValue();
	$scope.LEItems=LegalExpertiseAPI.getLEValue();
	$scope.PLItems=ProfesionalLifeAPI.getPLValue();
	$scope.typeDefaultItems=lawyerTypeDefaultAPI.getTypeDefaultValue();
	$scope.lawyerInfoItems=lawyerInfoAPI.getLawyerInfoValue();
	
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
lvtuanApp.controller("questionsCtrl",function($scope,$state,$http,$rootScope,$ionicLoading,$ionicSlideBoxDelegate,LawyerCommentAPI,AreaAPI){
	
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
		localStorage.clear();
		geturl();
		layer.stopDefault(e);
	}

	
	function geturl(){
		var q = $.trim($(".search").val());
		var url = "";
		if(q == ""){
			url = 'http://dev.wdlst.law-pc-new/question/list_questions';
			geturl(url,'');
		}else{ 
			url = 'http://dev.wdlst.law-pc-new/question/list_questions?q='+q;
			geturl(url,q);
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