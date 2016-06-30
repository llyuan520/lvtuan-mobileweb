var wxModule = angular.module('wxModule', []);

function wxService() {
	var self = this;

	//加载在控制器里面的 微信签权登录
	self.getWxAuthUrl = function(path) {
		var redirect_uri = "http://" + AppSettings.baseMobileUrl + "/#" + path;
		var str = "https://open.weixin.qq.com/connect/oauth2/authorize?";
		str += "appid=" + AppSettings.appId + "&";
		str += "redirect_uri=" + encodeURIComponent(redirect_uri) + "&";
		str += "response_type=code&";
		str += "scope=snsapi_userinfo&";
		str += "state=1";
		str += "#wechat_redirect";

		alert(JSON.stringify(str));
		return str;
	}

	self.saveOpenId = function(openid) {
		localStorage.setItem('wx_openid', openid);
	}

	self.getOpenId = function() {
		return localStorage.getItem('wx_openid');
	}

	self.removeOpenId = function() {
		localStorage.removeItem('wx_openid');
	}

	self.saveUnionId = function(unionid) {
		localStorage.setItem('wx_unionid', unionid);
	}

	self.getUnionId = function() {
		return localStorage.getItem('wx_unionid');
	}

	self.removeUnionId = function() {
		localStorage.removeItem('wx_unionid');
	}
}
					
wxModule.service('wxService', wxService);

