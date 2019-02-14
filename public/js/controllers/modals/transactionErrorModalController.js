require('angular');

angular.module('DDKApp').controller('transactionErrorModalController', ["$scope", "transactionErrorModal", "userService", 'gettextCatalog', function ($scope, transactionErrorModal, userService, gettextCatalog) {

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy();
        }
        transactionErrorModal.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

}]);
