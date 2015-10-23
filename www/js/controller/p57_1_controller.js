angular.module('p57_1', ["ionic"])

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

.factory("p57_1API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p57Statue:"待确认",
		p57Time1:"2015/09/22 11:39",
		p57FreeConsult:"商事",
		p57Question:"刘纯：你好，安全责任书的责任人要负责什么责任？"
	},{
		p57Statue:"待确认",
		p57Time1:"2015/09/22 11:39",
		p57FreeConsult:"商事",
		p57Question:"刘纯：你好，安全责任书的责任人要负责什么责任？"		
	}];
	
	var p57_1APIServer={};
	p57_1APIServer.getp57_1APIValue=function(){
		return arrayAPI;
	}
		
	return p57_1APIServer;
})

.controller("p57_1Ctr",function($scope,p57_1API){
	$scope.p57_1Items=p57_1API.getp57_1APIValue();
})

