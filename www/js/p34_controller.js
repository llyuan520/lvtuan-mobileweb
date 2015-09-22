angular.module('p34', ["ionic"])

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

.factory("p34API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p34ImgUrl:"img/icon-header.png",
		p34Title:"这里是大标题信息这里是大标题信息这里是大标题信息这里是大标题信息",
		p34Name:"人民法院",
		p34Time:"1小时前",
		p34Src:"来源",
		p34Content:"内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息"
	},{
		p34ImgUrl:"img/icon-header.png",
		p34Title:"这里是大标题信息这里是大标题信息这里是大标题信息这里是大标题信息",
		p34Name:"人民法院",
		p34Time:"1小时前",
		p34Src:"来源",
		p34Content:"内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息"
	},{
		p34ImgUrl:"img/icon-header.png",
		p34Title:"这里是大标题信息这里是大标题信息这里是大标题信息这里是大标题信息",
		p34Name:"人民法院",
		p34Time:"1小时前",
		p34Src:"来源",
		p34Content:"内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息内容信息"
	}];
	
	var p34APIServer={};
	p34APIServer.getP34APIValue=function(){
		return arrayAPI;
	}
		
	return p34APIServer;
})

.controller("p34Ctr",function($scope,p34API){
	$scope.p34Items=p34API.getP34APIValue();
})

.controller("p34ModelCtr",function($scope,$ionicModal){
	   // 一个确认对话框
   $scope.showConfirm = function() {
      	$ionicModal.fromTemplateUrl('sharemodel.html', {
	    	scope: $scope,
	    	animation: 'slide-in-up'
  		}).then(function(modal) {
		    $scope.modal = modal;
		});

  	}


})

