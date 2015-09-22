angular.module('mpay', ["ionic"])

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
.factory("listInfoAPI",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		isChecked:true,
		imgUrl:"img/ionic.png",
		listTitle:"刘晓乐律师的专业图文咨询",
		listPrice:"5元/次",
		listDiscription:"24小时内通过图片，文字，语音进行咨询"
	},{
		isChecked:false,
		imgUrl:"img/ionic.png",
		listTitle:"刘晓乐律师的专业图文咨询",
		listPrice:"5元/次",
		listDiscription:"24小时内通过图片，文字，语音进行咨询"
	}];
	
	var listInfoAPIServer={};
	listInfoAPIServer.getListValue=function(){
		return arrayAPI;
	}
		
	return listInfoAPIServer;
})

.controller("listInfoCtr",function($scope,listInfoAPI){
	$scope.lists=listInfoAPI.getListValue();
})

.factory("payListAPI",function(){
	var arrayAPI=new Array();
	arrayAPI=[{
		isChecked:true,
		imgUrl:"img/ionic.png",
		payTitle:"支付宝支付",
		payContent:"推荐安装支付宝钱包用户使用"
	},{
		isChecked:true,
		imgUrl:"img/ionic.png",
		payTitle:"微信支付",
		payContent:"推荐安装微信用户使用"		
	},{
		isChecked:true,
		imgUrl:"img/ionic.png",
		payTitle:"银联",
		payContent:""		
	}];
	
	var payListAPIServer={};
	payListAPIServer.getPayListValue=function(){
		return arrayAPI;
	}
	return payListAPIServer;
})
.controller("payListCtr",function($scope,payListAPI){
	$scope.payLists=payListAPI.getPayListValue();
})
