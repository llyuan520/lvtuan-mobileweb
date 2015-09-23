angular.module('web139', ["ionic"])

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
		lcTitle:"积分消息",
		lcImgSrc:"img/ionic.png",
		lcContent:"亲爱的用户，您的积分已经达到1000分，可以兑换礼物噢！",
	},{
		lcTitle:"积分消息",
		lcImgSrc:"img/ionic.png",
		lcContent:"亲爱的用户，您的积分已经达到1000分，可以兑换礼物噢！",
	},{
		lcTitle:"积分消息",
		lcImgSrc:"img/ionic.png",
		lcContent:"亲爱的用户，您的积分已经达到1000分，可以兑换礼物噢！",
	},{
		lcTitle:"积分消息",
		lcImgSrc:"img/ionic.png",
		lcContent:"亲爱的用户，您的积分已经达到1000分，可以兑换礼物噢！",
	}];
	return arrayAPI;
})
.controller("usermsgs",function($scope,UserMsgAPI){
	$scope.items=UserMsgAPI;
})



