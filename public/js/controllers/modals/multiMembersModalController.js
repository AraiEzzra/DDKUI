require('angular');

angular.module('DDKApp').controller('multiMembersModalController', ["$scope", "multiMembersModal", 'gettextCatalog', function ($scope, multiMembersModal, gettextCatalog) {

    $scope.title = $scope.confirmed ? gettextCatalog.getString('Confirmed by') : gettextCatalog.getString('Multi-Signature Group Members');

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy();
        }
        multiMembersModal.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

}]);
