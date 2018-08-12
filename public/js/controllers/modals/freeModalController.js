require('angular');

angular.module('DDKApp').controller("freeModalController", ["$scope", "freeModal", function ($scope, freeModal) {

    $scope.close = function () {
        freeModal.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

}]);
