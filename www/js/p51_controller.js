angular.module('p51', ["ionic"])

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

.factory("p51API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p51SbmtTitle:"成功提交订单",
		p51SbmtDateTime:"2015/09/22 11:39",
	},{
		p51SbmtTitle:"订单已完成",
		p51SbmtDateTime:"2015/07/22 11:39",
	}];
	
	var p51APIServer={};
	p51APIServer.getP51APIValue=function(){
		return arrayAPI;
	}
		
	return p51APIServer;
})

.controller("p51Ctr",function($scope,p51API){
	$scope.p51Items=p51API.getP51APIValue();
})

