var authModule = angular.module('authModule', []);

function authService($window) {
	var self = this;

	// Add JWT methods here
	self.parseJwt = function(token) {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse($window.atob(base64));
		// return JSON.parse(decodeURIComponent(escape($window.atob(base64))));
	}

	self.saveToken = function(token) {
		localStorage.setItem('jwtToken', token);
	}

	self.getToken = function() {
		return localStorage.getItem('jwtToken');
	}

	self.saveUser = function(user) {
		localStorage.setItem('currentUser', JSON.stringify(user));
	}

	self.getUser = function() {
		return JSON.parse(localStorage.getItem('currentUser'));
	}

	self.isAuthed = function() {
		var token = self.getToken();
		if(token) {
			var params = self.parseJwt(token);
			return Math.round(new Date().getTime() / 1000) <= params.exp;
		} else {
			return false;
		}
	}

	self.logout = function() {
		localStorage.removeItem('jwtToken');
		localStorage.removeItem('currentUser');
	}
}

function userService($http, $state, HOST, authService) {
  var self = this;

  // add authentication methods here
  self.register = function(username, password, phonecode, account_type) {
  	return $http.post('http://' + HOST + '/register', {
		username: username,
		password: password,
		phonecode: phonecode,
		account_type: account_type
    }).then(
    	function (res) {
       		layer.show("注册成功！");
	        $scope.user = {};
	        $scope.params = {};

	    	var user = res.data ? res.data.data : null;
	    	if(user) {
	    		authService.saveUser(user);
	    		console.log('user:', user);
	    	}

	    	var token = res.data ? res.data.token : null;
        	// var token = res.headers('Authorization') ? res.headers('Authorization').toLowerCase().replace('bearer ', '') : null;
    		if (token) {
        		authService.saveToken(token);
	    		console.log('token:', token);
        	}

	    	$state.go('center');
			window.location.reload();
    	}
    ).catch(function(response) {
		console.error('Gists error', response.status, response.data);
		if (response.status === 400) {
			var errMsg = JSON.stringify(data.error_messages.username);
			layer.show(errMsg);
			layer.show("注册失败，请重新登录。");
		}
	});
  }

  self.login = function(username, password) {
  	return $http.post('http://' + HOST + '/login', {
      username: username,
      password: password
    }).then(
    	function (res) {
	    	var user = res.data ? res.data.data : null;
	    	if(user) {
	    		authService.saveUser(user);
	    		console.log('user:', user);
	    	}

	    	var token = res.data ? res.data.token : null;
        	// var token = res.headers('Authorization') ? res.headers('Authorization').toLowerCase().replace('bearer ', '') : null;
    		if (token) {
        		authService.saveToken(token);
	    		console.log('token:', token);
        	}

	    	$state.go('center');
			window.location.reload();
    	}
    ).catch(function(response) {
	  console.error('Gists error', response.status, response.data);
	  if (response.status === 400) {
		layer.show("登录失败，账号或密码错误，请重新登录。");
	  }
	});
  }
};

authModule
.constant('HOST', AppSettings.baseApiUrl)
.service('userService', userService)
.service('authService', authService);