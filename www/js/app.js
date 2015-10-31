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
.run(['$rootScope','$timeout','$location',function($rootScope,$timeout,$location){
  /*让浏览器记住token*/
  localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9.eyJzdWIiOjE0OTcsImlzcyI6Imh0dHA6XC9cLzE5Mi4xNjguMS40M1wvbG9naW4iLCJpYXQiOiIxNDQ2Mjg0Njk3IiwiZXhwIjoiMTQ0NjI4ODI5NyIsIm5iZiI6IjE0NDYyODQ2OTciLCJqdGkiOiI3MTY2NDBkNTRkOGQ1MzUxNTllODVkNGM1OWY2OWFhMiJ9.NWQwMzBhNDdmNGY4MzY2ZWNkOGY2MmM4ZWE5ZGRlZDI0MDdiOGU4MGFhMjA2YTY4MjU3MDk5NGE1NTQxN2E4MQ');
  //localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9.eyJzdWIiOjE0ODgsImlzcyI6Imh0dHA6XC9cL2Rldi53ZGxzdC5sYXctcGMtbmV3XC9sb2dpbiIsImlhdCI6IjE0NDU5NTA0MzUiLCJleHAiOiIxNDQ1OTU0MDM1IiwibmJmIjoiMTQ0NTk1MDQzNSIsImp0aSI6IjMzZmRlYmY0YjEwOWRkOWMyYzhmZmUyNjVkNGUxNjQyIn0.YjgwNDljNjVmZmQ3MDVhODE4ZmI4ZTE2Yzg3OGQzMjk1ZWUwYzZmYzllZjc5MTA1ZTZiZDdhYTg5MDE3MzgzYQ');
  $rootScope.token = localStorage.getItem('token');
  $timeout(function() {
      localStorage.removeItem('is_lawyer');
  }, 600);
  $rootScope.is_lawyer = JSON.parse(localStorage.getItem('is_lawyer'));
  //localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9.eyJzdWIiOjE0ODksImlzcyI6Imh0dHA6XC9cL2Rldi53ZGxzdC5sYXctcGMtbmV3XC9sb2dpbiIsImlhdCI6IjE0NDU1MDA3MzIiLCJleHAiOiIxNDQ1NTA0MzMyIiwibmJmIjoiMTQ0NTUwMDczMiIsImp0aSI6IjIzYjAxZWIyY2JjY2Q3ZmVmNjhjOGEwZTAwN2M4OGY2In0.OTU5YWQ0ZjI5ZWJmMzA2MDZiZGJmOTZiMTY4MTAxMzhiNzMxMmJiNTE2NmIyMmQ3MTRhZWIxM2I1ZTdkZmRhZg');
  var hostName = $location.host();
  if (hostName == '192.168.1.116') {
    hostName = hostName + ":81";
  } else {
    hostName = '192.168.1.43';
  }
  localStorage.setItem("hostName", JSON.stringify(hostName));
  $rootScope.hostName = JSON.parse(localStorage.getItem('hostName'));
}])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

/********************************** 引导页 **********************************/
    .state('home', { //引导页
      url: '/home',
      cache:'true', 
      templateUrl: 'views/home.html',
      controller:'ionicNavBarDelegateCtrl'
    })

    .state('index', { //首页
      url: '/index',
      cache:'true', 
      templateUrl: 'template/index_tpl.html',
      controller: 'indexCtrl'
    })

    .state('mylvteam', { //我的律师团
      url: '/mylvteam',
      cache:'true', 
      templateUrl: 'template/mylvteam.html'
    })

/********************************** 用户登录 **********************************/
    .state('login', { //登录
      url: '/login',
      cache:'false',
      templateUrl: 'template/home/login.html',
      controller: 'loginCtrl'
    })

    .state('register', { //注册
      url: '/register',
      cache:'false',
      templateUrl: 'template/home/register.html',
      controller: 'registerCtrl'
    })

    .state('resetpwd', { //密码重置
      url: '/resetpwd',
      templateUrl: 'template/home/resetpwd.html'/*,
      controller: 'resetpwdCtrl'*/
    })

