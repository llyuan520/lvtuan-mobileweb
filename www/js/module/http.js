var httpModule = angular.module('httpModule', ['authModule']);

httpModule.factory('httpWrapper', function($http, $rootScope) {
	var httpRequest = {};

	httpRequest.get = function(url, successCallback) {
		$http.get(url,
	    {
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	   		}
	    }).success(
	    	successCallback ? successCallback : function successCallback(data) {}
	    ).error(function (data, status) {
			layer.msg(status);
	        console.info(JSON.stringify(data));
	    });
	}

    httpRequest.request = function(url, method, data,successCallback, failureCallback) {
    	$http({
			method: method,
			url: url,
			data : data,
	        cache: true,
	        headers: {
	            'Content-Type': 'application/json' , 
	            'Authorization': 'bearer ' + $rootScope.token
	   		}
		}).then(
			successCallback ? successCallback : function successCallback(response) {}, 
			failureCallback ? failureCallback : function (response) {
		        console.info(JSON.stringify(response.data));
		        console.info(JSON.stringify(response.status));
		    }
		);
    }

	return httpRequest;
});

httpModule.factory('APIInterceptor', ['$log', '$q', '$rootScope', 'authService', 'HOST', function($log, $q, $rootScope, authService, HOST) {  
    $log.debug('$log is here to show you that this is a regular factory with injection');

    var myInterceptor = {
	    // optional method
	    'request': function(config) {
	      // do something on success
  		  if(config.url.indexOf(HOST) > -1) {

	      	// $rootScope.show();

			var token = authService.getToken();
			if(token) {
				config.headers.Authorization = 'Bearer ' + token;
			}
			config.headers.Accept = 'application/json';
			config.cache = true;

			if (config.url.indexOf(HOST + '/center') > -1 
				|| config.url.indexOf(HOST + '/group') > -1
				|| config.url.indexOf(HOST + '/microblog') > -1) {
        		var canceller = $q.defer();
				if (!authService.isAuthed()) {
					$rootScope.$broadcast('unauthenticated');
					config.timeout = canceller.promise;

		            // Cancel the request
		            canceller.resolve();
				} else {
					if (config.url.indexOf(HOST + '/group') > -1
						|| config.url.indexOf(HOST + '/microblog') > -1) {
						// 动态和圈子一定要律师才可以访问
						user = authService.getUser();
						if (!user.is_verified_lawyer) {
							$rootScope.$broadcast('unauthorized');
						}
					}
				}
			}
		  }
	      return config;
	    },

	    // optional method
	   'requestError': function(rejection) {
	      // do something on error
	      if (canRecover(rejection)) {
	        return responseOrNewPromise
	      }
	      return $q.reject(rejection);
	    },

	    // optional method
	    'response': function(response) {
		    // do something on success
			if(response.config.url.indexOf(HOST) > -1) {
				// check the token and if it's expired
				// $rootScope.$broadcast('unauthorized');
	        	$rootScope.hide();

	      //   	var token = response.headers('Authorization') ? response.headers('Authorization').toLowerCase().replace('bearer ', '') : null;
	    		// if (token) {
	      //   		authService.saveToken(token);
	      //   	}
			}
		    return response;
	    },

	    // optional method
	   'responseError': function(response) {
		    switch(response.status) {
		      	case 401:
		      	case 403:
	        		$rootScope.$broadcast('unauthorized');
	        		break;
	        	case 400:
	        		if (angular.isArray(response.data.error_messages)) {
	        			angular.forEach(response.data.error_messages,function(val,key){
							if (angular.isArray(val)) {
								layer.show(val.join(', '));
							} else {
								layer.show(val);
							}
						});
	        		}else{
	        			layer.show(response.data.error_messages);
	        		}
	        		break;
	        	case 405:
	        		layer.show("提交数据的方法错误");
	        		break;
	        	case 503:
	        	case 500:
	        		layer.show("暂时无法处理您的请求，请稍后再试。");
	        		break;
	        }
		    // console.info(response);

			$rootScope.hide();
			// do something on error
			return $q.reject(response);
	    }
    };

    return myInterceptor;
}]);


httpModule
.constant('HOST', AppSettings.baseApiUrl)
