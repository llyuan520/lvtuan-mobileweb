var wxModule = angular.module('wxModule', []);

function wxService() {
	var self = this;

	//加载在控制器里面的 微信签权登录
	self.getWxAuthUrl = function($rootScope) {
		var redirect_uri = "http://devm.wdlst.com/#/wxauth";
		var str = "https://open.weixin.qq.com/connect/oauth2/authorize?";
		str += "appid=" + AppSettings.appId + "&";
		str += "redirect_uri=" + encodeURIComponent(redirect_uri) + "&";
		str += "response_type=code&";
		str += "scope=snsapi_base&";
		str += "state=1";
		str += "#wechat_redirect";
		return str;
	}
}
					
wxModule.service('wxService', wxService);