require('angular');

angular.module('DDKApp').controller('transactionInfoController', ["$scope", "$http", "transactionInfo", "userInfo", function ($scope, $http, transactionInfo, userInfo) {

    $scope.userInfo = function (userId) {
        transactionInfo.deactivate();
        $scope.modal = userInfo.activate({userId: userId});
        angular.element(document.querySelector("body")).addClass("ovh");
    }

    $scope.close = function () {
        transactionInfo.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

}]);
