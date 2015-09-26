angular.module('web96', ["ionic"])

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
    $scope.show2 = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '男' },
              { text: '女' }
            ],
            titleText: '请您选择',
            buttonClicked: function(index) {
            	if(index==0){alert("男");}else{
            		alert("女");
            	}
              return true;
            }
        });
    };
    
    $scope.deadline = function() {
	    var options = {
	      date: $scope.todo_date,
	      mode: 'date'
	    };
	    datePicker.show(options, function(d) {
	      if (!isNaN(d.getTime())) {  // valid date
	        $scope.$apply(function () {
	          $scope.todo_date = d;
	        });
	      }
	    });
    }
   
   
   
   
}])


