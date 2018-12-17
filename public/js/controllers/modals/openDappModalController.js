require('angular');

angular.module('DDKApp').controller('openDappModalController', ["$scope", "openDappModal", 'gettextCatalog', function ($scope, openDappModal, gettextCatalog) {

    $scope.close = function (openAnyway) {
        if ($scope.destroy) {
            $scope.destroy(openAnyway);
        }
        openDappModal.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

    $scope.openAnyway = function (openAnyway) {
        $scope.close(openAnyway);
    }

}]);
