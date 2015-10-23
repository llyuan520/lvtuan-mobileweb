angular.module('web123', ["ionic"])

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
		Title:"型事辩护",
		Id:"1",
	},{
	  Title:"公司法务",
		Id:"2",
	},{
		Title:"婚姻家庭",
	  Id:"3",
	},{
		Title:"劳动纠纷",
	  Id:"4",
	},{
		Title:"交通事故",
	  Id:"5",
	},{
		Title:"合同纠纷",
	  Id:"6",
	},{
		Title:"损害赔偿",
	  Id:"7",
	},{
		Title:"医疗事故",
	  Id:"8",
	},{
		Title:"债权债务",
	  Id:"9",
	},{
		Title:"房产纠纷",
	  Id:"10",
	},{
		Title:"涉外民商事",
	  Id:"11",
	}];
	return arrayAPI;
})
.controller("usermsgs",function($scope,UserMsgAPI){
	$scope.items=UserMsgAPI;
})


