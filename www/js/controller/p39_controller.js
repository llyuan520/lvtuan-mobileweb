angular.module('p39', ["ionic"])

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

//.factory("p39API",function(){
//	//所在区域 获得API
//	var arrayAPI=new Array();
//	arrayAPI=[];
//	
//	var p39APIServer={};
//	p39APIServer.getP39APIValue=function(){
//		return arrayAPI;
//	}
//		
//	return p39APIServer;
//})
//
//.controller("p39Ctr",function($scope,p34API){
//	$scope.p39Items=p39API.getP39APIValue();
//})


