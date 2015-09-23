angular.module('web138', ["ionic"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.factory("UserMsgAPI",function(){
	var arrayAPI=new Array();
	arrayAPI=[{
		lcTitle:"小雨",
		lcImgSrc:"img/ionic.png",
		lcContent:"2015年7月13日  13:02:02",
	},{
		lcTitle:"小雨",
		lcImgSrc:"img/ionic.png",
		lcContent:"2015年7月13日  13:02:02",
	},{
		lcTitle:"小雨",
		lcImgSrc:"img/ionic.png",
		lcContent:"2015年7月13日  13:02:02",
	},{
		lcTitle:"小雨",
		lcImgSrc:"img/ionic.png",
		lcContent:"2015年7月13日  13:02:02",
	}];
	return arrayAPI;
})
.controller("usermsgs",function($scope,UserMsgAPI){
	$scope.items=UserMsgAPI;
})



