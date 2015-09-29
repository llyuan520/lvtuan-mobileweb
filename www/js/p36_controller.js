angular.module('p36', ["ionic"])

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

.factory("p36API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[];
	
	var p36APIServer={};
	p36APIServer.getP36APIValue=function(){
		return arrayAPI;
	}
		
	return p36APIServer;
})

.controller("p36Ctr",function($scope,p36API){
	$scope.p36Items=p36API.getP36APIValue();
})

.controller("p36ModelCtr",function($scope,$ionicModal){
  $ionicModal.fromTemplateUrl('sharemodel.html', function (modal) {
    $scope.modal = modal;
  }, {
    animation: 'slide-in-up',
    focusFirstInput: true
  });


})

