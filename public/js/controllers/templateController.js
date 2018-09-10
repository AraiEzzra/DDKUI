require('angular');

angular.module('DDKApp').controller('templateController', ['$scope', '$rootScope', '$http', 'userService', "$interval", 'gettextCatalog', function ($rootScope, $scope, $http, userService, $interval, gettextCatalog) {
    $scope.address = userService.address;
    $scope.allChecked = false;
    $scope.errorMessage = {};
    $scope.username = userService.username;
    $scope.groupBonus = userService.groupBonus;

    $scope.getInitialSync = function () {
        $http.get($rootScope.serverUrl + "/api/loader/status/sync").then(function (resp) {
            if (resp.data.success) {
                $rootScope.syncing = resp.data.syncing;
                $rootScope.height = resp.data.height;
                $rootScope.heightToSync = resp.data.blocks;
            }
        });
    }

    $scope.syncInterval = $interval(function () {
        $scope.getInitialSync();
    }, 1000 * 10);

    $scope.getInitialSync();

    $scope.getWithdrawlStatus = function() {
        $http.get($rootScope.serverUrl + "/api/accounts/getWithdrawlStatus", {
            params: {
                address: $scope.address
            }
        })
        .then(function(resp) {
            if(resp.data.success) {
                userService.setWithdrawlStatus(resp.data.status);
            }else {
                userService.setWithdrawlStatus(resp.data.status);
            }
        })
        .catch(function(err) {
            $scope.errorMessage.fromServer = err;
        })
    }

}]);



