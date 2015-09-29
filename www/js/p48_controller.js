angular.module('p48', ["ionic"])

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

.factory("p48API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[];
	
	var p48APIServer={};
	p48APIServer.getP48APIValue=function(){
		return arrayAPI;
	}
		
	return p48APIServer;
})

.controller("p48Ctr",function($scope,p48API){
	$scope.p48Items=p48API.getP48APIValue();
})

