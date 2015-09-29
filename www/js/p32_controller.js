angular.module('p32', ["ionic"])

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

.factory("p32API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p32ImgUrl:"img/icon-header.png",
		p32Title:"这里是标题内容信息",
		p32Content:"这里是内容描述部分，这里是内容描述部分，这里是内容描述部分，这里是内容描述部分，这里是内容描述部分，这里是内容描述部分。",
		p32DateTime:"2015年09月21日 17:17",
		p32Ok:152
	},{
		p32ImgUrl:"img/icon-header.png",
		p32Title:"这里是标题内容信息",
		p32Content:"这里是内容描述部分，这里是内容描述部分，这里是内容描述部分，这里是内容描述部分，这里是内容描述部分，这里是内容描述部分。",
		p32DateTime:"2015年09月21日 17:17",
		p32Ok:152
	},{
		p32ImgUrl:"img/icon-header.png",
		p32Title:"这里是标题内容信息",
		p32Content:"这里是内容描述部分，这里是内容描述部分，这里是内容描述部分，这里是内容描述部分，这里是内容描述部分，这里是内容描述部分。",
		p32DateTime:"2015年09月21日 17:17",
		p32Ok:152
	}];
	
	var p32APIServer={};
	p32APIServer.getP28APIValue=function(){
		return arrayAPI;
	}
		
	return p32APIServer;
})

.controller("p32Ctr",function($scope,p32API){
	$scope.p32Items=p32API.getP28APIValue();
})