/********************************** 圈子 **********************************/
    .state('group', { //圈子
      url: '/group',
      cache:'true',
      /*abstract:true,*/
      templateUrl: 'template/group/group.html',
      controller: 'groupCtrl'
    })
    .state('group.list', { //圈子 - 列表
      url: '/list',
      cache:'true',
      views: {
          'group-list': {
              templateUrl: 'template/group/group-list.html',
              controller: 'groupListCtrl'
          }
      }
    })
    .state('group.televise', { //圈子 - 广播
      url: '/televise',
      cache:'true',
      views: {
          'group-televise': {
              templateUrl: 'template/group/group-televise.html',
              controller: 'groupTeleviseCtrl'
          }
      }
    })
    .state('group.attention', { //圈子 - 关注
      url: '/attention',
      cache:'true',
      views: {
          'group-attention': {
              templateUrl: 'template/group/group-attention.html',
              controller: 'groupAttentionCtrl'
          }
      }
    })

    .state('groupview', { //圈子详情
      url: '/groupview',
      templateUrl: 'template/group/group_view.html',
      controller: 'groupviewCtrl'
    })
    .state('broadcastview', { //广播详情
      url: '/broadcastview',
      templateUrl: 'template/group/broadcast_view.html',
      controller: 'broadcastviewCtrl'
    })
    

/********************************** 知识 **********************************/
    .state('knowledge', { //知识
      url: '/knowledge',
     /* abstract:true,*/
      templateUrl: 'template/knowledge/knowledge.html'
    }) 
   .state('knowledge.knowledges', { //法规
      url: '/knowledges',
      cache:'true',
      views: {
          'knowledge-knowledges': {
              templateUrl: 'template/knowledge/knowledge-knowledges.html',
              controller: 'knowledgesCtrl'
          }
      }
    })
   .state('knowledge.documents', { //文库
      url: '/documents',
      cache:'true',
      views: {
          'knowledge-documents': {
              templateUrl: 'template/knowledge/knowledge-documents.html',
              controller: 'documentsCtrl'
          }
      }
    })
   .state('knowledge.cases', { //案列
      url: '/cases',
      cache:'true',
      views: {
          'knowledge-cases': {
              templateUrl: 'template/knowledge/knowledge-cases.html',
              controller: 'casesCtrl'
          }
      }
    })
    .state('knowknowledgesview', { //法规-详情
        url: '/knowknowledgesview/:id',
        cache:'true',
        templateUrl: 'template/knowledge/knowledges-view.html',
        controller: 'knowKnowledgesCtrl'
    })
    .state('knowdocumentsview', { //文库-详情
        url: '/knowdocumentsview/:id',
        cache:'true',
        templateUrl: 'template/knowledge/documents-view.html',
        controller: 'knowDocumentsCtrl'
    })
    .state('knowcasesview', { //案列-详情
        url: '/knowcasesview/:id',
        cache:'true',
        templateUrl: 'template/knowledge/cases-view.html',
        controller: 'knowCasesCtrl'
    })

/********************************** 我的 **********************************/
/*———————————————————————————— 用户的个人中心 ————————————————————————————*/
    .state('center', { //用户-我的
      url: '/center',
      cache:'true',
      templateUrl: 'template/center/center.html',
      controller: 'centerCtrl'
    })
    .state('info', { //用户-个人资料
      url: '/info',
      cache:'true',
      templateUrl: 'template/center/info.html',
      controller: 'infoCtrl'
    })
    .state('listscores', { //用户-我的积分
      url: '/listscores',
      cache:'true',
      templateUrl: 'template/center/list_scores.html',
      controller: 'listscoresCtrl'
    })
    .state('collect', { //用户-我的收藏
      url: '/collect',
      cache:'true',
      templateUrl: 'template/center/collect.html',
      controller: 'collectCtrl'
    })
    .state('comment', { //用户-我的评论
      url: '/comment',
      cache:'true',
      templateUrl: 'template/center/comment.html',
      controller: 'commentCtrl'
    })
    .state('messages', { //用户-我的消息
      url: '/messages',
      cache:'true',
      templateUrl: 'template/center/messages.html',
      controller: 'messagesCtrl'
    })
    .state('followed', { //用户-我的关注
      url: '/followed',
      cache:'true',
      templateUrl: 'template/center/followed.html',
      controller: 'followedCtrl'
    })
    .state('becomelawyer', { //用户-认证为律师
      url: '/becomelawyer',
      cache:'true',
      templateUrl: 'template/center/become_lawyer.html',
      controller: 'becomelawyerCtrl'
    })
    
