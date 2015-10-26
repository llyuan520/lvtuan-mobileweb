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

/********************************** 引导页 **********************************/
    .state('home', { //引导页
      url: "/home",
      templateUrl: "views/home.html",
      controller:'ionicNavBarDelegateCtrl'
    })

    .state('index', { //首页
      url: "/index",
      cache:'true', 
      templateUrl: "template/index_tpl.html",
      controller: 'indexCtrl'
    })

    .state('mylvteam', { //我的律师团
      url: "/mylvteam",
      cache:'true', 
      templateUrl: "template/mylvteam.html"
    })

/********************************** 用户登录 **********************************/
    .state('login', { //登录
      url: "/login",
      templateUrl: "template/home/login.html",
      controller: 'loginCtrl'
    })

    .state('register', { //注册
      url: "/register",
      templateUrl: "template/home/register.html",
      controller: 'registerCtrl'
    })

    .state('resetpwd', { //密码重置
      url: "/resetpwd",
      templateUrl: "template/resetpwd.html"/*,
      controller: 'resetpwdCtrl'*/
    })

/********************************** 圈子 **********************************/
    .state('group', { //圈子
      url: "/group",
      templateUrl: "template/group/group.html",
      controller: 'groupCtrl'
    })

/********************************** 知识 **********************************/
    .state('knowledge', { //知识
      url: "/knowledge",
      templateUrl: "template/knowledge/knowledge.html",
      controller: 'knowledgeCtrl'
    })

/********************************** 我的 **********************************/
    .state('center', { //我的
      url: "/center",
      templateUrl: "template/center/center.html",
      controller: 'centerCtrl'
    })

/********************************** 找律师 **********************************/
    .state('findlawyer', { //找律师
      url: "/findlawyer",
      templateUrl: "template/lawyer/findlawyer.html",
      controller: 'findlawyerCtrl'
    })

    .state('lawyerlist', { //找律师列表
      url: "/lawyerlist",
      templateUrl: "template/lawyer/lawyer_list.html",
      controller: 'lawyerlistCtrl'
    })
    
    
/********************************** 问律师 **********************************/
    .state('questions', { //问律师
      url: "/questions",
      cache:'true', 
      templateUrl: "template/questions/questions.html",
      controller: 'questionsCtrl'
    })

    .state('questionslist', { //问律师列表
      cache:'true', 
      url: "/questionslist",
      templateUrl: "template/questions/questions_list.html",
      controller: 'questionslistCtrl'
    })

/********************************** error **********************************/
    .state('error', { //error
      url: "/error",
      templateUrl: "views/error.html"
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});