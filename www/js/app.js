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
  
 /*$timeout(function() {
      localStorage.removeItem('is_lawyer');
  }, 600);*/
  $rootScope.token = localStorage.getItem('token');
  $rootScope.user_id = localStorage.getItem('user_id');

  $rootScope.user_group_id = JSON.parse(localStorage.getItem('user_group_id'));
  $rootScope.is_verified = JSON.parse(localStorage.getItem('is_verified'));

  //localStorage.removeItem('is_lawyer');
  var hostName = $location.host();
  // if (hostName == '192.168.1.116') {
  //   hostName = hostName + ":81";
  // } else {
    hostName = '192.168.1.43';
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
      cache:'false', 
      templateUrl: 'views/home.html',
      controller:'ionicNavBarDelegateCtrl'
    })

    .state('index', { //首页
      url: '/index',
      cache:'false', 
      templateUrl: 'template/index_tpl.html',
      controller: 'indexCtrl'
    })

    .state('mylvteam', { //我的律师团
      url: '/mylvteam',
      cache:'false', 
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
      cache:'false',
      templateUrl: 'template/home/resetpwd.html',
      controller: 'resetpwdCtrl'
    })

/********************************** 圈子 **********************************/
    .state('group', { //圈子
      url: '/group',
      cache:'false',
      /*abstract:true,*/
      templateUrl: 'template/group/group.html',
      controller: 'groupCtrl'
    })

    .state('group.list', { //圈子 - 列表
      url: '/list',
      cache:'false',
      views: {
          'group-list': {
              templateUrl: 'template/group/group-list.html',
              controller: 'groupListCtrl'
          }
      }
    })
   .state('group.televise', { //圈子 - 广播
      url: '/televise',
      cache:'false',
      views: {
          'group-televise': {
              templateUrl: 'template/group/group-televise.html',
              controller: 'groupTeleviseCtrl'
          }
      }
    })
    .state('group.attention', { //圈子 - 关注
      url: '/attention',
      cache:'false',
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
    .state('broadcastview', { //广播详情
      url: '/broadcastview/:id',
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
    

    

/********************************** 知识 **********************************/
    .state('knowledge', { //知识
      url: '/knowledge',
     /* abstract:true,*/
      templateUrl: 'template/knowledge/knowledge.html'
    }) 
   .state('knowledge.knowledges', { //法规
      url: '/knowledges',
      cache:'false',
      views: {
          'knowledge-knowledges': {
              templateUrl: 'template/knowledge/knowledge-knowledges.html',
              controller: 'knowledgesCtrl'
          }
      }
    })
   .state('knowledge.documents', { //文库
      url: '/documents',
      cache:'false',
      views: {
          'knowledge-documents': {
              templateUrl: 'template/knowledge/knowledge-documents.html',
              controller: 'documentsCtrl'
          }
      }
    })
   .state('knowledge.cases', { //案列
      url: '/cases',
      cache:'false',
      views: {
          'knowledge-cases': {
              templateUrl: 'template/knowledge/knowledge-cases.html',
              controller: 'casesCtrl'
          }
      }
    })
    .state('knowknowledgesview', { //法规-详情
        url: '/knowknowledgesview/:id',
        cache:'false',
        templateUrl: 'template/knowledge/knowledges-view.html',
        controller: 'knowKnowledgesCtrl'
    })
    .state('knowdocumentsview', { //文库-详情
        url: '/knowdocumentsview/:id',
        cache:'false',
        templateUrl: 'template/knowledge/documents-view.html',
        controller: 'knowDocumentsCtrl'
    })
    .state('knowcasesview', { //案列-详情
        url: '/knowcasesview/:id',
        cache:'false',
        templateUrl: 'template/knowledge/cases-view.html',
        controller: 'knowCasesCtrl'
    })

/********************************** 我的 **********************************/
/*———————————————————————————— 用户的个人中心 ————————————————————————————*/
    .state('center', { //用户-我的
      url: '/center',
      cache:'false',
      templateUrl: 'template/center/center.html',
      controller: 'centerCtrl'
    })
    .state('info', { //用户-个人资料
      url: '/info',
      cache:'false',
      templateUrl: 'template/center/info.html',
      controller: 'infoCtrl'
    })
    .state('listscores', { //用户-我的积分
      url: '/listscores',
      cache:'false',
      templateUrl: 'template/center/list_scores.html',
      controller: 'listscoresCtrl'
    })
    .state('collect', { //用户-我的收藏
      url: '/collect',
      cache:'false',
      templateUrl: 'template/center/collect.html',
      controller: 'collectCtrl'
    })
    .state('comment', { //用户-我的评论
      url: '/comment',
      cache:'false',
      templateUrl: 'template/center/comment.html',
      controller: 'commentCtrl'
    })
    .state('messages', { //用户-我的消息
      url: '/messages',
      cache:'false',
      templateUrl: 'template/center/messages.html',
      controller: 'messagesCtrl'
    })
    .state('followed', { //用户-我的关注
      url: '/followed',
      cache:'false',
      templateUrl: 'template/center/followed.html',
      controller: 'followedCtrl'
    })
    .state('becomelawyer', { //用户-认证为律师
      url: '/becomelawyer',
      cache:'false',
      templateUrl: 'template/center/become_lawyer.html',
      controller: 'becomelawyerCtrl'
    })
/*———————————————————————————— 律师的个人中心 ————————————————————————————*/
    .state('infolawyer', { //律师-个人资料
      url: '/infolawyer',
      cache:'false',
      templateUrl: 'template/center/info.html',
      controller: 'infolawyerCtrl'
    })
    .state('followed_lawyer', { //律师-我的关注
      url: '/followed_lawyer',
      cache:'false',
      templateUrl: 'template/center/lawyer/followed.html',
      controller: 'followedlaywerCtrl'
    })
    .state('listscores_lawyer', { //律师-我的积分
      url: '/listscores_lawyer',
      cache:'false',
      templateUrl: 'template/center/lawyer/list_scores.html',
      controller: 'listscoreslaywerCtrl'
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
      url: '/case/:id',
      views: {
          'article-case': {
              templateUrl: 'template/center/lawyer/article-case.html',
              controller: 'caselaywerCtrl'
          }
      }
    })
   .state('article_lawyer.advisory', { //律师 - 咨询
      url: '/advisory/:id',
      views: {
          'article-advisory': {
              templateUrl: 'template/center/lawyer/article-advisory.html',
              controller: 'caselaywerCtrl'
          }
      }
    })
   .state('article_lawyer.lknowledge', { //律师 - 知识
      url: '/lknowledge/:id',
      views: {
          'article-lknowledge': {
              templateUrl: 'template/center/lawyer/article-lknowledge.html',
              controller: 'caselaywerCtrl'
          }
      }
    })

    .state('/lawyer/article/view/', { //律师-我的文章 - 文章详情
      url: '/lawyer/article/view/:id',
      templateUrl: 'template/center/lawyer/view.html',
      controller: 'viewarticlelawyerCtrl'
    })

    .state('messages_lawyer', { //律师-我的消息
      url: '/messages_lawyer',
      cache:'false',
      templateUrl: 'template/center/lawyer/messages.html',
      controller: 'messageslaywerCtrl'
    })

/*———————————————————————————— 个人中心公用 ————————————————————————————*/
    .state('about', { //关于律团
      url: '/about',
      cache:'false',
      templateUrl: 'template/center/about.html',
      controller: 'aboutCtrl'
    })
    .state('site', { //设置
      url: '/site',
      cache:'false',
      templateUrl: 'template/center/site.html',
      controller: 'siteCtrl'
    })

    

/********************************** 找律师 **********************************/
    .state('lawyerlist', { //找律师列表
      url: '/lawyerlist',
      cache:'false',
      templateUrl: 'template/lawyer/lawyer_list.html',
      controller: 'lawyerlistCtrl'
    })
    .state('lawyer', { //律师个人主页
      url: '/lawyer/:id',
      cache:'false',
      templateUrl: 'template/lawyer/view.html',
      controller: 'viewCtrl'
    })

    .state('graphic', { //图文咨询
      url: '/graphic',
      cache:'false',
      templateUrl: 'template/lawyer/graphic.html',
      controller: 'graphicCtrl'
    })
    .state('special', { //专业咨询
      url: '/special',
      cache:'false',
      templateUrl: 'template/lawyer/special.html',
      controller: 'specialCtrl'
    })
    
/********************************** 问律师 **********************************/
    .state('questions', { //问律师
      url: '/questions',
      cache:'false', 
      templateUrl: 'template/questions/questions.html',
      controller: 'questionsCtrl'
    })
    .state('questionslist', { //问律师列表
      cache:'false', 
      url: '/questionslist',
      templateUrl: 'template/questions/questions_list.html',
      controller: 'questionslistCtrl'
    })
    .state('questionsview', { //问律师详情
      cache:'false', 
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

/********************************** 我的律团 **********************************/
/*———————————————————————————— 我的律团- 律师 -公用 ————————————————————————————*/
/*    .state('lawyerlvtuan', { //首页 - 我的律团 - 律师的工作台
      url: '/lawyerlvtuan',
      cache:'false', 
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
      cache:'false',
      views: {
          'order-all': {
              templateUrl: 'template/mylvtuan/lawyer/order/order-all.html',
              controller: 'orderAllCtrl'
          }
      }
    })
   .state('orderlawyer.pending', { //律师订单 - 待受理
      url: '/pending',
      cache:'false',
      views: {
          'order-pending': {
              templateUrl: 'template/mylvtuan/lawyer/order/order-pending.html',
              controller: 'orderPendingCtrl'
          }
      }
    })
   .state('orderlawyer.replied', { //律师订单 - 待确认
      url: '/replied',
      cache:'false',
      views: {
          'order-replied': {
              templateUrl: 'template/mylvtuan/lawyer/order/order-replied.html',
              controller: 'orderRepliedCtrl'
          }
      }
    })
   .state('orderlawyer.completed', { //律师订单 - 已完成
      url: '/completed',
      cache:'false',
      views: {
          'order-completed': {
              templateUrl: 'template/mylvtuan/lawyer/order/order-completed.html',
              controller: 'orderCompletedCtrl'
          }
      }
    })

   .state('lawyerquestion', { //首页 - 我的律团 - 律师的咨询
      url: '/lawyerquestion',
      templateUrl: 'template/mylvtuan/lawyer/question/question.html'
    })
  .state('lawyerquestion.new', { //律师的咨询 - 全部
      url: '/new',
      cache:'false',
      views: {
          'question-new': {
              templateUrl: 'template/mylvtuan/lawyer/question/new.html',
              controller: 'lawyerquestionNewCtrl'
          }
      }
    })
  .state('lawyerquestion.ssigned', { //律师的咨询 - 待受理
      url: '/ssigned',
      cache:'false',
      views: {
          'question-ssigned': {
              templateUrl: 'template/mylvtuan/lawyer/question/ssigned.html',
              controller: 'lawyerquestionSsignedCtrl'
          }
      }
    })
  .state('lawyerquestion.replied', { //律师的咨询 - 待确认
      url: '/replied',
      cache:'false',
      views: {
          'question-replied': {
              templateUrl: 'template/mylvtuan/lawyer/question/replied.html',
              controller: 'lawyerquestionRepliedCtrl'
          }
      }
    })
  .state('lawyerquestion.complete', { //律师的咨询 - 待评价
      url: '/complete',
      cache:'false',
      views: {
          'question-complete': {
              templateUrl: 'template/mylvtuan/lawyer/question/complete.html',
              controller: 'lawyerquestionCompleteCtrl'
          }
      }
    })

  .state('queryrefer', { // 律师的工作台 - 咨询参考
    url: '/queryrefer',
    cache:'false', 
    templateUrl: 'template/mylvtuan/lawyer/queryrefer.html'
  })
  .state('queryreferdetail', { //律师的工作台 - 咨询参考详情
    url: '/queryreferdetail',
    cache:'false', 
    templateUrl: 'template/mylvtuan/lawyer/queryrefer-detail.html'
  })
  
/*———————————————————————————— 我的律团- 用户 -公用 ————————————————————————————*/
  .state('userlvtuan', { //首页 - 我的律团 - 用户的工作台
    url: '/userlvtuan',
    cache:'false', 
    templateUrl: 'template/mylvtuan/user/userlvtuan.html',
    controller: 'userlvtuanCtrl'
  })
  .state('userquestion', { //首页 - 我的律团 - 用户的咨询
    url: '/userquestion',
    templateUrl: 'template/mylvtuan/user/question/question.html'
  })
  .state('userquestion.new', { //用户的咨询 - 待受理
    url: '/new',
    cache:'false',
    views: {
        'question-new': {
            templateUrl: 'template/mylvtuan/user/question/new.html',
            controller: 'questionNewCtrl'
        }
    }
  })
  .state('userquestion.ssigned', { //用户的咨询 - 已受理
    url: '/ssigned',
    cache:'false',
    views: {
        'question-ssigned': {
            templateUrl: 'template/mylvtuan/user/question/ssigned.html',
            controller: 'questionSsignedCtrl'
        }
    }
  })
  .state('userquestion.replied', { //用户的咨询 - 处理中
    url: '/replied',
    cache:'false',
    views: {
        'question-replied': {
            templateUrl: 'template/mylvtuan/user/question/replied.html',
            controller: 'questionRepliedCtrl'
        }
    }
  })
  .state('userquestion.waitforconfirmation', { //用户的咨询 - 待确认
    url: '/waitforconfirmation',
    cache:'false',
    views: {
        'question-waitforconfirmation': {
            templateUrl: 'template/mylvtuan/user/question/waitforconfirmation.html',
            controller: 'questionWaitforconfirmationCtrl'
        }
    }
  })
  .state('usernewview', { //用户的咨询 - 待受理 - 详情
    url: '/usernewview',
    cache:'false', 
    templateUrl: 'template/mylvtuan/user/question/new-view.html'/*,
    controller: 'userNewViewCtrl'*/
  })
  .state('userssigned', { //用户的咨询 - 已受理 - 详情
    url: '/userssigned',
    cache:'false', 
    templateUrl: 'template/mylvtuan/user/question/ssigned-view.html'/*,
    controller: 'userSsignedviewCtrl'*/
  })
  .state('userrepliedview', { //用户的咨询 - 处理中 - 详情
    url: '/userrepliedview',
    cache:'false', 
    templateUrl: 'template/mylvtuan/user/question/replied-view.html'/*,
    controller: 'userRepliedViewCtrl'*/
  })
  .state('userwaitforconfirmationview', { //用户的咨询 - 待确认 - 详情
    url: '/userwaitforconfirmationview',
    cache:'false', 
    templateUrl: 'template/mylvtuan/user/question/waitforconfirmation-view.html'/*,
    controller: 'userWaitforconfirmationViewCtrl'*/
  })
  .state('userconfirmcompletion', { //用户的咨询 - 已完成 - 详情
    url: '/userconfirmcompletion',
    cache:'false', 
    templateUrl: 'template/mylvtuan/user/question/confirm-completion.html'/*,
    controller: 'userConfirmCompletionCtrl'*/
  })
  .state('usercompleteview', { //用户的咨询 - 已完成 - 详情
    url: '/usercompleteview',
    cache:'false', 
    templateUrl: 'template/mylvtuan/user/question/complete-view.html'/*,
    controller: 'userCompleteViewCtrl'*/
  })


  .state('orderuser', { //首页 - 我的律团 - 用户的订单
      url: '/orderuser',
      templateUrl: 'template/mylvtuan/user/order/order-user.html'
    })
   .state('orderuser.all', { //用户的订单 - 全部
      url: '/all',
      cache:'false',
      views: {
          'order-all': {
              templateUrl: 'template/mylvtuan/user/order/order-all.html',
              controller: 'userorderAllCtrl'
          }
      }
    })
   .state('orderuser.pending', { //用户的订单 - 待付款
      url: '/pending',
      cache:'false',
      views: {
          'order-pending': {
              templateUrl: 'template/mylvtuan/user/order/order-pending.html',
              controller: 'userorderPendingCtrl'
          }
      }
    })
   .state('orderuser.replied', { //用户的订单 - 待受理
      url: '/replied',
      cache:'false',
      views: {
          'order-replied': {
              templateUrl: 'template/mylvtuan/user/order/order-replied.html',
              controller: 'userorderRepliedCtrl'
          }
      }
    })
   .state('orderuser.completed', { //用户的订单 - 待确认
      url: '/completed',
      cache:'false',
      views: {
          'order-completed': {
              templateUrl: 'template/mylvtuan/user/order/order-completed.html',
              controller: 'userorderCompletedCtrl'
          }
      }
    })
   .state('orderuser.timeout', { //用户的订单 - 待评价
      url: '/timeout',
      cache:'false',
      views: {
          'order-timeout': {
              templateUrl: 'template/mylvtuan/user/order/order-timeout.html',
              controller: 'userorderTimeoutCtrl'
          }
      }
    })

   .state('userorderdetail', { //用户的订单 - 订单详情
      url: '/userorderdetail/:id',
      templateUrl: 'template/mylvtuan/user/order/order-detail.html',
      controller: 'userOrderDetailCtrl'
    })

    .state('userwallet', { //我的律团-用户的钱包
      url: '/userwallet',
      templateUrl: 'template/mylvtuan/user/wallet/wallet.html'
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
      url: '/document/download_list',
      templateUrl: 'template/document/download_list.html'/*,
      controller: 'documentownloadlistCtrl'*/
    })

/********************************** 小微企服 **********************************/
    .state('corporate', { //首页-人才交流
      url: '/corporate',
      templateUrl: 'template/corporate/corporateservices.html'/*,
      controller: 'corporateservicesCtrl'*/
    })


/********************************** error **********************************/
    .state('error', { //error
      url: '/error',
      templateUrl: 'views/error.html'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/index');
});
