var httpModule = angular.module('httpModule', []);

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

})
