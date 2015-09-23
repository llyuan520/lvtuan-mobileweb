angular.module('web117', ["ionic"])

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
		Title:"1年以下",
		Id:"1",
	},{
	  Title:"2年",
		Id:"2",
	},{
		Title:"3年",
	  Id:"3",
	},{
		Title:"4年",
	  Id:"4",
	},{
		Title:"5年",
	  Id:"5",
	},{
		Title:"6年",
	  Id:"6",
	},{
		Title:"7年",
	  Id:"7",
	},{
		Title:"8年",
	  Id:"8",
	},{
		Title:"9年",
	  Id:"9",
	},{
		Title:"10年",
	  Id:"10",
	},{
		Title:"10年以上",
	  Id:"11",
	}];
	return arrayAPI;
})
.controller("usermsgs",function($scope,UserMsgAPI){
	$scope.items=UserMsgAPI;
})


