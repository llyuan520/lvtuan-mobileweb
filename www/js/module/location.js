var locationModule = angular.module('locationModule', []);

function locationService($http) {
	var self = this;

	self.fetchLocation = function() {

	    var location = {};

	    // 配置wx接口
	    $http.get("http://" + AppSettings.baseApiUrl + "/common/wxconfig"
	    ).success(function(data) {
	    	if (data) {
		    	data.debug = true;
		    	wx.config(data);
		    }
	    });

    	wx.ready(function () {
		    wx.getLocation({
		    	success: function (res) {

					$http.get("http://" + AppSettings.baseApiUrl + "/common/addressCode/" + res.latitude + "," + res.longitude)
					.success(function(data) {
						if (data) {
							location = data;
						}
					});

					location.latitude = res.latitude;
					location.longitude = res.longitude;

					self.saveLocation(location);

					return location;
	      		},
		        cancel: function (res) {
		        	alert('用户拒绝授权获取地理位置');
		        }
	    	});
    	});
	}

	self.saveLocation = function(location) {
		localStorage.setItem('currentLocation', JSON.stringify(location));
	}

	self.getLocation = function() {
		return JSON.parse(localStorage.getItem('currentLocation'));
	}

	self.getDefaultLocation = function() {
		var location = {};
		location.city_id = '440300';
		location.city_name = '深圳';
		return location;
	}
}

locationModule
.constant('HOST', AppSettings.baseApiUrl)
.service('locationService', locationService);