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
.run(['$rootScope','$timeout','$location','$ionicLoading',function($rootScope,$timeout,$location,$ionicLoading){
  
 /*$timeout(function() {
      localStorage.removeItem('is_lawyer');
  }, 600);*/
  $rootScope.token = localStorage.getItem('token');
  $rootScope.user_id = localStorage.getItem('user_id');
  $rootScope.user_group_id = localStorage.getItem('user_group_id');
  $rootScope.is_verified = localStorage.getItem('is_verified');

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
  $rootScope.goHome = function(){
    layer.goHome();
  }

}])




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
      controller: 'groupCtrl'
    })

    .state('group.list', { //圈子 - 列表
      url: '/list',
      cache: 'true',
      views: {
          'group-list': {
              templateUrl: 'template/group/group-list.html',
              controller: 'groupListCtrl'
          }
      }
    })
   .state('group.televise', { //圈子 - 广播
      url: '/televise',
      cache: 'true',
      views: {
          'group-televise': {
              templateUrl: 'template/group/group-televise.html',
              controller: 'groupTeleviseCtrl'
          }
      }
    })
    .state('group.attention', { //圈子 - 关注
      url: '/attention',
      cache: 'true',
      views: {
          'group-attention': {
              templateUrl: 'template/group/group-attention.html',
              controller: 'groupAttentionCtrl'
          }
      }
    })

    .state('groupview', { //圈子详情
      url: '/group/view/:id',
      templateUrl: 'template/group/group_view.html',
      controller: 'groupviewCtrl'
    })
    .state('broadcast/view', { //广播详情
      url: '/broadcast/view/:id',
      templateUrl: 'template/group/broadcast_view.html',
      controller: 'broadcastviewCtrl'
    })

    .state('groupcreate', { //创建圈子
      url: '/groupcreate',
      templateUrl: 'template/group/create.html',
      controller: 'groupcreateCtrl'
    })

    .state('televisecreate', { //创建广播
      url: '/televisecreate',
      templateUrl: 'template/group/televisecreate.html',
      controller: 'televisecreateCtrl'
    })
    
    .state('group/site', { //圈子设置
      url: '/group/site/:id',
      templateUrl: 'template/group/group-site.html',
      controller: 'groupsiteCtrl'
    })
    .state('group/add', { //圈子设置
      url: '/group/add/:id',
      templateUrl: 'template/group/group-add.html',
      controller: 'groupaddCtrl'
    })
    
    

