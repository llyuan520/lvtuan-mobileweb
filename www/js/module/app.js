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
                $rootScope.$broadcast('unauthenticated');
                event.preventDefault(); 
            } else {
                // 如果用户没有登录
                currentUser = authService.getUser();
                if (toState.authz && toState.authz == 'lawyer' && !currentUser.is_verified_lawyer) {
                    $rootScope.$broadcast('unauthorized');
                    $state.transitionTo("login");
                    event.preventDefault();
                }
            }
        }
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
      controller: 'indexCtrl',
      activetab: 'index'
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

    .state('wxlogin', {
      url: '/wxlogin',
      cache: 'true',
      controller: 'wxLoginCtrl'
    })

/********************************** 圈子 **********************************/
    .state('group', { //圈子
      url: '/group',
      cache: 'true',
      /*abstract:true,*/
      templateUrl: 'template/group/group.html',
      controller: 'groupCtrl',
      authn: true,
      authz: 'lawyer',
      activetab: 'group'
    })

    .state('group.list', { //圈子 - 列表
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
   .state('group.televise', { //圈子 - 广播
      url: '/televise',
      cache: 'true',
      views: {
          'group-televise': {
              templateUrl: 'template/group/group-televise.html',
              controller: 'groupTeleviseCtrl'
          }
      },
      authn: true,
      authz: 'lawyer'
    })
    .state('group.attention', { //圈子 - 关注
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

    .state('groupview', { //圈子详情
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

    .state('groupcreate', { //创建圈子
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
    
    .state('group/site', { //圈子设置
      url: '/group/site/:id',
      templateUrl: 'template/group/group-site.html',
      controller: 'groupsiteCtrl',
      authn: true,
      authz: 'lawyer'
    })
    .state('group/add', { //圈子设置
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
      templateUrl: 'template/knowledge/knowledge.html',
      activetab: 'knowledge'
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
      authn: true,
      activetab: 'center'
    })
    .state('info', { //用户-个人资料
      url: '/info',
      cache: 'true',
      templateUrl: 'template/center/info.html',
      controller: 'infoCtrl',
      authn: true
    })
    .state('comment', { //用户-我的评论
      url: '/comment',
      cache: 'true',
      templateUrl: 'template/center/comment.html',
      controller: 'commentCtrl',
      authn: true
    })
    .state('followed', { //用户-我的关注
      url: '/followed',
      cache: 'true',
      templateUrl: 'template/center/followed.html',
      controller: 'followedCtrl',
      authn: true
    })
    .state('becomelawyer', { //用户-认证为律师
      url: '/becomelawyer',
      cache: 'true',
      templateUrl: 'template/center/become_lawyer.html',
      controller: 'becomelawyerCtrl',
      authn: true
    })
/*———————————————————————————— 律师的个人中心 ————————————————————————————*/
    .state('followed_lawyer', { //律师-我的关注
      url: '/followed_lawyer',
      cache: 'true',
      templateUrl: 'template/center/lawyer/followed.html',
      controller: 'followedlaywerCtrl',
      authn: true
    })
    .state('comment_lawyer', { //律师-我的评论
      url: '/comment_lawyer/:id',
      cache:'false',
      templateUrl: 'template/center/lawyer/comment.html',
      controller: 'commentlaywerCtrl',
      authn: true
    })
    .state('article_lawyer', { //律师-我的文章
      url: '/article_lawyer',
      templateUrl: 'template/center/lawyer/article.html',
      authn: true
    })
   .state('article_lawyer.case', { //律师 - 案例分析
      url: '/case/:class',
      views: {
          'article-case': {
              templateUrl: 'template/center/lawyer/article-case.html',
              controller: 'caselaywerCtrl'
          }
      },
      authn: true
    })
   .state('article_lawyer.advisory', { //律师 - 咨询
      url: '/advisory/:class',
      views: {
          'article-advisory': {
              templateUrl: 'template/center/lawyer/article-advisory.html',
              controller: 'caselaywerCtrl'
          }
      },
      authn: true
    })
   .state('article_lawyer.lknowledge', { //律师 - 知识
      url: '/lknowledge/:class',
      views: {
          'article-lknowledge': {
              templateUrl: 'template/center/lawyer/article-lknowledge.html',
              controller: 'caselaywerCtrl'
          }
      },
      authn: true
    })

    .state('/lawyer/article/view', { //律师-我的文章 - 文章详情
      url: '/lawyer/article/view/:id',
      templateUrl: 'template/center/lawyer/view.html',
      controller: 'viewarticlelawyerCtrl',
      authn: true
    })

/*———————————————————————————— 个人中心公用 ————————————————————————————*/
    .state('about', { //关于律团
      url: '/about',
      cache: 'true',
      templateUrl: 'template/center/about.html',
      controller: 'aboutCtrl',
      authn: true
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
      url: '/graphic',
      cache: 'true',
      templateUrl: 'template/lawyer/graphic.html',
      authn: true
    })
    .state('special', { //专业咨询
      url: '/special',
      cache: 'true',
      templateUrl: 'template/lawyer/special.html',
      controller: 'specialCtrl',
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
      authn: true
    })
    .state('questionsview', { //问律师详情
      cache: 'true', 
      url: '/questionsview/:id',
      templateUrl: 'template/questions/view.html',
      controller: 'questionsviewsCtrl',
      authn: true
    })

/********************************** 法律咨询 **********************************/
    .state('legaladvice', { //首页-法律咨询
      url: '/legaladvice',
      templateUrl: 'template/legaladvice.html',
      controller: 'legaladviceCtrl'
    })

/*———————————————————————————— 我的律团- 律师 -公用 ————————————————————————————*/
/*    .state('lawyerlvtuan', { //首页 - 我的律团 - 律师的工作台
      url: '/lawyerlvtuan',
      cache: 'true', 
      templateUrl: 'template/mylvtuan/lawyer/lawyerlvtuan.html',
      controller: 'lawyerlvtuanCtrl'
    })*/
/*———————————————————————————— 我的律团- 律师订单 -公用 ————————————————————————————*/
    .state('workbenchlawyer', { //首页 - 我的律团 - 律师的工作台
      url: '/workbenchlawyer',
      templateUrl: 'template/mylvtuan/lawyer/workbench-lawyer.html',
      controller: 'workbenchLawyerCtrl',
      authn: true
    })
    .state('orderlawyer', { //首页 - 我的律团 - 律师的工作
      url: '/orderlawyer',
      templateUrl: 'template/mylvtuan/lawyer/order/order-lawyer.html',
      authn: true
    })
   .state('orderlawyer.all', { //律师订单 - 全部
      url: '/all',
      cache: 'true',
      views: {
          'order-all': {
              templateUrl: 'template/mylvtuan/lawyer/order/order-all.html',
              controller: 'orderAllCtrl'
          }
      },
      authn: true
    })
   .state('orderlawyer.new', { //律师订单 - 待受理
      url: '/new',
      cache: 'true',
      views: {
          'order-new': {
              templateUrl: 'template/mylvtuan/lawyer/order/order-new.html',
              controller: 'orderNewCtrl'
          }
      },
      authn: true
    })
   .state('orderlawyer.replied', { //律师订单 - 待确认
      url: '/replied',
      cache: 'true',
      views: {
          'order-replied': {
              templateUrl: 'template/mylvtuan/lawyer/order/order-replied.html',
              controller: 'orderRepliedCtrl'
          }
      },
      authn: true
    })
   .state('orderlawyer.complete', { //律师订单 - 已完成
      url: '/complete',
      cache: 'true',
      views: {
          'order-complete': {
              templateUrl: 'template/mylvtuan/lawyer/order/order-complete.html',
              controller: 'orderCompleteCtrl'
          }
      },
      authn: true
    })
   .state('orderlawyerdetail', { //律师订单 - 订单详情
      url: '/orderlawyerdetail/:id',
      templateUrl: 'template/mylvtuan/lawyer/order/order-detail.html',
      controller: 'orderlawyerDetailCtrl',
      authn: true
    })
    .state('/lawyer/order/comment', { //律师订单-我的订单 - 评价详情
      url: '/lawyer/order/comment/:id',
      templateUrl: 'template/mylvtuan/lawyer/order/comment.html',
      controller: 'commentorderlawyerCtrl',
      authn: true
    })

   .state('lawyerquestion', { //首页 - 我的律团 - 律师的咨询
      url: '/lawyerquestion',
      templateUrl: 'template/mylvtuan/lawyer/question/question.html',
      authn: true
    })
  .state('lawyerquestion.new', { //律师的咨询 - 待受理
      url: '/new',
      cache: 'true',
      views: {
          'question-new': {
              templateUrl: 'template/mylvtuan/lawyer/question/new.html',
              controller: 'lawyerquestionNewCtrl'
          }
      },
      authn: true
    })
  .state('lawyerquestion.replied', { //律师的咨询 - 待确认
      url: '/replied',
      cache: 'true',
      views: {
          'question-replied': {
              templateUrl: 'template/mylvtuan/lawyer/question/replied.html',
              controller: 'lawyerquestionRepliedCtrl'
          }
      },
      authn: true
    })
  .state('lawyerquestion.complete', { //律师的咨询 - 待评价
      url: '/complete',
      cache: 'true',
      views: {
          'question-complete': {
              templateUrl: 'template/mylvtuan/lawyer/question/complete.html',
              controller: 'lawyerquestionCompleteCtrl'
          }
      },
      authn: true
    })
  
  .state('lawyer/questions/view', { // 律师的工作台 - 咨询详情
      url: '/lawyer/questions/view/:id',
      cache: 'true', 
      templateUrl: 'template/mylvtuan/lawyer/question/view.html',
      controller: 'lawyerquestionsviewCtrl',
      authn: true
  })

  .state('queryrefer', { // 律师的工作台 - 咨询参考
      url: '/queryrefer',
      cache: 'true', 
      templateUrl: 'template/mylvtuan/lawyer/queryrefer.html',
      authn: true
  })
  .state('queryreferdetail', { //律师的工作台 - 咨询参考详情
      url: '/queryreferdetail',
      cache: 'true', 
      templateUrl: 'template/mylvtuan/lawyer/queryrefer-detail.html',
      authn: true
  })

  .state('easemobmain', { //咨询和订单的一对一咨询 - 即时通讯
      url: '/easemobmain/:id',
      templateUrl: 'template/mylvtuan/easemobmain.html',
      controller: 'easemobmainCtrl',
      authn: true
  })
  
/*———————————————————————————— 我的律团- 用户 -公用 ————————————————————————————*/
  .state('userlvtuan', { //首页 - 我的律团 - 用户的工作台
      url: '/userlvtuan',
      cache: 'true', 
      templateUrl: 'template/mylvtuan/user/userlvtuan.html',
      controller: 'userlvtuanCtrl',
      authn: true
  })
  .state('userquestion', { //首页 - 我的律团 - 用户的咨询
      url: '/userquestion',
      templateUrl: 'template/mylvtuan/user/question/question.html',
      authn: true
  })
  .state('userquestion.new', { //用户的咨询 - 待受理
      url: '/new',
      cache: 'true',
      views: {
          'question-new': {
              templateUrl: 'template/mylvtuan/user/question/new.html',
              controller: 'questionNewCtrl'
          }
      },
      authn: true
  })
  .state('userquestion.all', { //用户的咨询 - 全部
      url: '/all',
      cache: 'true',
      views: {
          'question-all': {
              templateUrl: 'template/mylvtuan/user/question/all.html',
              controller: 'questionAllCtrl'
          }
      },
      authn: true
  })
  .state('userquestion.replied', { //用户的咨询 - 处理中
      url: '/replied',
      cache: 'true',
      views: {
          'question-replied': {
              templateUrl: 'template/mylvtuan/user/question/replied.html',
              controller: 'questionRepliedCtrl'
          }
      },
      authn: true
  })
  .state('userquestion.waitforconfirmation', { //用户的咨询 - 待确认
      url: '/waitforconfirmation',
      cache: 'true',
      views: {
          'question-waitforconfirmation': {
              templateUrl: 'template/mylvtuan/user/question/waitforconfirmation.html',
              controller: 'questionWaitforconfirmationCtrl'
          }
      },
      authn: true
  })

  .state('user/question/view', { //首页 - 我的律团 - 用户的咨询
      url: '/user/question/view/:id',
      templateUrl: 'template/mylvtuan/user/question/view.html',
      controller: 'userquestionviewCtrl',
      authn: true
  })

  .state('confirmCompletion', { //首页 - 我的律团 - 用户的咨询
      url: '/confirmCompletion/:id',
      templateUrl: 'template/mylvtuan/user/question/confirm-completion.html',
      authn: true
  })

  .state('orderuser', { //首页 - 我的律团 - 用户的订单
      url: '/orderuser',
      templateUrl: 'template/mylvtuan/user/order/order-user.html',
      authn: true
  })
   .state('orderuser.all', { //用户的订单 - 全部
      url: '/all',
      cache: 'true',
      views: {
          'order-all': {
              templateUrl: 'template/mylvtuan/user/order/order-all.html',
              controller: 'userorderAllCtrl'
          }
      },
      authn: true
    })
   .state('orderuser.pending', { //用户的订单 - 待付款
      url: '/pending',
      cache: 'true',
      views: {
          'order-pending': {
              templateUrl: 'template/mylvtuan/user/order/order-pending.html',
              controller: 'userorderPendingCtrl'
          }
      },
      authn: true
    })
   .state('orderuser.new', { //用户的订单 - 待受理
      url: '/new',
      cache: 'true',
      views: {
          'order-new': {
              templateUrl: 'template/mylvtuan/user/order/order-new.html',
              controller: 'userorderNewCtrl'
          }
      },
      authn: true
    })
   .state('orderuser.replied', { //用户的订单 - 待确认
      url: '/replied',
      cache: 'true',
      views: {
          'order-replied': {
              templateUrl: 'template/mylvtuan/user/order/order-replied.html',
              controller: 'userorderRepliedCtrl'
          }
      },
      authn: true
    })
   .state('orderuser.waitforevaluation', { //用户的订单 - 待评价
      url: '/waitforevaluation',
      cache: 'true',
      views: {
          'order-waitforevaluation': {
              templateUrl: 'template/mylvtuan/user/order/order-waitforevaluation.html',
              controller: 'userorderWaitforevaluationCtrl'
          }
      },
      authn: true
    })
   .state('orderuser.complete', { //用户的订单 - 已完成
      url: '/complete',
      cache: 'true',
      views: {
          'order-complete': {
              templateUrl: 'template/mylvtuan/user/order/order-complete.html',
              controller: 'userorderCompleteCtrl'
          }
      },
      authn: true
    })

   .state('send/mind', { //用户的订单 - 订单详情
      url: '/send/mind/:id',
      templateUrl: 'template/mylvtuan/user/question/send-mind.html',
      authn: true
    })

   .state('userorderdetail', { //用户的订单 - 订单详情
      url: '/userorderdetail/:id',
      templateUrl: 'template/mylvtuan/user/order/order-detail.html',
      controller: 'userOrderDetailCtrl',
      authn: true
    })

    .state('user/wallet', { //我的律团-用户的钱包
      url: '/user/wallet',
      templateUrl: 'template/mylvtuan/user/wallet/wallet.html',
      controller: 'userwalletCtrl',
      cache: 'false', 
      authn: true
    })
    .state('user/moneyin', { //我的律团-钱包充值
      url: '/user/moneyin',
      templateUrl: 'template/mylvtuan/user/wallet/moneyin.html',
      controller: 'usermoneyinCtrl',
      cache: 'false', 
      authn: true
    })
    .state('user/record', { //我的律团-充值记录
      url: '/user/record',
      templateUrl: 'template/mylvtuan/user/wallet/record.html',
      controller: 'userrecordCtrl',
      authn: true
    })
    .state('user/moneyout', { //我的律团-充值记录
      url: '/user/moneyout',
      templateUrl: 'template/mylvtuan/user/wallet/moneyout.html',
      authn: true
    })
    .state('user/withdraw', { //我的律团-提现记录
      url: '/user/withdraw',
      templateUrl: 'template/mylvtuan/user/wallet/withdraw.html',
      controller: 'userwithdrawCtrl',
      authn: true
    })
    .state('user/payall', { //我的律团-收支明细
      url: '/user/payall',
      templateUrl: 'template/mylvtuan/user/wallet/payall.html',
      controller: 'userpayallCtrl',
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

/********************************** 小微企服 **********************************/
    .state('corporate', { //首页-小微企服
      url: '/corporate',
      templateUrl: 'template/corporate/corporateservices.html',
      controller: 'corporateservicesCtrl'
    })
    .state('corporate/list', { //首页 - 小微企服
      url: '/corporate/list/:id',
      templateUrl: 'template/corporate/list.html',
      controller: 'corporatelistCtrl',
      authn: true
    })
    .state('corporate/buynow', { //首页 - 小微企服 - 立即购买
      url: '/corporate/buynow/:id',
      templateUrl: 'template/corporate/buynow.html',
      controller: 'corporatebuynowCtrl',
      authn: true
    })
    .state('pay', { //首页 - 微信支付
      url: '/pay/:id',
      templateUrl: 'template/pay.html',
      controller: 'payCtrl',
      authn: true
    })
    .state('citypicker', { //首页 - 微信支付
      url: '/citypicker/:id',
      templateUrl: 'template/citypicker.html',
      controller: 'citypickerCtrl',
      authn: true
    })

/********************************** error **********************************/
    .state('error', { //error
      url: '/error',
      templateUrl: 'template/error.html'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/index');
});

