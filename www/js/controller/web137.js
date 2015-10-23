angular.module('web137', ["ionic"])

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
		lcContent:"这是小雨律师这是小雨律师这是小雨律师",
		lcName:"小雨律师",
		lcTime:"2015-12-01  12:12:02"
	},{
		lcTitle:"小雨",
		lcImgSrc:"img/ionic.png",
		lcContent:"这是小雨律师这是小雨律师这是小雨律师",
		lcName:"小雨律师",
		lcTime:"2015-12-01  12:12:02"
	},{
		lcTitle:"小雨",
		lcImgSrc:"img/ionic.png",
		lcContent:"这是小雨律师这是小雨律师这是小雨律师",
		lcName:"小雨律师",
		lcTime:"2015-12-01  12:12:02"
	},{
		lcTitle:"小雨",
		lcImgSrc:"img/ionic.png",
		lcContent:"这是小雨律师这是小雨律师这是小雨律师",
		lcName:"小雨律师",
		lcTime:"2015-12-01  12:12:02"
	}];
	return arrayAPI;
})
.controller("usermsgs",function($scope,UserMsgAPI){
	$scope.items=UserMsgAPI;
})



