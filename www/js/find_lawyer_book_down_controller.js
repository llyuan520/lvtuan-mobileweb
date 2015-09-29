angular.module('bookDown', ["ionic"])

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

.factory("AskLawyerAPI",function(){
	//获得API
	var arrayAPI=new Array();
	arrayAPI=[{name:"刑事辩护"},{name:"公司法务"},{name:"婚姻家庭"},{name:"劳动纠纷"},{name:"交通事故"},{name:"合同纠纷"}]
	
	var askLawyerAPIServer={};
	askLawyerAPIServer.getTypeValue=function(){
		return arrayAPI;
	}
		
	return askLawyerAPIServer;
})

.factory("RangeSelectAPI",function(){
	//获得API
	var arrayAPI=new Array();
	arrayAPI=[{name:"全部"},{name:"个人"},{name:"企业"}]
	
	var RangeSelectAPIServer={};
	RangeSelectAPIServer.getRangeSelectAPIValue=function(){
		return arrayAPI;
	}
		
	return RangeSelectAPIServer;
})

.factory("BookDownAPI",function(){
	var arrayAPI=new Array();
	arrayAPI=[{
		bdName:"离婚协议书",
		bdTime:"2015-07-15",
		bdNum:"334"
	},{
		bdName:"离婚协议书",
		bdTime:"2015-07-15",
		bdNum:"334"		
	},{
		bdName:"离婚协议书",
		bdTime:"2015-07-15",
		bdNum:"334"			
	},{
		bdName:"离婚协议书",
		bdTime:"2015-07-15",
		bdNum:"334"			
	},{
		bdName:"离婚协议书",
		bdTime:"2015-07-15",
		bdNum:"334"			
	},{
		bdName:"离婚协议书",
		bdTime:"2015-07-15",
		bdNum:"334"			
	}];
	
	var BookDownAPIServer={};
	BookDownAPIServer.getBookDownAPIValue=function(){
		return arrayAPI;
	}
	return BookDownAPIServer;
})
.controller("BookDownAPICtr",function($scope,BookDownAPI,AskLawyerAPI,RangeSelectAPI){
	$scope.BookDownItems=BookDownAPI.getBookDownAPIValue();

	//选择类型
	$scope.askLawyerTypeItems=AskLawyerAPI.getTypeValue();
	//选择类型单击操作-显示/隐藏
	$scope.isShowObj={
		show:false
	};
	$scope.toggleMenu=function(){
		$scope.isShowObj.show=!$scope.isShowObj.show;
	}
	
	//选择范围
	$scope.rItems=RangeSelectAPI.getRangeSelectAPIValue();
	//选择范围单击操作
	$scope.isShowList={
		show:false
	}
	$scope.toggleMenu2=function(){
		$scope.isShowList.show=!$scope.isShowList.show;
	}
	
})
