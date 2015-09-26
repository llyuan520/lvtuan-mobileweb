angular.module('web118', ["ionic"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller( 'actionsheetCtl',['$scope','$ionicActionSheet','$timeout' ,function($scope,$ionicActionSheet,$timeout){
    $scope.show = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '拍照' },
              { text: '从相册中选择' }
            ],
            titleText: '请您选择',
            buttonClicked: function(index) {
            	if(index==0){alert("拍照");}else{
            		alert("从相册中选择");
            	}
              return true;
            }
        });
    };
    $scope.lishow = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '律师' },
              { text: '高级律师' },
              { text: '合伙人' }
            ],
            titleText: '律师类型',
            buttonClicked: function(index) {
              return true;
            }
        });
    };
}])


