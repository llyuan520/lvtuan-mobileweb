angular.module('p40', ["ionic"])

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

.factory("p40API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[];
	
	var p40APIServer={};
	p40APIServer.getP40APIValue=function(){
		return arrayAPI;
	}
		
	return p40APIServer;
})

.controller("p40Ctr",function($scope,p40API){
	$scope.p40Items=p40API.getP40APIValue();
})

