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
  localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9.eyJzdWIiOjE0ODgsImlzcyI6Imh0dHA6XC9cL2Rldi53ZGxzdC5sYXctcGMtbmV3XC9sb2dpbiIsImlhdCI6IjE0NDU5MzAxNDciLCJleHAiOiIxNDQ1OTMzNzQ3IiwibmJmIjoiMTQ0NTkzMDE0NyIsImp0aSI6Ijg4ODM3MTcwNGViMjE1MzliMTEzMzM5ZGYxZTZhMTJkIn0.ZTQ3MjBiZmE0MDkyMjU4MjQ0NzdhYTQwNzg2MzVmZjNhMDg4NDY2YWQ4OWI4NWZmNTY2MjhmY2VhZTlmNmI2ZQ");
  //localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9.eyJzdWIiOjE0ODksImlzcyI6Imh0dHA6XC9cL2Rldi53ZGxzdC5sYXctcGMtbmV3XC9sb2dpbiIsImlhdCI6IjE0NDU1MDA3MzIiLCJleHAiOiIxNDQ1NTA0MzMyIiwibmJmIjoiMTQ0NTUwMDczMiIsImp0aSI6IjIzYjAxZWIyY2JjY2Q3ZmVmNjhjOGEwZTAwN2M4OGY2In0.OTU5YWQ0ZjI5ZWJmMzA2MDZiZGJmOTZiMTY4MTAxMzhiNzMxMmJiNTE2NmIyMmQ3MTRhZWIxM2I1ZTdkZmRhZg");
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
      cache:'false',
      templateUrl: "template/home/login.html",
      controller: 'loginCtrl'
    })

    .state('register', { //注册
      url: "/register",
      cache:'false',
      templateUrl: "template/home/register.html",
      controller: 'registerCtrl'
    })

    .state('resetpwd', { //密码重置
      url: "/resetpwd",
      templateUrl: "template/home/resetpwd.html"/*,
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
/*———————————————————————————— 用户的个人中心 ————————————————————————————*/
    .state('center', { //用户-我的
      url: "/center",
      cache:'true',
      templateUrl: "template/center/center.html",
      controller: 'centerCtrl'
    })
    .state('listscores', { //用户-我的积分
      url: "/listscores",
      cache:'true',
      templateUrl: "template/center/list_scores.html",
      controller: 'listscoresCtrl'
    })
    .state('collect', { //用户-我的收藏
      url: "/collect",
      cache:'true',
      templateUrl: "template/center/collect.html",
      controller: 'collectCtrl'
    })
    .state('comment', { //用户-我的评论
      url: "/comment",
      cache:'true',
      templateUrl: "template/center/comment.html",
      controller: 'commentCtrl'
    })
    .state('messages', { //用户-我的消息
      url: "/messages",
      cache:'true',
      templateUrl: "template/center/messages.html",
      controller: 'messagesCtrl'
    })
    .state('followed', { //用户-我的关注
      url: "/followed",
      cache:'true',
      templateUrl: "template/center/followed.html",
      controller: 'followedCtrl'
    })
    .state('becomelawyer', { //用户-认证为律师
      url: "/becomelawyer",
      cache:'true',
      templateUrl: "template/center/become_lawyer.html",
      controller: 'becomelawyerCtrl'
    })
    
/*———————————————————————————— 律师的个人中心 ————————————————————————————*/
    .state('center_lawyer', { //律师-我的
      url: "/center_lawyer",
      cache:'true',
      templateUrl: "template/center/lawyer/center.html",
      controller: 'centerlaywerCtrl'
    })
    .state('infolawyer', { //律师-个人资料
      url: "/infolawyer",
      cache:'true',
      templateUrl: "template/center/info.html",
      controller: 'infolawyerCtrl'
    })
    .state('followed_lawyer', { //律师-我的关注
      url: "/followed_lawyer",
      cache:'true',
      templateUrl: "template/center/lawyer/followed.html",
      controller: 'followedlaywerCtrl'
    })
    .state('listscores_lawyer', { //律师-我的积分
      url: "/listscores_lawyer",
      cache:'true',
      templateUrl: "template/center/lawyer/list_scores.html",
      controller: 'listscoreslaywerCtrl'
    })
    .state('comment_lawyer', { //律师-我的评论
      url: "/comment_lawyer",
      cache:'true',
      templateUrl: "template/center/lawyer/comment.html",
      controller: 'commentlaywerCtrl'
    })
    .state('article_lawyer', { //律师-我的文章
      url: "/article_lawyer",
      cache:'true',
      templateUrl: "template/center/lawyer/article.html",
      controller: 'articlelaywerCtrl'
    })
    .state('messages_lawyer', { //律师-我的消息
      url: "/messages_lawyer",
      cache:'true',
      templateUrl: "template/center/lawyer/messages.html",
      controller: 'messageslaywerCtrl'
    })

/*———————————————————————————— 个人中心公用 ————————————————————————————*/
    .state('about', { //关于律团
      url: "/about",
      cache:'true',
      templateUrl: "template/center/about.html",
      controller: 'aboutCtrl'
    })
    .state('site', { //设置
      url: "/site",
      cache:'true',
      templateUrl: "template/center/site.html",
      controller: 'siteCtrl'
    })

    

/********************************** 找律师 **********************************/
    .state('findlawyer', { //找律师-法律文书
      url: "/findlawyer",
      templateUrl: "template/lawyer/findlawyer.html",
      controller: 'findlawyerCtrl'
    })

    .state('lawyerlist', { //找律师列表
      url: "/lawyerlist",
      cache:'true',
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