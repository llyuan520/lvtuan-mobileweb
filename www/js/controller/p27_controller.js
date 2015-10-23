angular.module('p27', ["ionic"])

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

.factory("p27API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p27Title:"律师助理",
		p27Date:"2015/08/04",
		p27Address:"深圳福田区",
		p27Sum:27
	},{
		p27Title:"律师助理",
		p27Date:"2015/08/04",
		p27Address:"深圳福田区",
		p27Sum:27
	},{
		p27Title:"律师助理",
		p27Date:"2015/08/04",
		p27Address:"深圳福田区",
		p27Sum:27
	}];
	
	var p27APIServer={};
	p27APIServer.getP27APIValue=function(){
		return arrayAPI;
	}
		
	return p27APIServer;
})

.controller("p27Ctr",function($scope,p27API){
	$scope.p27Items=p27API.getP27APIValue();
})

