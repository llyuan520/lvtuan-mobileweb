var locationModule = angular.module('locationModule', []);

function locationService($http) {
	var self = this;

	self.fetchLocation = function($scope) {
	    $scope.currentLocation = self.getDefaultLocation();
		self.saveLocation($scope.currentLocation);

	    var locations = {};

	    // 配置wx接口
	    $http.get("http://" + AppSettings.baseApiUrl + "/common/wxconfig"
	    ).success(function(data) {
	    	if (data) {
		    	data.debug = false;
		    	wx.config(data);
		    }
	    });

    	wx.ready(function () {
		    wx.getLocation({
		    	success: function (res) {

					$http.get("http://" + AppSettings.baseApiUrl + "/area/addresscode/" + res.latitude + "/" + res.longitude)
					.success(function(data) {
						if (data) {
							locations = data;
						}
						locations.latitude = res.latitude;
						locations.longitude = res.longitude;
						self.saveLocation(locations);
						$scope.currentLocation = locations;
					});


	      		},
		        cancel: function (res) {
		        	lawyer.show('用户拒绝授权获取地理位置');
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
		var locations = {};
		locations.city_id = '440300';
		locations.city_name = '深圳市';
		locations.district_id = '440301';
		locations.district_name = '福田区';
		locations.province_id = '440000';
		locations.province_name = '广东省';
		return locations;
	}
}

locationModule
.constant('HOST', AppSettings.baseApiUrl)
.service('locationService', locationService);
