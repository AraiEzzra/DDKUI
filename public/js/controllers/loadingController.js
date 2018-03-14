require('angular');

angular.module('ETPApp').controller("loadingController", ["$scope", "$http", "$rootScope", "$interval", "$window", function ($scope, $http, $rootScope, $interval, $window) {

    $scope.height = null;
    $scope.height = 0;

    $scope.getHeight = function () {
        $http.get($rootScope.serverUrl + "/api/loader/status")
            .then(function (resp) {
                if (resp.data.success) {
                    if (!resp.data.loaded) {
                        $scope.height = resp.data.now;
                        $scope.blocksCount = resp.data.blocksCount;
                        $scope.loadingState = $scope.blocksCount ? Math.floor($scope.height / $scope.blocksCount * 100) : 0;
                    } else {
                        $window.location.href = '/';
                    }
                }
            });
    }

    $scope.getHeight();

    $scope.heightInterval = $interval(function () {
        $scope.getHeight();
    }, 2000);

}]);
