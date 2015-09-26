angular.module('p31', ["ionic"])

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

.factory("p31API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p31Url:"img/ionic.png",
		p31Title:"深圳律师事务所",
		p31IntroTitle:"公司简介",
		p31Intro:"公司简介内容，公司简介内容，公司简介内容，公司简介内容，公司简介内容，公司简介内容，公司简介内容，公司简介内容。",
		p31BuessTitle:"业务领域",
		p31BuessContent:"xxxxx,xxxx,xxxxx,xxxx,xxx",
		p31ContactMe:"联系我们",
		p31AddressTitle:"总部地址",
		p31AddressContent:"广东省深圳市",
		p31TelTitle:"电话",
		p31Tel:"0755-836955008,0755-81323424",
		p31FaxTitle:"传真",
		p31Fax:"0755-123456789",
		p31CodeTitle:"邮编",
		p31Code:"518026",
		p31EmailTitle:"电子邮箱",
		p31Email:"abcd@163.com"
	}];
	
	var p31APIServer={};
	p31APIServer.getP31APIValue=function(){
		return arrayAPI;
	}
		
	return p31APIServer;
})

.controller("p31Ctr",function($scope,p31API){
	$scope.p31Items=p31API.getP31APIValue();
})

