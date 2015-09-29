angular.module('web66', ["ionic"])

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
.controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {
   var htms='已通知客户确认完成，客户示确定之前，还可以继续处理订单';
   $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: '确认完成',
       template: htms,
       cancelText:"确认完成",
       okText:"继续处理"
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
       } else {
         console.log('You are not sure');
       }
     });
   };
   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: '温馨提示',
       okText:"确定",
       okType: 'button-clear button-positive',
       template: '已通知客户确认完成，客户示确定之前，还可以继续处理订单。'
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };
});


