require('angular');
var config = require('../../../../config');


angular.module('DDKApp').controller('SpecifictransactionController', ["$scope", "$http", "userInfo", 'SpecifictransactionInfoModal', function ($scope, $http, userInfo, SpecifictransactionInfoModal) {
   
    $scope.ExplorerHost = config.explorerServerHost;
    $scope.ExplorerPort = config.explorerServerPort;
    $scope.userInfo = function (userId) {
        SpecifictransactionInfoModal.deactivate();
        $scope.modal = userInfo.activate({userId: userId});
        angular.element(document.querySelector("body")).addClass("ovh");
    }

    $scope.close = function () {
        SpecifictransactionInfoModal.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

}]);
