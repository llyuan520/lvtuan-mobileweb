angular.module('p40_1', ["ionic"])

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

.factory("p40_1_API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p40_1_title:"免费咨询",
		p40_1_content:"房产纠纷"
	},{
		p40_1_title:"问题描述",
		p40_1_content:"客户和中介私自在买卖合同处多一个名，也就是私自变更主体，这算违约吗？"
	}];
	
	var p40_1_APIServer={};
	p40_1_APIServer.getp40_1_APIValue=function(){
		return arrayAPI;
	}
		
	return p40_1_APIServer;
})

.controller("p40_1_Ctr",function($scope,p40_1_API){
	$scope.p40_1_Items=p40_1_API.getp40_1_APIValue();
})

