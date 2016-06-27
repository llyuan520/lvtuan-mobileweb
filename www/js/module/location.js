var locationModule = angular.module('locationModule', []);

function locationService($http) {
	var self = this;

	self.fetchLocation = function($scope) {
	    $scope.currentLocation = self.getDefaultLocation();

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
						$scope.currentLocation = locations.data;
					});


	      		},
		        cancel: function (res) {
		        	layer.show('用户拒绝授权获取地理位置');
		        }
	    	});
    	});
	}

	self.saveLocation = function(location) {
		localStorage.setItem('currentLocation', JSON.stringify(location));
	}

	self.sameLocation = function(location) {
		var currentLocation = self.getLocation();
		if (!currentLocation) {
			return false;
		}

		return (location.city_id == currentLocation.city_id 
			&& location.district_id == currentLocation.district_id 
			&& location.province_id == currentLocation.province_id);
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
