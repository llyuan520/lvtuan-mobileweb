angular.module('p57', ["ionic"])

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

.factory("p57API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p57MWLawyerID:"0000000",
		p57MWImgUrl:"img/ionic.png",
		p57MWLawyerName:"王律师",
		p57MWLawyerLevel:"高级律师",
		p57MWLawyerTel:"137****5127",
		p57MWIsAcceptListInLine:1
	}];
	
	var p57APIServer={};
	p57APIServer.getP57APIValue=function(){
		return arrayAPI;
	}
		
	return p57APIServer;
})

.controller("p57Ctr",function($scope,p57API){
	$scope.p57Items=p57API.getP57APIValue();
})

