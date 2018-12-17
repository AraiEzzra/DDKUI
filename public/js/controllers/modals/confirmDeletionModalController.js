require('angular');

angular.module('DDKApp').controller('confirmDeletionModalController', ["$scope", "confirmDeletionModal", function ($scope, confirmDeletionModal) {

    $scope.close = function (yesDelete) {
        if ($scope.destroy) {
            $scope.destroy(yesDelete);
        }
        confirmDeletionModal.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

}]);
