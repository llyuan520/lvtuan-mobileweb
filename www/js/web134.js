angular.module('web134', ["ionic"])

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
.controller('HomeTabCtrl', function($scope, $ionicPopup,$timeout) {
 
  
  $scope.showAlert = function() {
  	$.each($(".input_text"), function(i,t) {
				  	if(!$.trim($(t).val())){
				  		var alertPopup = $ionicPopup.alert({
				       title: '温馨提示！',
				       template: '<p style="text-align:center;">密码不能为空！<p>',
				       okType:'button-stable'
				     });
				     alertPopup.then(function(res) {
				       console.log('Thank you for not eating my delicious ice cream cone');
				     });
				     return false;
				  	}
		});
  };
  
  
});


