angular.module('lvtuanApp', ['ionic', 'app', 'templates', 'angular-jwt'])

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

  var hostPath = AppSettings.baseNewApiUrl;
  localStorage.setItem("hostPath", JSON.stringify(hostPath));
  $rootScope.hostPath = JSON.parse(localStorage.getItem('hostPath'));

  //回到首页
  $rootScope.goHome = function(){
    layer.goHome();
  }

/*  $rootScope.$on('$ionicView.beforeEnter', function() {  
    sessionStorage.setItem("goback", $location.absUrl());
  })*/

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
                // 如果用户没有权限访问
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
        console.info('unauthorized');
        sessionStorage.setItem("goback", $location.absUrl());
        layer.show('您没有权限访问这个链接！');
        $location.path('/login');
        $state.transitionTo("login");
        /*$window.location.href = '/login';*/
        //window.location.reload();
    });

    $rootScope.$on('unauthenticated', function() {
        console.info('unauthenticated');
        sessionStorage.setItem("goback", $location.absUrl());
        layer.show('请先登录！');
        // $location.path('/login');
        $state.transitionTo("login");
        localStorage.removeItem('currentUser');
        
        //localStorage.clear();
        /*$window.location.href = '/login';*/
        //window.location.reload();
    });
    
})

.config(function($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = ['jwtHelper', 'authService', '$http', 'config', '$rootScope', function(jwtHelper, authService, $http, config, $rootScope) {
    // Skip authentication for any requests ending in .html
    if (config.url.substr(config.url.length - 5) == '.html') {
      return null;
    }

    var token = authService.getToken();
    if (token) {
      if (jwtHelper.isTokenExpired(token)) {
        console.info("refreshing the token : " + token);
        // This is a promise of a JWT token
        return $http({
          url: 'http://' + AppSettings.baseApiUrl + '/refresh_token',
          skipAuthorization: true,
          method: 'POST',
          headers: {
            'Authorization': 'bearer ' + token
          }
        }).then(
          function(response) {
            console.info('2 response: ', response);
            var token = response.data.data.token;
            authService.saveToken(token);
            return token;
          }, 
          function(reason) {
            sessionStorage.setItem("goback", $location.absUrl());
            $rootScope.$broadcast('unauthenticated');
          }
        );
      } else {
        console.info("returning the token : " + token);
        return token;
      }
    }
  }];

  $httpProvider.interceptors.push('jwtInterceptor');
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

    .state('boundphone', { //绑定手机
      url: '/boundphone',
      cache: 'true',
      templateUrl: 'template/home/boundphone.html'
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

    .state('group/attention/search', { //律圈 关注 搜索
      url: '/group/attention/search',
      templateUrl: 'template/group/attention-search.html',
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

    .state('groupcreate', { //创建律圈
      url: '/groupcreate',
      templateUrl: 'template/group/create.html',
      controller: 'groupcreateCtrl',
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
    .state('group/add', { //律圈添加成员
      url: '/group/add/:id',
      templateUrl: 'template/group/group-add.html',
      controller: 'groupaddCtrl',
      authn: true,
      authz: 'lawyer'
    })
    .state('group/del', { //律圈删除成员
      url: '/group/del/:id',
      templateUrl: 'template/group/group-del.html',
      controller:'groupdelCtrl',
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

    .state('knowledge/view', { //给安卓用的文章-详情页面
        url: '/knowledge/view/:id',
        cache: 'true',
        templateUrl: 'template/knowledge/knowledges-android-view.html',
        controller: 'knowledgeAndroidViewCtrl'
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
      controller: 'centerCtrl'
    })
    .state('info', { //用户-个人资料
      url: '/info/:id',
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
    .state('one-questions', { //一对一咨询
      url: '/one-questions',
      cache: 'true',
      templateUrl: 'template/lawyer/one_questions.html',
      controller: 'lawyerOneQuestionsCtrl'
    })

    .state('all-evaluate', { //律师对咨询的所有评价
      url: '/all-evaluate',
      cache: 'true',
      templateUrl: 'template/lawyer/all_evaluate.html',
      controller: 'lawyerAllEvaluateCtrl'
    })

    .state('lawyer-all-evaluate', { //用户对某一个律师的所有评价
      url: '/lawyer-all-evaluate/:id',
      cache: 'true',
      templateUrl: 'template/lawyer/lawyer_all_evaluate.html',
      controller: 'lawyerOneAllEvaluateCtrl'
    })

    .state('lawyer/list', { //找律师列表
      url: '/lawyer/list/:type',
      cache: 'true',
      templateUrl: 'template/lawyer/lawyer_list.html',
      controller: 'lawyerlistCtrl'
    })

    .state('lawyer-list/search', { //找律师列表
      url: '/lawyer-list/search/:type',
      cache: 'true',
      templateUrl: 'template/lawyer/lawyer_list_search.html'
    })
    
    .state('lawyer/view', { //律师个人主页
      url: '/lawyer/view/:id',
      cache: 'true',
      templateUrl: 'template/lawyer/view.html',
      controller: 'lawyerViewCtrl'
    })

    .state('graphic', { //图文咨询
      url: '/graphic/:type?id',
      cache: 'true',
      templateUrl: 'template/lawyer/graphic.html'
    })

     //律师 - 个人主页 - 发表文章
  .state('lawyer/article', { //律师 - 发表文章
      url: '/lawyer/article',
      templateUrl: 'template/lawyer/article.html'
  })
  .state('lawyer/article.like', { //发表文章 - 点赞最多
      url: '/like',
      views: {
          'article-like-most': {
              templateUrl: 'template/lawyer/article_like_most.html',
              controller: 'lawyerArticleLikeMostCtrl'
          }
      }
  })
  .state('lawyer/article.lately', { //发表文章 - 最近发布
      url: '/lately',
      views: {
          'article-lately-editing': {
              templateUrl: 'template/lawyer/article_lately_editing.html',
              controller: 'lawyerArticleLatelyEditingCtrl'
          }
      }
  })
    
/********************************** 问律师 **********************************/
    .state('questions', { //问律师
      url: '/questions',
      cache: 'false', 
      templateUrl: 'template/questions/questions.html',
      authn: false
    })
    .state('questionslist', { //问律师列表
      url: '/questionslist',
      templateUrl: 'template/questions/questions_list.html',
      controller: 'questionslistCtrl',
      authn: false
    })
    .state('question/list/search', { //问律师列表
      cache: 'true', 
      url: '/question/list/search',
      templateUrl: 'template/questions/questions_list_search.html',
      authn: false
    })
    
    .state('questionsview', { //问律师详情
      cache: 'true', 
      url: '/questionsview/:id',
      templateUrl: 'template/questions/view.html',
      controller: 'questionsviewsCtrl',
      authn: false
    })

    .state('questions/comment', { //发布回答
      cache: 'true', 
      url: '/questions/comment/:id',
      templateUrl: 'template/questions/comment.html',
      authn: false
    })

    .state('questions/areward', { //打赏
      url: '/questions/areward/:id',
      templateUrl: 'template/questions/areward.html',
      controller: 'questionsArewardCtrl',
      authn: true
    })

    .state('questions/order/pay', { //订单支付
      url: '/questions/order/pay/:id',
      templateUrl: 'template/questions/order_pay.html',
      controller: 'questionsOrderPpayCtrl',
      authn: true
    })
    .state('questions/areward/pay', { //订单支付
      url: '/questions/areward/pay/:id?lawyer_id',
      templateUrl: 'template/questions/areward_pay.html',
      controller: 'questionsArewardPayCtrl',
      authn: true
    })

    

/*———————————————————————————— 我的律团- 我的订单 -公用 ————————————————————————————*/
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

  //用户 - 我的 - 咨询管理
  .state('user/question/list', { //用户 - 咨询管理
      url: '/user/question/list',
      templateUrl: 'template/mylvtuan/user/question_list.html',
      controller: 'userQuestionListCtrl',
      authn: true
  })

  //用户 - 我的 - 订单管理
  .state('user/order/list', { //用户 - 订单管理
      url: '/user/order/list',
      templateUrl: 'template/mylvtuan/user/order_list.html',
      controller: 'userOrderListCtrl',
      authn: true
  })
  //用户 - 我的 - 订单详情
  .state('user/order/view', { //用户 - 订单详情
      url: '/user/order/view/:id',
      templateUrl: 'template/mylvtuan/user/order_view.html',
      controller: 'userOrderViewCtrl',
      authn: true
  })
  //用户 - 我的 - 聊天记录
   .state('easemob/view', { 
      url: '/easemob/view/:id',
      templateUrl: 'template/mylvtuan/user/easemob_view.html',
      controller: 'userEasemobViewCtrl',
      authn: true
  })
  //用户 - 我的 - 用户的评价
  .state('confirmCompletion', { 
      url: '/confirmCompletion/:id',
      templateUrl: 'template/mylvtuan/user/confirm-completion.html',
      authn: true
  })

  //律师 - 我的 - 咨询管理
  .state('lawyer/question', { //律师 - 咨询管理
      url: '/lawyer/question',
      templateUrl: 'template/mylvtuan/lawyer/question.html',
      authn: true
  })
  .state('lawyer/question.not', { //咨询管理 - 未参与
      url: '/not',
      views: {
          'lawyer-question-not': {
              templateUrl: 'template/mylvtuan/lawyer/not.html',
              controller: 'lawyerQuestionNotCtrl'
          }
      },
      authn: true
  })
  .state('lawyer/question.already', { //咨询管理 - 已参与
      url: '/already',
      views: {
          'lawyer-question-already': {
              templateUrl: 'template/mylvtuan/lawyer/already.html',
              controller: 'lawyerQuestionAlreadyCtrl'
          }
      },
      authn: true
  })
  //律师 - 我的 - 订单管理
  .state('lawyer/order/list', { //律师 - 订单管理
      url: '/lawyer/order/list',
      templateUrl: 'template/mylvtuan/lawyer/order_list.html',
      controller: 'lawyerOrderListCtrl',
      authn: true
  })
  //律师 - 我的 - 订单详情
  .state('lawyer/order/view', { //律师 - 订单详情
      url: '/lawyer/order/view/:id',
      templateUrl: 'template/mylvtuan/lawyer/order_view.html',
      controller: 'lawyerOrderViewCtrl',
      authn: true
  })
  //律师 - 我的 - 评价详情
  .state('/lawyer/comment/', { //我的订单 - 评价详情
    url: '/lawyer/comment/:id',
    templateUrl: 'template/mylvtuan/lawyer/comment.html',
    controller: 'lawyerCommentCtrl',
    authn: true
  })



  //首页 - 我的 - 法律顾问
  .state('question/paycompany', { //首页 - 我的 - 法律顾问
      url: '/question/paycompany',
      templateUrl: 'template/mylvtuan/question/paycompany/question.html',
      authn: true
  })
  .state('question/paycompany.new', { //法律顾问 - 待受理
      url: '/new',
      views: {
          'question-paycompany-new': {
              templateUrl: 'template/mylvtuan/question/paycompany/new.html',
              controller: 'questionPaycompanyNewCtrl'
          }
      },
      authn: true
  })
  .state('question/paycompany.waitforconfirmation', { //法律顾问 - 待确认
      url: '/waitforconfirmation',
      views: {
          'question-paycompany-waitforconfirmation': {
              templateUrl: 'template/mylvtuan/question/paycompany/waitforconfirmation.html',
              controller: 'questionPaycompanyWaitforconfirmationCtrl'
          }
      },
      authn: true
  })
  .state('question/paycompany.waitforevaluation', { //法律顾问 - 待评价
      url: '/waitforevaluation',
      views: {
          'question-paycompany-waitforevaluation': {
              templateUrl: 'template/mylvtuan/question/paycompany/waitforevaluation.html',
              controller: 'questionPaycompanyWaitforevaluationCtrl'
          }
      },
      authn: true
    })
   .state('question/paycompany.complete', { //法律顾问 - 已完成
      url: '/complete',
      views: {
          'question-paycompany-complete': {
              templateUrl: 'template/mylvtuan/question/paycompany/complete.html',
              controller: 'questionPaycompanyCompleteCtrl'
          }
      },
      authn: true
    })
  
  .state('question/paycompany.cancelled', { //法律顾问 - 已取消
      url: '/cancelled',
      views: {
          'question-paycompany-cancelled': {
              templateUrl: 'template/mylvtuan/question/paycompany/cancelled.html',
              controller: 'questionPaycompanyCancelledCtrl'
          }
      },
      authn: true
  })
  .state('question/pay_company/view', { //法律顾问 - 咨询详情
      url: '/question/pay_company/view/:id',
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

  .state('wallet', { //我的律团-用户的钱包
    url: '/wallet',
    templateUrl: 'template/mylvtuan/wallet/wallet.html',
    controller: 'userwalletCtrl',
    authn: true
  })

  // 注意：不要更改支付相关的url, 因为 /wallet 已经在微信公众号上面配置为支付授权目录
  .state('moneyin', { //我的律团-钱包充值
    url: '/pay/moneyin',
    templateUrl: 'template/mylvtuan/wallet/moneyin.html',
    controller: 'usermoneyinCtrl',
    authn: true
  })
  .state('moneyout', { //我的律团-提现
    url: '/pay/moneyout',
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

