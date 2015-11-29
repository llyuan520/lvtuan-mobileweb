angular.module('lvtuanApp', ['ionic', 'lvtuanApp.Ctrl', 'templates'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

//声明全局的方法和变量
.run(['$rootScope','$timeout','$location',function($rootScope,$timeout,$location){
  
 /*$timeout(function() {
      localStorage.removeItem('is_lawyer');
  }, 600);*/
  $rootScope.token = localStorage.getItem('token');
  $rootScope.user_id = localStorage.getItem('user_id');
  $rootScope.user_group_id = localStorage.getItem('user_group_id');
  $rootScope.is_verified = localStorage.getItem('is_verified');

  //localStorage.removeItem('is_lawyer');
  var hostName = $location.host();
  // if (hostName == '192.168.1.116') {
  //   hostName = hostName + ":81";
  // } else {
    hostName = 'dev.wdlst.lvtuan-pc-new';
  // }
  localStorage.setItem("hostName", JSON.stringify(hostName));
  $rootScope.hostName = JSON.parse(localStorage.getItem('hostName'));
  $rootScope.goHome = function(){
    layer.goHome();
  }

}])


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

/********************************** 引导页 **********************************/
    .state('home', { //引导页
      url: '/home',
      cache: 'true', 
      templateUrl: 'views/home.html',
      controller:'ionicNavBarDelegateCtrl'
    })

    .state('index', { //首页
      url: '/index',
      cache: 'true', 
      templateUrl: 'template/index_tpl.html',
      controller: 'indexCtrl'
    })

    .state('mylvteam', { //我的律师团
      url: '/mylvteam',
      cache: 'true', 
      templateUrl: 'template/mylvteam.html'
    })

/********************************** 用户登录 **********************************/
    .state('login', { //登录
      url: '/login',
      cache: 'true',
      templateUrl: 'template/home/login.html',
      controller: 'loginCtrl'
    })


/********************************** error **********************************/
    .state('error', { //error
      url: '/error',
      templateUrl: 'views/error.html'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/index');
});
