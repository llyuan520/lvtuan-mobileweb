angular.module('p35', ["ionic"])

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

.factory("p35API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p35Url:"img/ionic.png",
		p35Name:"泰迪熊",
		p35Intr:"司法改革中坚力量，司法改革中坚力量，司法改革中坚力量。",
		p35DateTime:"2015年9月22日 13:03:32",
		p35Love:17,
		p35Cmt:9
	},{
		p35Url:"img/ionic.png",
		p35Name:"泰迪熊",
		p35Intr:"司法改革中坚力量，司法改革中坚力量，司法改革中坚力量。",
		p35DateTime:"2015年9月22日 13:03:32",
		p35Love:17,
		p35Cmt:9
	},{
		p35Url:"img/ionic.png",
		p35Name:"泰迪熊",
		p35Intr:"司法改革中坚力量，司法改革中坚力量，司法改革中坚力量。",
		p35DateTime:"2015年9月22日 13:03:32",
		p35Love:17,
		p35Cmt:9
	},];
	
	var p35APIServer={};
	p35APIServer.getP35APIValue=function(){
		return arrayAPI;
	}
		
	return p35APIServer;
})

.controller("p35Ctr",function($scope,p35API){
	$scope.p35Title="评论（3）";
	$scope.p35Items=p35API.getP35APIValue();
})



