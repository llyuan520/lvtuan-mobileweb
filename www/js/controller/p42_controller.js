angular.module('p42', ["ionic"])

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

.factory("p42API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p42FreeConsult:"房产纠纷",
		p42Name:"深圳市浩盛律师事务所",
		p42LawyerName:"苏小芬",
		p42AcceptTime:"2015/09/22 11:32:33",
		p42Intr:"问题描述内容，问题描述内容，问题描述内容，问题描述内容，问题描述内容，问题描述内容，问题描述内容。"
	}];
	
	var p42APIServer={};
	p42APIServer.getP42APIValue=function(){
		return arrayAPI;
	}
		
	return p42APIServer;
})

.controller("p42Ctr",function($scope,p42API){
	$scope.p42Items=p42API.getP42APIValue();
})

