angular.module('lvtuanApp', ['ionic', 'lvtuanApp.Ctrl'])

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
.run(['$rootScope',function($rootScope){
  /*让浏览器记住token*/
  localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9.eyJzdWIiOjE0ODksImlzcyI6Imh0dHA6XC9cL2Rldi53ZGxzdC5sYXctcGMtbmV3XC9sb2dpbiIsImlhdCI6IjE0NDU1MDA3MzIiLCJleHAiOiIxNDQ1NTA0MzMyIiwibmJmIjoiMTQ0NTUwMDczMiIsImp0aSI6IjIzYjAxZWIyY2JjY2Q3ZmVmNjhjOGEwZTAwN2M4OGY2In0.OTU5YWQ0ZjI5ZWJmMzA2MDZiZGJmOTZiMTY4MTAxMzhiNzMxMmJiNTE2NmIyMmQ3MTRhZWIxM2I1ZTdkZmRhZg");
  $rootScope.token = localStorage.getItem("token");
}])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('home', { //引导页
      url: "/home",
      templateUrl: "views/home.html",
      controller:'ionicNavBarDelegateCtrl'
    })

    .state('index', { //首页
      url: "/index",
      templateUrl: "template/index_tpl.html",
      controller: 'indexCtrl'
    })

    .state('mylvteam', { //首页
      url: "/mylvteam",
      templateUrl: "template/mylvteam.html"
    })

    .state('login', { //登录
      url: "/login",
      templateUrl: "template/login.html",
      controller: 'loginCtrl'
    })

    .state('register', { //注册
      url: "/register",
      templateUrl: "template/register.html",
      controller: 'registerCtrl'
    })

    .state('resetpwd', { //密码重置
      url: "/resetpwd",
      templateUrl: "template/resetpwd.html"/*,
      controller: 'resetpwdCtrl'*/
    })

    .state('group', { //圈子
      url: "/group",
      templateUrl: "template/group.html",
      controller: 'groupCtrl'
    })

    .state('knowledge', { //知识
      url: "/knowledge",
      templateUrl: "template/knowledge.html",
      controller: 'knowledgeCtrl'
    })

    .state('center', { //我的
      url: "/center",
      templateUrl: "template/center.html",
      controller: 'centerCtrl'
    })

    .state('error', { //error
      url: "/error",
      templateUrl: "views/error.html"
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});