/********************************** 知识 **********************************/
    .state('knowledge', { //知识
      url: '/knowledge',
     /* abstract:true,*/
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
    .state('knowknowledgesview', { //法规-详情
        url: '/knowknowledgesview/:id',
        cache: 'true',
        templateUrl: 'template/knowledge/knowledges-view.html',
        controller: 'knowKnowledgesCtrl'
    })
    .state('knowdocumentsview', { //文库-详情
        url: '/knowdocumentsview/:id',
        cache: 'true',
        templateUrl: 'template/knowledge/documents-view.html',
        controller: 'knowDocumentsCtrl'
    })
    .state('knowcasesview', { //案列-详情
        url: '/knowcasesview/:id',
        cache: 'true',
        templateUrl: 'template/knowledge/cases-view.html',
        controller: 'knowCasesCtrl'
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
      url: '/info',
      cache: 'true',
      templateUrl: 'template/center/info.html',
      controller: 'infoCtrl'
    })
    .state('comment', { //用户-我的评论
      url: '/comment',
      cache: 'true',
      templateUrl: 'template/center/comment.html',
      controller: 'commentCtrl'
    })
    .state('followed', { //用户-我的关注
      url: '/followed',
      cache: 'true',
      templateUrl: 'template/center/followed.html',
      controller: 'followedCtrl'
    })
    .state('becomelawyer', { //用户-认证为律师
      url: '/becomelawyer',
      cache: 'true',
      templateUrl: 'template/center/become_lawyer.html',
      controller: 'becomelawyerCtrl'
    })
/*———————————————————————————— 律师的个人中心 ————————————————————————————*/
    .state('followed_lawyer', { //律师-我的关注
      url: '/followed_lawyer',
      cache: 'true',
      templateUrl: 'template/center/lawyer/followed.html',
      controller: 'followedlaywerCtrl'
    })
    .state('comment_lawyer', { //律师-我的评论
      url: '/comment_lawyer/:id',
      cache:'false',
      templateUrl: 'template/center/lawyer/comment.html',
      controller: 'commentlaywerCtrl'
    })
    .state('article_lawyer', { //律师-我的文章
      url: '/article_lawyer',
      templateUrl: 'template/center/lawyer/article.html'
    })
   .state('article_lawyer.case', { //律师 - 案例分析
      url: '/case/:class',
      views: {
          'article-case': {
              templateUrl: 'template/center/lawyer/article-case.html',
              controller: 'caselaywerCtrl'
          }
      }
    })
   .state('article_lawyer.advisory', { //律师 - 咨询
      url: '/advisory/:class',
      views: {
          'article-advisory': {
              templateUrl: 'template/center/lawyer/article-advisory.html',
              controller: 'caselaywerCtrl'
          }
      }
    })
   .state('article_lawyer.lknowledge', { //律师 - 知识
      url: '/lknowledge/:class',
      views: {
          'article-lknowledge': {
              templateUrl: 'template/center/lawyer/article-lknowledge.html',
              controller: 'caselaywerCtrl'
          }
      }
    })

    .state('/lawyer/article/view', { //律师-我的文章 - 文章详情
      url: '/lawyer/article/view/:id',
      templateUrl: 'template/center/lawyer/view.html',
      controller: 'viewarticlelawyerCtrl'
    })

/*———————————————————————————— 个人中心公用 ————————————————————————————*/
    .state('about', { //关于律团
      url: '/about',
      cache: 'true',
      templateUrl: 'template/center/about.html',
      controller: 'aboutCtrl'
    })
    .state('site', { //设置
      url: '/site',
      cache: 'true',
      templateUrl: 'template/center/site.html',
      controller: 'siteCtrl'
    })
    .state('listscores', { //我的积分
      url: '/listscores',
      cache: 'true',
      templateUrl: 'template/center/list_scores.html',
      controller: 'listscoresCtrl'
    })
    .state('collect', { //我的收藏
      url: '/collect',
      cache: 'true',
      templateUrl: 'template/center/collect.html',
      controller: 'collectCtrl'
    })
    .state('messages', { //我的消息
      url: '/messages',
      cache: 'true',
      templateUrl: 'template/center/messages.html',
      controller: 'messagesCtrl'
    })
    .state('message_details', { //我的消息-消息详情
      url: '/message/:id',
      cache: 'true',
      templateUrl: 'template/center/message_view.html',
      controller: 'viewMessageCtrl'
    })

/********************************** 找律师 **********************************/
    .state('lawyerlist', { //找律师列表
      url: '/lawyerlist',
      cache: 'true',
      templateUrl: 'template/lawyer/lawyer_list.html',
      controller: 'lawyerlistCtrl'
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
      templateUrl: 'template/lawyer/graphic.html'
    })
    .state('special', { //专业咨询
      url: '/special',
      cache: 'true',
      templateUrl: 'template/lawyer/special.html',
      controller: 'specialCtrl'
    })
    
/********************************** 问律师 **********************************/
    .state('questions', { //问律师
      url: '/questions',
      cache: 'true', 
      templateUrl: 'template/questions/questions.html',
      controller: 'questionsCtrl'
    })
    .state('questionslist', { //问律师列表
      cache: 'true', 
      url: '/questionslist',
      templateUrl: 'template/questions/questions_list.html',
      controller: 'questionslistCtrl'
    })
    .state('questionsview', { //问律师详情
      cache: 'true', 
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
      controller: 'workbenchLawyerCtrl'
    })
    .state('orderlawyer', { //首页 - 我的律团 - 律师的工作
      url: '/orderlawyer',
      templateUrl: 'template/mylvtuan/lawyer/order/order-lawyer.html'
    })
   .state('orderlawyer.all', { //律师订单 - 全部
      url: '/all',
      cache: 'true',
      views: {
          'order-all': {
              templateUrl: 'template/mylvtuan/lawyer/order/order-all.html',
              controller: 'orderAllCtrl'
          }
      }
    })
   .state('orderlawyer.new', { //律师订单 - 待受理
      url: '/new',
      cache: 'true',
      views: {
          'order-new': {
              templateUrl: 'template/mylvtuan/lawyer/order/order-new.html',
              controller: 'orderNewCtrl'
          }
      }
    })
   .state('orderlawyer.replied', { //律师订单 - 待确认
      url: '/replied',
      cache: 'true',
      views: {
          'order-replied': {
              templateUrl: 'template/mylvtuan/lawyer/order/order-replied.html',
              controller: 'orderRepliedCtrl'
          }
      }
    })
   .state('orderlawyer.complete', { //律师订单 - 已完成
      url: '/complete',
      cache: 'true',
      views: {
          'order-complete': {
              templateUrl: 'template/mylvtuan/lawyer/order/order-complete.html',
              controller: 'orderCompleteCtrl'
          }
      }
    })
   .state('orderlawyerdetail', { //律师订单 - 订单详情
      url: '/orderlawyerdetail/:id',
      templateUrl: 'template/mylvtuan/lawyer/order/order-detail.html',
      controller: 'orderlawyerDetailCtrl'
    })
    .state('/lawyer/order/comment', { //律师订单-我的订单 - 评价详情
      url: '/lawyer/order/comment/:id',
      templateUrl: 'template/mylvtuan/lawyer/order/comment.html',
      controller: 'commentorderlawyerCtrl'
    })

   .state('lawyerquestion', { //首页 - 我的律团 - 律师的咨询
      url: '/lawyerquestion',
      templateUrl: 'template/mylvtuan/lawyer/question/question.html'
    })
  .state('lawyerquestion.new', { //律师的咨询 - 待受理
      url: '/new',
      cache: 'true',
      views: {
          'question-new': {
              templateUrl: 'template/mylvtuan/lawyer/question/new.html',
              controller: 'lawyerquestionNewCtrl'
          }
      }
    })
  .state('lawyerquestion.replied', { //律师的咨询 - 待确认
      url: '/replied',
      cache: 'true',
      views: {
          'question-replied': {
              templateUrl: 'template/mylvtuan/lawyer/question/replied.html',
              controller: 'lawyerquestionRepliedCtrl'
          }
      }
    })
  .state('lawyerquestion.complete', { //律师的咨询 - 待评价
      url: '/complete',
      cache: 'true',
      views: {
          'question-complete': {
              templateUrl: 'template/mylvtuan/lawyer/question/complete.html',
              controller: 'lawyerquestionCompleteCtrl'
          }
      }
    })
  
  .state('lawyer/questions/view', { // 律师的工作台 - 咨询详情
    url: '/lawyer/questions/view/:id',
    cache: 'true', 
    templateUrl: 'template/mylvtuan/lawyer/question/view.html',
    controller: 'lawyerquestionsviewCtrl'
  })

  .state('queryrefer', { // 律师的工作台 - 咨询参考
    url: '/queryrefer',
    cache: 'true', 
    templateUrl: 'template/mylvtuan/lawyer/queryrefer.html'
  })
  .state('queryreferdetail', { //律师的工作台 - 咨询参考详情
    url: '/queryreferdetail',
    cache: 'true', 
    templateUrl: 'template/mylvtuan/lawyer/queryrefer-detail.html'
  })
  
/*———————————————————————————— 我的律团- 用户 -公用 ————————————————————————————*/
  .state('userlvtuan', { //首页 - 我的律团 - 用户的工作台
    url: '/userlvtuan',
    cache: 'true', 
    templateUrl: 'template/mylvtuan/user/userlvtuan.html',
    controller: 'userlvtuanCtrl'
  })
  .state('userquestion', { //首页 - 我的律团 - 用户的咨询
    url: '/userquestion',
    templateUrl: 'template/mylvtuan/user/question/question.html'
  })
  .state('userquestion.new', { //用户的咨询 - 待受理
    url: '/new',
    cache: 'true',
    views: {
        'question-new': {
            templateUrl: 'template/mylvtuan/user/question/new.html',
            controller: 'questionNewCtrl'
        }
    }
  })
  .state('userquestion.all', { //用户的咨询 - 全部
    url: '/all',
    cache: 'true',
    views: {
        'question-all': {
            templateUrl: 'template/mylvtuan/user/question/all.html',
            controller: 'questionAllCtrl'
        }
    }
  })
  .state('userquestion.replied', { //用户的咨询 - 处理中
    url: '/replied',
    cache: 'true',
    views: {
        'question-replied': {
            templateUrl: 'template/mylvtuan/user/question/replied.html',
            controller: 'questionRepliedCtrl'
        }
    }
  })
  .state('userquestion.waitforconfirmation', { //用户的咨询 - 待确认
    url: '/waitforconfirmation',
    cache: 'true',
    views: {
        'question-waitforconfirmation': {
            templateUrl: 'template/mylvtuan/user/question/waitforconfirmation.html',
            controller: 'questionWaitforconfirmationCtrl'
        }
    }
  })

  .state('user/question/view', { //首页 - 我的律团 - 用户的咨询
    url: 'user/question/view/:id',
    templateUrl: 'template/mylvtuan/user/question/view.html',
    controller: 'userquestionviewCtr'
  })

  .state('confirmCompletion', { //首页 - 我的律团 - 用户的咨询
    url: '/confirmCompletion/:id',
    templateUrl: 'template/mylvtuan/user/question/confirm-completion.html'
  })

  .state('orderuser', { //首页 - 我的律团 - 用户的订单
      url: '/orderuser',
      templateUrl: 'template/mylvtuan/user/order/order-user.html'
    })
   .state('orderuser.all', { //用户的订单 - 全部
      url: '/all',
      cache: 'true',
      views: {
          'order-all': {
              templateUrl: 'template/mylvtuan/user/order/order-all.html',
              controller: 'userorderAllCtrl'
          }
      }
    })
   .state('orderuser.pending', { //用户的订单 - 待付款
      url: '/pending',
      cache: 'true',
      views: {
          'order-pending': {
              templateUrl: 'template/mylvtuan/user/order/order-pending.html',
              controller: 'userorderPendingCtrl'
          }
      }
    })
   .state('orderuser.new', { //用户的订单 - 待受理
      url: '/new',
      cache: 'true',
      views: {
          'order-new': {
              templateUrl: 'template/mylvtuan/user/order/order-new.html',
              controller: 'userorderNewCtrl'
          }
      }
    })
   .state('orderuser.replied', { //用户的订单 - 待确认
      url: '/replied',
      cache: 'true',
      views: {
          'order-replied': {
              templateUrl: 'template/mylvtuan/user/order/order-replied.html',
              controller: 'userorderRepliedCtrl'
          }
      }
    })
   .state('orderuser.waitforevaluation', { //用户的订单 - 待评价
      url: '/waitforevaluation',
      cache: 'true',
      views: {
          'order-waitforevaluation': {
              templateUrl: 'template/mylvtuan/user/order/order-waitforevaluation.html',
              controller: 'userorderWaitforevaluationCtrl'
          }
      }
    })
   .state('orderuser.complete', { //用户的订单 - 已完成
      url: '/complete',
      cache: 'true',
      views: {
          'order-complete': {
              templateUrl: 'template/mylvtuan/user/order/order-complete.html',
              controller: 'userorderCompleteCtrl'
          }
      }
    })

   .state('send/mind', { //用户的订单 - 订单详情
      url: '/send/mind/:id',
      templateUrl: 'template/mylvtuan/user/question/send-mind.html'
    })

   .state('userorderdetail', { //用户的订单 - 订单详情
      url: '/userorderdetail/:id',
      templateUrl: 'template/mylvtuan/user/order/order-detail.html',
      controller: 'userOrderDetailCtrl'
    })

    .state('user/wallet', { //我的律团-用户的钱包
      url: '/user/wallet',
      templateUrl: 'template/mylvtuan/user/wallet/wallet.html',
      controller: 'userwalletCtrl'
    })
    .state('user/moneyin', { //我的律团-钱包充值
      url: '/user/moneyin',
      templateUrl: 'template/mylvtuan/user/wallet/moneyin.html',
      controller: 'usermoneyinCtrl'
    })
    .state('user/record', { //我的律团-充值记录
      url: '/user/record',
      templateUrl: 'template/mylvtuan/user/wallet/record.html',
      controller: 'userrecordCtrl'
    })
    .state('user/moneyout', { //我的律团-充值记录
      url: '/user/moneyout',
      templateUrl: 'template/mylvtuan/user/wallet/moneyout.html'
    })
    .state('user/withdraw', { //我的律团-提现记录
      url: '/user/withdraw',
      templateUrl: 'template/mylvtuan/user/wallet/withdraw.html',
      controller: 'userwithdrawCtrl'
    })
    .state('user/payall', { //我的律团-收支明细
      url: '/user/payall',
      templateUrl: 'template/mylvtuan/user/wallet/payall.html',
      controller: 'userpayallCtrl'
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
      controller: 'corporatelistCtrl'
    })
    .state('corporate/buynow', { //首页 - 小微企服 - 立即购买
      url: '/corporate/buynow/:id',
      templateUrl: 'template/corporate/buynow.html',
      controller: 'corporatebuynowCtrl'
    })

    .state('pay', { //首页 - 微信支付
      url: '/pay/:id',
      templateUrl: 'template/pay.html',
      controller: 'payCtrl'
    })

/********************************** error **********************************/
    .state('error', { //error
      url: '/error',
      templateUrl: 'template/error.html'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/index');
});
