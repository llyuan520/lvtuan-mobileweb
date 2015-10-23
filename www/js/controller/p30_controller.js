angular.module('p30', ["ionic"])

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

.factory("p30API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		imgUrl:"img/21.png",
		p30Title:"xxx律师事务所"
	},{
		imgUrl:"img/22.png",
		p30Title:"xxx律师事务所"
	},{
		imgUrl:"img/23.png",
		p30Title:"xxx律师事务所"
	},{
		imgUrl:"img/24.png",
		p30Title:"xxx律师事务所"
	}];
	
	var p30APIServer={};
	p30APIServer.getP30APIValue=function(){
		return arrayAPI;
	}
		
	return p30APIServer;
})

.controller("p30Ctr",function($scope,p30API){
	$scope.p30Items=p30API.getP30APIValue();
})