/*———————————————————————————— 律师的个人中心 ————————————————————————————*/
    .state('center_lawyer', { //律师-我的
      url: '/center_lawyer',
      cache:'true',
      templateUrl: 'template/center/lawyer/center.html',
      controller: 'centerlaywerCtrl'
    })
    .state('infolawyer', { //律师-个人资料
      url: '/infolawyer',
      cache:'true',
      templateUrl: 'template/center/info.html',
      controller: 'infolawyerCtrl'
    })
    .state('followed_lawyer', { //律师-我的关注
      url: '/followed_lawyer',
      cache:'true',
      templateUrl: 'template/center/lawyer/followed.html',
      controller: 'followedlaywerCtrl'
    })
    .state('listscores_lawyer', { //律师-我的积分
      url: '/listscores_lawyer',
      cache:'true',
      templateUrl: 'template/center/lawyer/list_scores.html',
      controller: 'listscoreslaywerCtrl'
    })
    .state('comment_lawyer', { //律师-我的评论
      url: '/comment_lawyer',
      cache:'true',
      templateUrl: 'template/center/lawyer/comment.html',
      controller: 'commentlaywerCtrl'
    })
    .state('article_lawyer', { //律师-我的文章
      url: '/article_lawyer',
      cache:'true',
      templateUrl: 'template/center/lawyer/article.html',
      controller: 'articlelaywerCtrl'
    })
    .state('messages_lawyer', { //律师-我的消息
      url: '/messages_lawyer',
      cache:'true',
      templateUrl: 'template/center/lawyer/messages.html',
      controller: 'messageslaywerCtrl'
    })

/*———————————————————————————— 个人中心公用 ————————————————————————————*/
    .state('about', { //关于律团
      url: '/about',
      cache:'true',
      templateUrl: 'template/center/about.html',
      controller: 'aboutCtrl'
    })
    .state('site', { //设置
      url: '/site',
      cache:'true',
      templateUrl: 'template/center/site.html',
      controller: 'siteCtrl'
    })

    

/********************************** 找律师 **********************************/
    .state('lawyerlist', { //找律师列表
      url: '/lawyerlist',
      cache:'true',
      templateUrl: 'template/lawyer/lawyer_list.html',
      controller: 'lawyerlistCtrl'
    })
    .state('lawyer', { //律师个人主页
      url: '/lawyer/:id',
      cache:'true',
      templateUrl: 'template/lawyer/view.html',
      controller: 'viewCtrl'
    })

    .state('graphic', { //图文咨询
      url: '/graphic',
      cache:'true',
      templateUrl: 'template/lawyer/graphic.html',
      controller: 'graphicCtrl'
    })
    .state('special', { //专业咨询
      url: '/special',
      cache:'true',
      templateUrl: 'template/lawyer/special.html',
      controller: 'specialCtrl'
    })
    
/********************************** 问律师 **********************************/
    .state('questions', { //问律师
      url: '/questions',
      cache:'true', 
      templateUrl: 'template/questions/questions.html',
      controller: 'questionsCtrl'
    })
    .state('questionslist', { //问律师列表
      cache:'true', 
      url: '/questionslist',
      templateUrl: 'template/questions/questions_list.html',
      controller: 'questionslistCtrl'
    })
    .state('questionsview', { //问律师详情
      cache:'true', 
      url: '/questionsview/:id',
      templateUrl: 'template/questions/view.html',
      controller: 'questionsviewsCtrl'
    })

/********************************** 法律咨询 **********************************/
    .state('legaladvice', { //首页-法律咨询
      url: '/legaladvice',
      templateUrl: 'template/legaladvice.html',
      controller: 'legaladviceCtrl'
    })

/********************************** 法律讲堂 **********************************/
    .state('lawlecture', { //首页-法律讲堂
      url: '/lawlecture',
      templateUrl: 'template/lawlecture.html',
      controller: 'lawlectureCtrl'
    })
    .state('casescomm', { //首页-案件委托
      url: '/casescomm',
      templateUrl: 'template/casescomm.html',
      controller: 'casescommCtrl'
    })
    .state('lvtuanalliance', { //首页-律团联盟
      url: '/lvtuanalliance',
      templateUrl: 'template/lvtuanalliance.html',
      controller: 'lvtuanallianceCtrl'
    })
    .state('lvtuanallianceview', { //首页-律团联盟-联盟详情
      url: '/lvtuanallianceview/:id',
      templateUrl: 'template/lvtuanalliance_view.html',
      controller: 'lvtuanallianceCtrl'
    })
    
    .state('talent', { //首页-人才交流
      url: '/talent',
      templateUrl: 'template/talent.html',
      controller: 'talentCtrl'
    })

/********************************** error **********************************/
    .state('error', { //error
      url: '/error',
      templateUrl: 'views/error.html'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/index');
});
