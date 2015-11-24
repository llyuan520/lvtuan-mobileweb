angular.module('LawyerInfoCenter', ["ionic"])

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

//律师个人页面顶部的信息
.factory("LawyerInfoAPI",function(){
	//获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		lawyerHearderIcon:"img/icon-header.png",
		lawyerName:"王立群",
		lawyerLevel:"律师",
		lawyerSignature:"你的专属律师",
		lawyerStarNum:5,
		lawyerLove:12,
		lawyerSeviceNum:26,
		lawyerMark:4.8,
		lawyerFanNum:355,
	}]
	
	var LawyerInfoAPIServer={};
	LawyerInfoAPIServer.getLawyerInfoValue=function(){
		return arrayAPI;
	}
		
	return LawyerInfoAPIServer;
})

//个人简介部分
.factory("LawyerIntroductionAPI",function(){
	//获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		//个人简介部分
		lawyerFiled:"刑事辩护/劳动纠纷/交通事故",
		lawyerJobYear:"10年",
		lawyerConsultPrice:"图文资讯5元/次；电话咨询3元/分钟",
		lawyerResume:"未填写",
		lawyerWorkExperience:"未填写",
		lawyerGoodCase:"未填写"
	}]
	
	var LawyerIntroductionAPIServer={};
	LawyerIntroductionAPIServer.getLawyerIntroductionValue=function(){
		return arrayAPI;
	}
		
	return LawyerIntroductionAPIServer;
})

//评价
.factory("otherCmtAPI",function(){
	//获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		otherName:"小陈",
		otherTime:"2015/09/17 15:00",
		otherStar:5,
		otherContent:"非常感谢，帮助很大，最专业的律师。"
	},{
		otherName:"小陈",
		otherTime:"2015/09/17 15:00",
		otherStar:5,
		otherContent:"非常感谢，帮助很大，最专业的律师。"
	},{
		otherName:"小陈",
		otherTime:"2015/09/17 15:00",
		otherStar:5,
		otherContent:"非常感谢，帮助很大，最专业的律师。"
	}]
	
	var otherCmtAPIServer={};
	otherCmtAPIServer.getOtherCmtValue=function(){
		return arrayAPI;
	}
		
	return otherCmtAPIServer;
})

//动态
.factory("DynamicAPI",function(){
	//获得API
	var arrayAPI=new Array();
	arrayAPI=[{
		dynamicDate:"08",
		dynamicMonth:"7月",
		dynamicTitle:"王石公司要被收购了，赶紧围观。",
		dynamicTime:"11:28",
		dynamicLove:"28",
		dynamicMan:"133",
		dynamicOtherName:"xxx律师事务所,Cindy,小鱼",//["xxx律师事务所","Cindy","小鱼"],
		dynamicAllCmt:[{
			name:"Cidy",
			discript:"这个新闻看过，表示惊讶！"
		},{
			name:"小鱼",
			discript:"这个新闻看过，表示惊讶！"
		},{
			name:"小鱼2",
			discript:"这个新闻看过，表示惊讶！"
		}],
		getOtherNum:17//function(){
//			return dynamicOtherName.length;
//		},//dynamicOtherName这个数组的长度
	},{
		dynamicDate:"08",
		dynamicMonth:"7月",
		dynamicTitle:"王石公司要被收购了，赶紧围观。",
		dynamicTime:"11:28",
		dynamicLove:"28",
		dynamicMan:"133",
		dynamicOtherName:"xxx律师事务所,Cindy,小鱼",//["xxx律师事务所","Cindy","小鱼"],
		dynamicAllCmt:[{
			name:"Cidy",
			discript:"这个新闻看过，表示惊讶！"
		},{
			name:"小鱼",
			discript:"这个新闻看过，表示惊讶！"
		},{
			name:"小鱼2",
			discript:"这个新闻看过，表示惊讶！"
		}],
		getOtherNum:17//function(){
//			return dynamicOtherName.length;
//		},//dynamicOtherName这个数组的长度		
	}]
	
	var DynamicAPIServer={};
	DynamicAPIServer.getDynamicValue=function(){
		return arrayAPI;
	}
		
	return DynamicAPIServer;
})

//律师个人页面顶部的信息
.controller('LawyerIntroductionCtr', function($scope,LawyerInfoAPI) {
	$scope.IntrItems=LawyerInfoAPI.getLawyerInfoValue();
})

//个人简介部分
.controller('LawyerIntrCtr', function($scope,LawyerIntroductionAPI) {
	$scope.lawyerIntrItems=LawyerIntroductionAPI.getLawyerIntroductionValue();
})

//评价
.controller('otherCmtCtr', function($scope,otherCmtAPI) {
	$scope.otherCmtItems=otherCmtAPI.getOtherCmtValue();
})

//动态
.controller('DynamicCtr', function($scope,DynamicAPI) {
	$scope.DynamicItems=DynamicAPI.getDynamicValue();
})

//当tab点击时显示对应的内容
//.controller('showTabContentCtr', function($scope) {
//	$scope.isShowContent={
//		isIntrShow:false,
//		isAnswerShow:false,
//		isDynamicShow:true
//	};
//	$scope.showTabContent=function(){
//		$scope.isShowContent.isIntrShow=true;
//		$scope.isShowContent.isAnswerShow=false;
//		$scope.isShowContent.isDynamicShow=false;
//	};
//	$scope.showTabContent2=function(){
//		$scope.isShowContent.isIntrShow=false;
//		$scope.isShowContent.isAnswerShow=true;
//		$scope.isShowContent.isDynamicShow=false;
//	};
//	$scope.showTabContent3=function(){
//		$scope.isShowContent.isIntrShow=false;
//		$scope.isShowContent.isAnswerShow=false;
//		$scope.isShowContent.isDynamicShow=true;
//	};
//})

//弹窗
.controller("showWin",function($scope, $ionicPopup) {

   // 一个确认对话框
   $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: '联系方式',
       template: '13800138000',
       buttons:[{
       	text:"取消",
       	onTap: function(e){
       		console.log('You are not sure');
       	}
       },{
       	text:"确定",
       	onTap: function(e){
       		console.log('You are sure');
       	}
       }]
     });
   };
})

