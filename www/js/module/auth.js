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
		if (user.status == 3) {
			user.is_verified_lawyer = true;
		} else {
			user.is_verified_lawyer = false;
		}
		localStorage.setItem('currentUser', JSON.stringify(user));
	}

	self.getUser = function() {
		return JSON.parse(localStorage.getItem('currentUser'));
	}

	self.isAuthed = function() {
		var token = self.getToken();
		var user = self.getUser();
		if(token && user) {
			return true;
		} else {
			return false;
		}
	}

	self.logout = function() {
		localStorage.removeItem('jwtToken');
		localStorage.removeItem('currentUser');
		sessionStorage.removeItem("goback");
	}
}

function userService($http, HOST, authService, wxService, $ionicLoading) {
  var self = this;

  // add authentication methods here
  self.register = function(username, password, phonecode, account_type, post_id) {
  	return $http.post('http://' + HOST + '/register', {
		username: username,
		password: password,
		phonecode: phonecode,
		account_type: account_type,
      	post_id: post_id
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

        	var goback = sessionStorage.getItem("goback");
			if(goback == null || goback=="" || goback=="undefined"){
				location.href='#/index';
				window.location.reload();
			}else{
    			location.href= goback;
			}
			sessionStorage.removeItem("goback");
    	}
    ).catch(function(response) {
		if (response.status === 400) {
			var errMsg = JSON.stringify(data.error_messages.username);
			layer.show(errMsg);
			layer.show("注册失败，请重新登录。");
		}
	});
  }

  self.login = function(username, password, openid, post_id) {
  	$ionicLoading.show();
  	return $http.post('http://' + HOST + '/login', {
      username: username,
      password: password,
      openid: openid,
      post_id:post_id
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

        	/*if(!user.is_verified_lawyer){
        		location.href='#/index';
        	}else{
        		location.href='#/center';
        	}*/
        	$ionicLoading.hide();
        	var goback = sessionStorage.getItem("goback");
			if(goback == null || goback=="" || goback=="undefined"){
				location.href='#/index';
			}else{
    			location.href= goback;
			}
			sessionStorage.removeItem("goback");
    	}
    ).catch(function(response) {
	  if (response.status === 400) {
		layer.show("登录失败，账号或密码错误，请重新登录。");
	  }
	});
  }

  self.loginWithWx = function(code, state, post_id) {
  	$ionicLoading.show();
  	return $http.post('http://' + HOST + '/loginWithWx', {
      code: code,
      state: state,
      post_id:post_id
    }).then(
    	function (res) {
	    	var user = res.data ? res.data.data : null;
	    	/*alert('wx_openid',user.wx_openid);
	    	alert(JSON.stringify(user.wx_openid));*/
	    	wxService.saveOpenId(user.wx_openid);

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
  			$ionicLoading.hide();

			var goback = sessionStorage.getItem("goback");
			if(goback == null || goback=="" || goback=="undefined"){
				window.location.href='#/index';
				window.location.reload();
			}else{
				window.location.href= goback;
			}
			sessionStorage.removeItem(goback);
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
