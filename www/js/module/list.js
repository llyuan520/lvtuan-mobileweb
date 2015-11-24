var listModule = angular.module('listModule', ['ionic', 'ngSanitize', 'ngFileUpload', 'httpModule']);

listModule.factory('listHelper', function($http, $rootScope, httpWrapper) {
	var listHelper = {};

	// 这个函数支持下拉刷新和上拉加载
	listHelper.bootstrap = function(url, $scope) {
		var page = 1; //页数
		var rows_per_page = 4; // 每页的数量
	    $scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
	    $scope.items = [];	//创建一个数组接收后台的数据
    
	    //下拉刷新
		$scope.doRefresh = function() {
			page = 1;
			$scope.items = [];
	        $scope.loadMore();
	        $scope.$broadcast('scroll.refreshComplete');
	    };

		//上拉加载
		$scope.loadMore = function() {
			// 如果url里面已经有params，预先处理一下
			var urls = url.split('?');
			var params = 'rows_per_page='+rows_per_page+'&page='+page;
			if (urls.length == 2) {
				url = urls[0];
				params = urls[1]+'&'+params;
			}
			httpWrapper.get(
				'http://'+$rootScope.hostName+url+'?'+params, 
				function(data) {
					var data = data.data;
					if(data.length){
						$scope.items = $scope.items.concat(data);
						if (data.length < rows_per_page) {
							$scope.moredata = false;
						} else {
							$scope.moredata = true;
						}
					}else{
						if (page == 1) {
							layer.show('暂无数据！');
						}
						$scope.moredata = false;
					}
					page++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			);
		};
	}

	return listHelper;

})