angular.module('p28', ["ionic"])

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

.factory("p28API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p28Level:"运营经理",
		p28Date:"2015/08/04",
		p28Address:"深圳-福田区-车公庙",
		p28CompanyName:"深圳市律团科技有限公司",
		p28Scope:"2015/08/04",
		p28Sum:1,
		p28Cadimic:"本科以上学历",
		p28Response:"1负责公司运营，2负责公司运营，3负责公司运营",
		p28JobResponse:"1，任职要求，2任职要求，3任职要求"
	}];
	
	var p28APIServer={};
	p28APIServer.getP28APIValue=function(){
		return arrayAPI;
	}
		
	return p28APIServer;
})

.controller("p28Ctr",function($scope,p28API){
	$scope.p28Items=p28API.getP28APIValue();
})

