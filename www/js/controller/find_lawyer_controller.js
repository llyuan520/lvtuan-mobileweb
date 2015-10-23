angular.module('findLawyer', ["ionic"])

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

.factory("InAreaOfCity",function(){
	//所在区域 获得API
	var arrayAPI=new Array();
	arrayAPI=[{value:0,name:"所在区域"},{value:1,name:"不限"},{value:2,name:"宝安区"},{value:3,name:"南山区"},{value:4,name:"福田区"},{value:5,name:"罗湖区"},{value:6,name:"龙岗区"}];
	
	var inAreaOfCityAPIServer={};
	inAreaOfCityAPIServer.getAreaOfCityValue=function(){
		return arrayAPI;
	}
		
	return inAreaOfCityAPIServer;
})

.factory("LegalExpertiseAPI",function(){
	//法律专长
	var arrayAPI=new Array();
	arrayAPI=[{value:0,name:"法律专长"},{value:1,name:"刑事辩护"},{value:2,name:"公司法务"},{value:3,name:"劳动纠纷"},{value:4,name:"交通事故"},{value:5,name:"合同纠纷"}];
	
	var LegalExpertiseAPIServer={};
	LegalExpertiseAPIServer.getLEValue=function(){
		return arrayAPI;
	}
	
	return LegalExpertiseAPIServer;
})

.factory("ProfesionalLifeAPI",function(){
	//职业年限
	var arrayAPI=new Array();
	arrayAPI=[{value:0,name:"职业年限"},{value:1,name:"不限"},{value:2,name:"1-3年"},{value:3,name:"3-5年"},{value:4,name:"5-7年"},{value:5,name:"1-10年"},{value:6,name:"10年以上"}];
	
	var ProfesionalLifeAPIServer={};
	ProfesionalLifeAPIServer.getPLValue=function(){
		return arrayAPI;
	}
	
	return ProfesionalLifeAPIServer;
})

.factory("lawyerTypeDefaultAPI",function(){
	//职业年限
	var arrayAPI=new Array();
	arrayAPI=[{value:0,name:"默认"},{value:1,name:"离我最近"},{value:2,name:"人气最高"},{value:3,name:"评价最好"}];
	
	var lawyerTypeDefaultAPIServer={};
	lawyerTypeDefaultAPIServer.getTypeDefaultValue=function(){
		return arrayAPI;
	}
	
	return lawyerTypeDefaultAPIServer;
})

//律师相关信息
.factory("lawyerInfoAPI",function(){
	//职业年限
	var arrayAPI=new Array();
	arrayAPI=[{
		iconHeader:"img/icon-header.png",
		name:"王克",
		level:"高级律师",
		isDispVipImg:1,//1 显示，0不显示
		beGoodAtField:"领域1，领域2，领域3",//擅长领域
		address:"广东省深圳市宝安区XXX",
		jobYear:"3年",
		haveUsers:177,
		praised:32,
		commented:120
	},{
		iconHeader:"img/icon-header.png",
		name:"王克",
		level:"高级律师",
		isDispVipImg:1,//1 显示，0不显示
		beGoodAtField:"领域1，领域2，领域3",//擅长领域
		address:"广东省深圳市宝安区XXX",
		jobYear:"3年",
		haveUsers:177,
		praised:32,
		commented:120
	},{
		iconHeader:"img/icon-header.png",
		name:"王克",
		level:"高级律师",
		isDispVipImg:0,//1 显示，0不显示
		beGoodAtField:"领域1，领域2，领域3",//擅长领域
		address:"广东省深圳市宝安区XXX",
		jobYear:"3年",
		haveUsers:177,
		praised:32,
		commented:120
	}
	];
	
	var lawyerInfoAPIServer={};
	lawyerInfoAPIServer.getLawyerInfoValue=function(){
		return arrayAPI;
	}
	
	return lawyerInfoAPIServer;
})

.controller("inAreaOfCityCtr",function($scope,InAreaOfCity){
	$scope.areaItems=InAreaOfCity.getAreaOfCityValue();
})

.controller("LegalExpertiseCtr",function($scope,LegalExpertiseAPI){
	$scope.LEItems=LegalExpertiseAPI.getLEValue();
})

.controller("ProfesionalLifeCtr",function($scope,ProfesionalLifeAPI){
	$scope.PLItems=ProfesionalLifeAPI.getPLValue();
})

.controller("lawyerTypeDefaultCtr",function($scope,lawyerTypeDefaultAPI){
	$scope.typeDefaultItems=lawyerTypeDefaultAPI.getTypeDefaultValue();
})

.controller("lawyerInfoCtr",function($scope,lawyerInfoAPI){
	$scope.lawyerInfoItems=lawyerInfoAPI.getLawyerInfoValue();
})

