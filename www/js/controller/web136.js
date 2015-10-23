angular.module('web136', ["ionic"])

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
.factory("LawyerCommentAPI",function(){
	var arrayAPI=new Array();
	arrayAPI=[{
		lcTitle:"欠钱不还",
		lcMin:"+ 12分",
		lcTime:"2015年09月16日 16:33:00"
	},{
		lcTitle:"欠钱不还",
		lcMin:"+ 13分",
		lcTime:"2015年09月16日 16:33:00"
	},{
		lcTitle:"欠钱不还",
		lcMin:"+ 14分",
		lcTime:"2015年09月16日 16:33:00"
	},{
		lcTitle:"欠钱不还",
		lcMin:"+ 15分",
		lcTime:"2015年09月16日 16:33:00"
	}];
	return arrayAPI;
})
.controller("letterItemCtr",function($scope,LawyerCommentAPI){
	$scope.letterItems=LawyerCommentAPI;
})

