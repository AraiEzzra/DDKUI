require('angular');
var config = require('../../../../config');


angular.module('DDKApp').controller('rewardInfoController', ["$scope", "$http", "userInfo", 'rewardInfoModal', function ($scope, $http, userInfo, rewardInfoModal) {

    $scope.ExplorerHost = config.explorerServerHost;
    $scope.ExplorerPort = config.explorerServerPort;
    $scope.userInfo = function (userId) {
        rewardInfoModal.deactivate();
        $scope.modal = userInfo.activate({ userId: userId });
        angular.element(document.querySelector("body")).addClass("ovh");
    }

    $scope.close = function () {
        rewardInfoModal.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

}]);








