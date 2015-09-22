angular.module('askLawyer', ["ionic"])

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

.factory("LawyerCommentAPI",function(){
	var arrayAPI=new Array();
	arrayAPI=[{
		lcTitle:"欠钱不还，怎么起诉，怎么讨要。",
		lcImgSrc:"img/ionic.png",
		lcName:"某某律师",
		lcContent:"你好，这里是是律师说的内容，这里是是律师说的内容。",
		lcTime:"2015年09月16日 16:33:00"
	},{
		lcTitle:"欠钱不还，怎么起诉，怎么讨要。",
		lcImgSrc:"img/ionic.png",
		lcName:"某某律师",
		lcContent:"你好，这里是是律师说的内容，这里是是律师说的内容。",
		lcTime:"2015年09月16日 16:33:00"
	},{
		lcTitle:"欠钱不还，怎么起诉，怎么讨要。",
		lcImgSrc:"img/ionic.png",
		lcName:"某某律师",
		lcContent:"你好，这里是是律师说的内容，这里是是律师说的内容。",
		lcTime:"2015年09月16日 16:33:00"
	},{
		lcTitle:"欠钱不还，怎么起诉，怎么讨要。",
		lcImgSrc:"img/ionic.png",
		lcName:"某某律师",
		lcContent:"你好，这里是是律师说的内容，这里是是律师说的内容。",
		lcTime:"2015年09月16日 16:33:00"
	}];
	
	var lcCmtObj={};
	lcCmtObj.getCmtValue=function(){
		return arrayAPI;
	}
	
	return lcCmtObj;
})

//地址
.factory("AreaAPI",function(){
	var arrayAPI=new Array();
	//areaStyle:"title-bg1",areaStyle:"title-bg2",是前端已经定义好的样式，标题的对应1样式
	arrayAPI=[{
		areaStyle:"title-bg1",
		areaName:"热门地址",
	},{
		areaStyle:"title-bg2",
		areaName:"北京"
	},{
		areaStyle:"title-bg2",
		areaName:"上海"
	},{
		areaStyle:"title-bg2",
		areaName:"广州"
	},{
		areaStyle:"title-bg2",
		areaName:"深圳"
	},{
		areaStyle:"title-bg1",
		areaName:"A"
	},{
		areaStyle:"title-bg2",
		areaName:"安徽"
	},{
		areaStyle:"title-bg2",
		areaName:"安阳"
	},{
		areaStyle:"title-bg2",
		areaName:"安庆"
	},{
		areaStyle:"title-bg2",
		areaName:"安华",
	},{
		areaStyle:"title-bg2",
		areaName:"热门地址",
	},{
		areaStyle:"title-bg2",
		areaName:"北京"
	},{
		areaStyle:"title-bg2",
		areaName:"上海"
	},{
		areaName:"广州"
	},{
		areaStyle:"title-bg2",
		areaName:"深圳"
	},{
		areaStyle:"title-bg1",
		areaName:"B"
	},{
		areaStyle:"title-bg2",
		areaName:"北京"
	},{
		areaStyle:"title-bg2",
		areaName:"北京1"
	},{
		areaStyle:"title-bg2",
		areaName:"北京3"
	},{
		areaStyle:"title-bg2",
		areaName:"北京4",
	}];//这里省略了其它字母
	
	var lcAreaObj={};
	lcAreaObj.getAreaValue=function(){
		return arrayAPI;
	}
	
	return lcAreaObj;
})

.controller('selectTypeItem', function($scope,AskLawyerAPI) {
	//选择类型
	$scope.askLawyerTypeItems=AskLawyerAPI.getTypeValue();
	//选择类型单击操作-显示/隐藏
	$scope.isShowObj={
		show:false
	};
	$scope.toggleMenu=function(){
		$scope.isShowObj.show=!$scope.isShowObj.show;
	}
})

.controller("lawyerComment",function($scope,LawyerCommentAPI){
	$scope.lawyerCommentItems=LawyerCommentAPI.getCmtValue();
})

.controller("areaItemCtr",function($scope,AreaAPI){
	$scope.areaItems=AreaAPI.getAreaValue();
})

.controller("letterItemCtr",function($scope){
	$scope.letterItems=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
})

