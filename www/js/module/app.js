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
.run(['$rootScope','$timeout','$location','$ionicLoading',function($rootScope,$timeout,$location,$ionicLoading,$ionicHistory,$window){
  
 /*$timeout(function() {
      localStorage.removeItem('is_lawyer');
  }, 600);*/

  // 显示spinner
  $rootScope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="circles"></ion-spinner>',
      //duration: 800,
      noBackdrop: false
    });
  };
  $rootScope.hide = function(){
    $ionicLoading.hide();
  };

  //localStorage.removeItem('is_lawyer');
  var hostName = AppSettings.baseApiUrl;
  localStorage.setItem("hostName", JSON.stringify(hostName));
  $rootScope.hostName = JSON.parse(localStorage.getItem('hostName'));

  //回到首页
  $rootScope.goHome = function(){
    layer.goHome();
  }

}])

.run(function($rootScope, $location, $state, authService, locationService) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

        // 如果这个state需要登录才可以访问
        if (toState.authn) {
            // 如果用户没有登录
            if (!authService.isAuthed()) {
                sessionStorage.setItem("goback", $location.path());
                $rootScope.$broadcast('unauthenticated');
                event.preventDefault(); 
            } else {
                // 如果用户没有权限访问
                sessionStorage.setItem("goback", $location.path());
                currentUser = authService.getUser();
                if (toState.authz && toState.authz == 'lawyer' && !currentUser.is_verified_lawyer) {
                    $rootScope.$broadcast('unauthorized');
                    event.preventDefault();
                }
            }
        }

        //tabs选择项
        //设置首页四个按钮的选中
        $rootScope.path = $location.path();

    });

    $rootScope.$on('unauthorized', function() {
        layer.show('您没有权限访问这个链接！');
        $location.path('/login');
        $state.transitionTo("login");
        /*$window.location.href = '/login';*/
        //window.location.reload();
    });

    $rootScope.$on('unauthenticated', function() {
        layer.show('请先登录！');
        // $location.path('/login');
        $state.transitionTo("login");
        /*$window.location.href = '/login';*/
        //window.location.reload();
    });
    
})

