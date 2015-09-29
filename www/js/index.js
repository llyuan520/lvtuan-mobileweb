angular.module('indexApp', ["ionic"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider,$urlRouterProvider){
	$stateProvider
	.state("index",{
		url:"/index",
		templateUrl:"tpl/index_tpl.html"
	})
	.state("login",{
		url:"/login",
		templateUrl:"tpl/login_tpl.html"
	});
//	$urlRouterProvider.otherwise("/index");
})

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

.controller("indexCtr",function($scope,$state,$ionicSlideBoxDelegate,IndexAPI){
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
	
	
})


