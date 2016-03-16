var listModule = angular.module('listModule', ['ionic', 'ngSanitize', 'ngFileUpload', 'httpModule']);

listModule.factory('listHelper', function($http, $rootScope, httpWrapper) {
	var listHelper = {};

	// 这个函数支持下拉刷新和上拉加载
	listHelper.bootstrap = function(url, $scope) {
		
		var page = 1; //页数
		var rows_per_page = 5; // 每页的数量
		$scope.moredata = true; //ng-if的值为false时，就禁止执行on-infinite
		$scope.url = url;
		if ($scope.rows_per_page) {
			rows_per_page = $scope.rows_per_page;
		}
	   
	    $scope.items = [];	//创建一个数组接收后台的数据
    
	    //下拉刷新
		$scope.doRefresh = function() {
			var page = 1;
			$scope.items = [];
	        $scope.loadMore();
	        $scope.$broadcast('scroll.refreshComplete');
	    };

		//上拉加载
		$scope.loadMore = function() {
			var timestamp=Math.round(new Date().getTime()/1000);
			console.info($scope.url);
			// 如果url里面已经有params，预先处理一下
			var urls = $scope.url.split('?');
			var params = 'rows_per_page='+rows_per_page+'&page='+page+'&ts='+timestamp;
			if (urls.length == 2) {
				
				url = urls[0];
				params = urls[1]+'&'+params;
			}
			httpWrapper.get(
				'http://'+$rootScope.hostName+url+'?'+params, 
				function(data) {
					if(data && data.data && data.data.length){
						$scope.items = $scope.items.concat(data.data);
						console.info($scope.items);
						if (data.data.length < rows_per_page) {
							$scope.moredata = false;
						} else {
							$scope.moredata = true;
						}
					}else{
						if (page == 1) {
							$scope.moredata = false;
							$scope.nodata = false;
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