.config(function($httpProvider) {
  $httpProvider.interceptors.push('APIInterceptor');
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

/********************************** 引导页 **********************************/
    .state('home', { //引导页
      url: '/home',
      cache: 'true', 
      templateUrl: 'template/home.html',
      controller:'ionicNavBarDelegateCtrl'
    })
    .state('index', { //首页
      url: '/index',
      cache: 'true',
      templateUrl: 'template/index_tpl.html',
      controller: 'indexCtrl'
    })

/********************************** 用户登录 **********************************/
    .state('login', { //登录
      url: '/login',
      cache: 'true',
      templateUrl: 'template/home/login.html'
    })

    .state('register', { //注册
      url: '/register',
      cache: 'true',
      templateUrl: 'template/home/register.html'
    })

    .state('resetpwd', { //密码重置
      url: '/resetpwd',
      cache: 'true',
      templateUrl: 'template/home/resetpwd.html'
    })

    .state('forgotpwd', { //忘记密码
      url: '/forgotpwd',
      cache: 'true',
      templateUrl: 'template/home/forgotpwd.html'
    })

    .state('wxauth', {
      url: '/wxauth?code&state',
      cache: 'true',
      controller: 'wxAuthCtrl'
    })

    .state('wxcheckopenid', {
      url: '/wxcheckopenid',
      cache: 'true',
      controller: 'wxCheckOpenIdCtrl'
    })

    .state('wxauthpayment', {
      url: '/wxauthpayment?code&state',
      cache: 'true',
      controller: 'wxAuthPaymentCtrl'
    })

    .state('wxlogin', {
      url: '/wxlogin',
      cache: 'true',
      controller: 'wxLoginCtrl'
    })

/********************************** 律圈 **********************************/
    .state('group', { //律圈
      url: '/group',
      cache: 'true',
      /*abstract:true,*/
      templateUrl: 'template/group/group.html',
      controller: 'groupCtrl',
      authn: true,
      authz: 'lawyer'
    })

    .state('group.list', { //律圈 - 列表
      url: '/list',
      cache: 'true',
      views: {
          'group-list': {
              templateUrl: 'template/group/group-list.html',
              controller: 'groupListCtrl'
          }
      },
      authn: true,
      authz: 'lawyer'
    })
   .state('group.televise', { //律圈 - 广播
      url: '/televise',
      cache: 'true',
      views: {
          'group-televise': {
              templateUrl: 'template/group/group-televise.html'
          }
      },
      authn: true,
      authz: 'lawyer'
    })
    .state('group.attention', { //律圈 - 关注
      url: '/attention',
      cache: 'true',
      views: {
          'group-attention': {
              templateUrl: 'template/group/group-attention.html',
              controller: 'groupAttentionCtrl'
          }
      },
      authn: true,
      authz: 'lawyer'
    })

    .state('groupviewinit', { //律圈详情
      url: '/group/viewinit/:id',
      controller: 'groupviewinitCtrl',
      authn: true,
      authz: 'lawyer'
    })

    .state('groupview', { //律圈详情
      url: '/group/view/:id',
      templateUrl: 'template/group/group_view.html',
      controller: 'groupviewCtrl',
      authn: true,
      authz: 'lawyer'
    })
    .state('broadcast/view', { //广播详情
      url: '/broadcast/view/:id',
      templateUrl: 'template/group/broadcast_view.html',
      controller: 'broadcastviewCtrl',
      authn: true,
      authz: 'lawyer'
    })

    .state('groupcreate', { //创建律圈
      url: '/groupcreate',
      templateUrl: 'template/group/create.html',
      controller: 'groupcreateCtrl',
      authn: true,
      authz: 'lawyer'
    })

    .state('televisecreate', { //创建广播
      url: '/televisecreate',
      templateUrl: 'template/group/televisecreate.html',
      controller: 'televisecreateCtrl',
      authn: true,
      authz: 'lawyer'
    })
    
    .state('group/site', { //律圈设置
      url: '/group/site/:id',
      templateUrl: 'template/group/group-site.html',
      controller: 'groupsiteCtrl',
      authn: true,
      authz: 'lawyer'
    })
    .state('group/add', { //律圈设置
      url: '/group/add/:id',
      templateUrl: 'template/group/group-add.html',
      controller: 'groupaddCtrl',
      authn: true,
      authz: 'lawyer'
    })
    
    

/********************************** 知识 **********************************/
    .state('knowledge', { //知识
      url: '/knowledge',
      /*abstract: true,*/
      templateUrl: 'template/knowledge/knowledge.html'
    }) 

   .state('knowledge.knowledges', { //法规
      url: '/knowledges',
      cache: 'true',
      views: {
          'knowledge-knowledges': {
              templateUrl: 'template/knowledge/knowledge-knowledges.html',
              controller: 'knowledgesCtrl'
          }
      }
    })
   .state('knowledge.documents', { //文库
      url: '/documents',
      cache: 'true',
      views: {
          'knowledge-documents': {
              templateUrl: 'template/knowledge/knowledge-documents.html',
              controller: 'documentsCtrl'
          }
      }
    })
   .state('knowledge.cases', { //案列
      url: '/cases',
      cache: 'true',
      views: {
          'knowledge-cases': {
              templateUrl: 'template/knowledge/knowledge-cases.html',
              controller: 'casesCtrl'
          }
      }
    })
    .state('knowledgeview', { //文章-详情
        url: '/knowledgeview/:id',
        cache: 'true',
        templateUrl: 'template/knowledge/knowledges-view.html',
        controller: 'knowledgeViewCtrl'
    })

    .state('comments/view', { //评论-详情
        url: '/comments/view/:id',
        cache: 'true',
        templateUrl: 'template/knowledge/comments-view.html',
        controller: 'commentsViewCtrl'
    })
/********************************** 我的 **********************************/
/*———————————————————————————— 用户的个人中心 ————————————————————————————*/
    .state('center', { //用户-我的
      url: '/center',
      cache: 'true',
      templateUrl: 'template/center/center.html',
      controller: 'centerCtrl',
      authn: true
    })
    .state('info', { //用户-个人资料
      url: '/info',
      cache: 'true',
      templateUrl: 'template/center/info.html',
      controller: 'infoCtrl',
      authn: true
    })
    
    .state('becomenav', { //用户-认证为律师
      url: '/becomenav',
      cache: 'true',
      templateUrl: 'template/center/become/become_nav.html',
      controller: 'becomenavCtrl',
      authn: true
    })
    .state('practitioners', { //用户-认证为律师 - 从业信息
      url: '/practitioners',
      cache: 'true',
      templateUrl: 'template/center/become/practitioners.html',
      authn: true
    })
    .state('verified', { //用户-认证为律师 - 实名认证
      url: '/verified',
      cache: 'true',
      templateUrl: 'template/center/become/verified.html',
      authn: true
    })
    .state('tariffset', { //用户-认证为律师 - 资费设置
      url: '/tariffset',
      cache: 'true',
      templateUrl: 'template/center/become/tariffset.html',
      authn: true
    })
    .state('field', { //用户-认证为律师 - 擅长领域
      url: '/field',
      cache: 'true',
      templateUrl: 'template/center/become/field.html',
      controller: 'fieldCtrl',
      authn: true
    })
    .state('case', { //用户-认证为律师 - 经历案例
      url: '/case',
      cache: 'true',
      templateUrl: 'template/center/become/case.html',
      authn: true
    })
    .state('citypicke/all', { //用户-认证为律师 - 经历案例
      url: '/citypicke/all',
      cache: 'true',
      templateUrl: 'template/citypicker-all.html',
      controller: 'citypickeAllCtrl',
      authn: true
    })
    .state('valrealname', { //个人信息 - 修改姓名
      url: '/valrealname',
      cache: 'true',
      templateUrl: 'template/center/become/valrealname.html',
      controller: 'valrealnameCtrl',
      authn: true
    })
    .state('valphone', { //个人信息 - 修改手机
      url: '/valphone',
      cache: 'true',
      templateUrl: 'template/center/become/valphone.html',
      controller: 'valphoneCtrl',
      authn: true
    })
    .state('valemail', { //个人信息 - 修改邮箱
      url: '/valemail',
      cache: 'true',
      templateUrl: 'template/center/become/valemail.html',
      controller: 'valemailCtrl',
      authn: true
    })



/*———————————————————————————— 律师的个人中心 ————————————————————————————*/
    .state('comment', { //用户和律师-我的评论
      url: '/comment',
      cache: 'true',
      templateUrl: 'template/center/comment.html',
      controller: 'commentCtrl',
      authn: true
    })
    
    .state('followed', { //用户和律师-我的关注
      url: '/followed',
      cache: 'true',
      templateUrl: 'template/center/followed.html',
      controller: 'followedCtrl',
      authn: true
    })

/*———————————————————————————— 个人中心公用 ————————————————————————————*/
    .state('about', { //关于律团
      url: '/about',
      cache: 'true',
      templateUrl: 'template/center/about.html',
      controller: 'aboutCtrl',
      authn: false
    })
    .state('applicationsintro', { //应用介绍
      url: '/applicationsintro',
      cache: 'true',
      templateUrl: 'template/center/applicationsintro.html',
      authn: false
    })
    .state('userpact', { //用户协议
      url: '/userpact',
      cache: 'true',
      templateUrl: 'template/center/userpact.html',
      controller:'userpactCtrl',
      authn: false
    })

    .state('site', { //设置
      url: '/site',
      cache: 'true',
      templateUrl: 'template/center/site.html',
      controller: 'siteCtrl',
      authn: true
    })
    .state('listscores', { //我的积分
      url: '/listscores',
      cache: 'true',
      templateUrl: 'template/center/list_scores.html',
      controller: 'listscoresCtrl',
      authn: true
    })
    .state('collect', { //我的收藏
      url: '/collect',
      cache: 'true',
      templateUrl: 'template/center/collect.html',
      controller: 'collectCtrl',
      authn: true
    })
    .state('messages', { //我的消息
      url: '/messages',
      cache: 'true',
      templateUrl: 'template/center/messages.html',
      controller: 'messagesCtrl',
      authn: true
    })

   .state('messages.mymesg', { //我的消息 - 我的消息
      url: '/mymesg',
      cache: 'true',
      views: {
          'messages-mymesg': {
              templateUrl: 'template/center/mymesg.html',
              controller: 'mymesgCtrl'
          }
      },
      authn: true
    })
   .state('messages.sysmesg', { //我的消息 - 系统消息
      url: '/sysmesg',
      cache: 'true',
      views: {
          'messages-sysmesg': {
              templateUrl: 'template/center/sysmesg.html',
              controller: 'sysmesgCtrl'
          }
      },
      authn: true
    })

    .state('message_details', { //我的消息-消息详情
      url: '/message/:id',
      cache: 'true',
      templateUrl: 'template/center/message_view.html',
      controller: 'viewMessageCtrl',
      authn: true
    })

/********************************** 找律师 **********************************/
    .state('lawyerlist', { //找律师列表
      url: '/lawyerlist',
      cache: 'true',
      templateUrl: 'template/lawyer/lawyer_list.html'
    })
    .state('lawyer', { //律师个人主页
      url: '/lawyer/:id',
      cache: 'true',
      templateUrl: 'template/lawyer/view.html',
      controller: 'viewCtrl'
    })

    .state('graphic', { //图文咨询
      url: '/graphic/:type',
      cache: 'true',
      templateUrl: 'template/lawyer/graphic.html',
      authn: true
    })
    
/********************************** 问律师 **********************************/
    .state('questions', { //问律师
      url: '/questions',
      cache: 'true', 
      templateUrl: 'template/questions/questions.html',
      controller: 'questionsCtrl',
      authn: true
    })
    .state('questionslist', { //问律师列表
      cache: 'true', 
      url: '/questionslist',
      templateUrl: 'template/questions/questions_list.html',
      controller: 'questionslistCtrl',
      authn: false
    })
    .state('question/list/search', { //问律师列表
      cache: 'true', 
      url: '/question/list/search',
      templateUrl: 'template/questions/questions_list_search.html'
    })
    
    .state('questionsview', { //问律师详情
      cache: 'true', 
      url: '/questionsview/:id',
      templateUrl: 'template/questions/view.html',
      controller: 'questionsviewsCtrl',
      authn: false
    })
    .state('questions/help', { //咨询帮助
      cache: 'true', 
      url: '/questions/help',
      templateUrl: 'template/questions/questions_help.html',
      authn: true
    })

/*———————————————————————————— 我的律团- 我的订单 -公用 ————————————————————————————*/

  .state('/lawyer/comment/', { //我的订单 - 评价详情
    url: '/lawyer/comment/:id',
    templateUrl: 'template/lawyer/comment.html',
    controller: 'commentlawyerCtrl',
    authn: true
  })

  .state('easemobmain', { //咨询和订单的一对一咨询 - 即时通讯
      url: '/easemobmain/:id',
      templateUrl: 'template/mylvtuan/easemobmain.html',
      controller: 'easemobmainCtrl',
      authn: true
  })

  .state('easemobinit', { //准备 - 即时通讯
      url: '/easemobinit/:id',
      controller: 'easemobinitCtrl',
      authn: true
  })
  
/*———————————————————————————— 我的律团 - 公用 ————————————————————————————*/
  .state('userlvtuan', { //首页 - 我的律团 - 工作台
      url: '/userlvtuan',
      templateUrl: 'template/mylvtuan/user/userlvtuan.html',
      controller: 'userlvtuanCtrl',
      authn: true
  })


  //首页 - 我的 - 免费咨询
  .state('question/gratis', { //首页 - 我的 - 免费咨询
      url: '/question/gratis',
      templateUrl: 'template/mylvtuan/question/gratis/question.html',
      authn: true
  })
  .state('question/gratis.new', { //免费咨询 - 待受理
      url: '/new',
      views: {
          'question-gratis-new': {
              templateUrl: 'template/mylvtuan/question/gratis/new.html',
              controller: 'questionGratisNewCtrl'
          }
      },
      authn: true
  })
  .state('question/gratis.waitforconfirmation', { //免费咨询 - 待确认
      url: '/waitforconfirmation',
      views: {
          'question-gratis-waitforconfirmation': {
              templateUrl: 'template/mylvtuan/question/gratis/waitforconfirmation.html',
              controller: 'questionGratisWaitforconfirmationCtrl'
          }
      },
      authn: true
  })
  .state('question/gratis.waitforevaluation', { //免费咨询 - 待评价
      url: '/waitforevaluation',
      views: {
          'question-gratis-waitforevaluation': {
              templateUrl: 'template/mylvtuan/question/gratis/waitforevaluation.html',
              controller: 'questionGratisWaitforevaluationCtrl'
          }
      },
      authn: true
    })
   .state('question/gratis.complete', { //免费咨询 - 已完成
      url: '/complete',
      views: {
          'question-gratis-complete': {
              templateUrl: 'template/mylvtuan/question/gratis/complete.html',
              controller: 'questionGratisCompleteCtrl'
          }
      },
      authn: true
    })
  
  .state('question/gratis.cancelled', { //免费咨询 - 已取消
      url: '/cancelled',
      views: {
          'question-gratis-cancelled': {
              templateUrl: 'template/mylvtuan/question/gratis/cancelled.html',
              controller: 'questionGratisCancelledCtrl'
          }
      },
      authn: true
  })
  .state('question/gratis/view', { //免费咨询 - 咨询详情
      url: '/question/gratis/view/:id',
      templateUrl: 'template/mylvtuan/question/gratis/view.html',
      controller: 'questionGratisViewCtrl',
      authn: true
  })
  .state('question/gratis/send/mind', { //免费咨询 - 咨询详情 - 送心意
      url: '/send/mind/:id',
      templateUrl: 'template/mylvtuan/question/gratis/send-mind.html',
      authn: true
    })


  //首页 - 我的 - 图文咨询
  .state('question/paytext', { //首页 - 我的 - 图文咨询
      url: '/question/paytext',
      templateUrl: 'template/mylvtuan/question/paytext/question.html',
      authn: true
  })
  .state('question/paytext.new', { //图文咨询 - 待受理
      url: '/new',
      views: {
          'question-paytext-new': {
              templateUrl: 'template/mylvtuan/question/paytext/new.html',
              controller: 'questionPaytextNewCtrl'
          }
      },
      authn: true
  })
  .state('question/paytext.waitforconfirmation', { //图文咨询 - 待确认
      url: '/waitforconfirmation',
      views: {
          'question-paytext-waitforconfirmation': {
              templateUrl: 'template/mylvtuan/question/paytext/waitforconfirmation.html',
              controller: 'questionPaytextWaitforconfirmationCtrl'
          }
      },
      authn: true
  })
  .state('question/paytext.waitforevaluation', { //图文咨询 - 待评价
      url: '/waitforevaluation',
      views: {
          'question-paytext-waitforevaluation': {
              templateUrl: 'template/mylvtuan/question/paytext/waitforevaluation.html',
              controller: 'questionPaytextWaitforevaluationCtrl'
          }
      },
      authn: true
    })
   .state('question/paytext.complete', { //图文咨询 - 已完成
      url: '/complete',
      views: {
          'question-paytext-complete': {
              templateUrl: 'template/mylvtuan/question/paytext/complete.html',
              controller: 'questionPaytextCompleteCtrl'
          }
      },
      authn: true
    })
  
  .state('question/paytext.cancelled', { //图文咨询 - 已取消
      url: '/cancelled',
      views: {
          'question-paytext-cancelled': {
              templateUrl: 'template/mylvtuan/question/paytext/cancelled.html',
              controller: 'questionPaytextCancelledCtrl'
          }
      },
      authn: true
  })
  .state('question/paytext/view', { //图文咨询 - 咨询详情
      url: '/question/paytext/view/:id',
      templateUrl: 'template/mylvtuan/question/paytext/view.html',
      controller: 'questionPaytextViewCtrl',
      authn: true
  })



 //首页 - 我的 - 电话咨询
  .state('question/payphone', { //首页 - 我的 - 电话咨询
      url: '/question/payphone',
      templateUrl: 'template/mylvtuan/question/payphone/question.html',
      authn: true
  })
  .state('question/payphone.new', { //图文咨询 - 待受理
      url: '/new',
      views: {
          'question-payphone-new': {
              templateUrl: 'template/mylvtuan/question/payphone/new.html',
              controller: 'questionPayphoneNewCtrl'
          }
      },
      authn: true
  })
  .state('question/payphone.waitforconfirmation', { //图文咨询 - 待确认
      url: '/waitforconfirmation',
      views: {
          'question-payphone-waitforconfirmation': {
              templateUrl: 'template/mylvtuan/question/payphone/waitforconfirmation.html',
              controller: 'questionPayphoneWaitforconfirmationCtrl'
          }
      },
      authn: true
  })
  .state('question/payphone.waitforevaluation', { //图文咨询 - 待评价
      url: '/waitforevaluation',
      views: {
          'question-payphone-waitforevaluation': {
              templateUrl: 'template/mylvtuan/question/payphone/waitforevaluation.html',
              controller: 'questionPayphoneWaitforevaluationCtrl'
          }
      },
      authn: true
    })
   .state('question/payphone.complete', { //图文咨询 - 已完成
      url: '/complete',
      views: {
          'question-payphone-complete': {
              templateUrl: 'template/mylvtuan/question/payphone/complete.html',
              controller: 'questionPayphoneCompleteCtrl'
          }
      },
      authn: true
    })
  
  .state('question/payphone.cancelled', { //图文咨询 - 已取消
      url: '/cancelled',
      views: {
          'question-payphone-cancelled': {
              templateUrl: 'template/mylvtuan/question/payphone/cancelled.html',
              controller: 'questionPayphoneCancelledCtrl'
          }
      },
      authn: true
  })
  .state('question/payphone/view', { //图文咨询 - 咨询详情
      url: '/question/payphone/view/:id',
      templateUrl: 'template/mylvtuan/question/payphone/view.html',
      controller: 'questionPayphoneViewCtrl',
      authn: true
  })


  //首页 - 我的 - 法律顾问
  .state('question/paycompany', { //首页 - 我的 - 法律顾问
      url: '/question/paycompany',
      templateUrl: 'template/mylvtuan/question/paycompany/question.html',
      authn: true
  })
  .state('question/paycompany.new', { //图文咨询 - 待受理
      url: '/new',
      views: {
          'question-paycompany-new': {
              templateUrl: 'template/mylvtuan/question/paycompany/new.html',
              controller: 'questionPaycompanyNewCtrl'
          }
      },
      authn: true
  })
  .state('question/paycompany.waitforconfirmation', { //图文咨询 - 待确认
      url: '/waitforconfirmation',
      views: {
          'question-paycompany-waitforconfirmation': {
              templateUrl: 'template/mylvtuan/question/paycompany/waitforconfirmation.html',
              controller: 'questionPaycompanyWaitforconfirmationCtrl'
          }
      },
      authn: true
  })
  .state('question/paycompany.waitforevaluation', { //图文咨询 - 待评价
      url: '/waitforevaluation',
      views: {
          'question-paycompany-waitforevaluation': {
              templateUrl: 'template/mylvtuan/question/paycompany/waitforevaluation.html',
              controller: 'questionPaycompanyWaitforevaluationCtrl'
          }
      },
      authn: true
    })
   .state('question/paycompany.complete', { //图文咨询 - 已完成
      url: '/complete',
      views: {
          'question-paycompany-complete': {
              templateUrl: 'template/mylvtuan/question/paycompany/complete.html',
              controller: 'questionPaycompanyCompleteCtrl'
          }
      },
      authn: true
    })
  
  .state('question/paycompany.cancelled', { //图文咨询 - 已取消
      url: '/cancelled',
      views: {
          'question-paycompany-cancelled': {
              templateUrl: 'template/mylvtuan/question/paycompany/cancelled.html',
              controller: 'questionPaycompanyCancelledCtrl'
          }
      },
      authn: true
  })
  .state('question/paycompany/view', { //图文咨询 - 咨询详情
      url: '/question/paycompany/view/:id',
      templateUrl: 'template/mylvtuan/question/paycompany/view.html',
      controller: 'questionPaycompanyViewCtrl',
      authn: true
  })

  //我的商品
  .state('commodity', { //我的商品 - 列表
      url: '/commodity',
      templateUrl: 'template/mylvtuan/commodity/commodity.html',
      controller: 'commodityListCtrl',
      authn: true
  })

  .state('confirmCompletion', { //首页 - 我的律团 - 用户的评价
      url: '/confirmCompletion/:id',
      templateUrl: 'template/mylvtuan/question/confirm-completion.html',
      authn: true
  })

  .state('wallet', { //我的律团-用户的钱包
    url: '/wallet',
    templateUrl: 'template/mylvtuan/wallet/wallet.html',
    controller: 'userwalletCtrl',
    authn: true
  })
  .state('moneyin', { //我的律团-钱包充值
    url: '/moneyin',
    templateUrl: 'template/mylvtuan/wallet/moneyin.html',
    controller: 'usermoneyinCtrl',
    authn: true
  })
  .state('moneyout', { //我的律团-提现
    url: '/moneyout',
    templateUrl: 'template/mylvtuan/wallet/moneyout.html',
    authn: true
  })
    

/********************************** 法律讲堂 **********************************/
/*workbench-lawyer.html*/

    .state('lawlecture', { //首页-法律讲堂
      url: '/lawlecture',
      templateUrl: 'template/lecture/lawlecture.html',
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
      controller: 'lvtuanallianceviewCtrl'
    })
    
    .state('talent', { //首页-人才交流
      url: '/talent',
      templateUrl: 'template/talent.html',
      controller: 'talentCtrl'
    })
    .state('talentview', { //首页-人才交流
      url: '/talentview/:id',
      templateUrl: 'template/talentview.html',
      controller: 'talentviewCtrl'
    })


/********************************** 文书下载 **********************************/
    .state('document/list', { //首页-文书下载
      url: '/document/list',
      templateUrl: 'template/document/list.html',
      controller: 'documentlistCtrl'
    })
    .state('document/download_list', { //首页-文书下载 - 详情页
      url: '/document/download_list/:id',
      templateUrl: 'template/document/download_list.html',
      controller: 'documentownloadlistCtrl'
    })
    .state('document/list/search', { //首页-文书搜索
      url: '/document/list/search',
      templateUrl: 'template/document/download_list_search.html'
    })
    

/********************************** 小微企服 **********************************/
    .state('corporate', { //首页-小微企服
      url: '/corporate',
      templateUrl: 'template/corporate/corporateservices.html',
      controller: 'corporateservicesCtrl'
    })
    .state('corporate/list', { //首页 - 小微企服
      url: '/corporate/list/:id',
      templateUrl: 'template/corporate/list.html',
      controller: 'corporatelistCtrl'
    })
    .state('corporate/buynow', { //首页 - 小微企服 - 立即购买
      url: '/corporate/buynow/:id',
      templateUrl: 'template/corporate/buynow.html',
      authn: true
    })
    .state('pay', { //首页 - 微信支付
      url: '/pay/:id?type',
      templateUrl: 'template/pay.html',
      authn: true
    })
    .state('citypicker', { //首页 - 选择地址
      url: '/citypicker/:id',
      templateUrl: 'template/citypicker.html',
      controller: 'citypickerCtrl'
    })

/********************************** error **********************************/
    .state('error', { //error
      url: '/error',
      templateUrl: 'template/error.html'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/index');
});

