angular.module('p58', ["ionic"])

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

.factory("p58API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p58Statue:"待确认",
		p58Time1:"2015/09/22 11:39",
		p58FreeConsult:"知识产权",
		p58Question:"刘纯：你好，安全责任书的责任人要负责什么责任？"
	},{
		p58Statue:"待确认",
		p58Time1:"2015/09/22 11:39",
		p58FreeConsult:"商事",
		p58Question:"刘纯：你好，安全责任书的责任人要负责什么责任？"
	},{
		p58Statue:"待确认",
		p58Time1:"2015/09/22 11:39",
		p58FreeConsult:"商事",
		p58Question:"刘纯：你好，安全责任书的责任人要负责什么责任？"
	}];
	
	var p58APIServer={};
	p58APIServer.getP58APIValue=function(){
		return arrayAPI;
	}
		
	return p58APIServer;
})

.controller("p58Ctr",function($scope,p58API){
	$scope.p58Items=p58API.getP58APIValue();
})

