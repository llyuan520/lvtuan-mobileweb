angular.module('p52', ["ionic"])

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

.factory("p52API",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		p52OrderID:"LT201503220001",
		p52OrderCardName:"企业法律顾问-钻石卡",
		p52OrderCardUrl:"img/ionic.png",
		p52OrderCardTitle:"企业法律顾问-钻石卡",
		p52OrderStatu:"交易成功",//暂时用文本
		p52OrderPrice:9800,
		p52OrderCardSum:1,
		p52OrderTime1:"2015/09/22 11:32:33",//下单时间
		p52OrderTime2:"2015/09/23 11:32:33",//成交时间
	},{
		p52OrderID:"LT201503220002",
		p52OrderCardName:"企业法律顾问-钻石卡",
		p52OrderCardUrl:"img/ionic.png",
		p52OrderCardTitle:"企业法律顾问-钻石卡",
		p52OrderStatu:"交易成功",//暂时用文本
		p52OrderPrice:1000,
		p52OrderCardSum:2,
		p52OrderTime1:"2015/09/22 11:32:33",//下单时间
		p52OrderTime2:"2015/09/23 11:32:33",//成交时间
	},{
		p52OrderID:"LT201503220003",
		p52OrderCardName:"企业法律顾问-钻石卡",
		p52OrderCardUrl:"img/ionic.png",
		p52OrderCardTitle:"企业法律顾问-钻石卡",
		p52OrderStatu:"交易成功",//暂时用文本
		p52OrderPrice:2350,
		p52OrderCardSum:2,
		p52OrderTime1:"2015/09/22 11:32:33",//下单时间
		p52OrderTime2:"2015/09/23 11:32:33",//成交时间
	}];
	
	var p52APIServer={};
	p52APIServer.getP52APIValue=function(){
		return arrayAPI;
	}
		
	return p52APIServer;
})

.controller("p52Ctr",function($scope,p52API){
	$scope.p52Items=p52API.getP52APIValue();
})
