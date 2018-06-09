require('angular');

angular.module('ETPApp').controller("referralLinkModalController", ["$scope", "referralLinkModal", function ($scope, referralLinkModal) {

    $scope.close = function () {
        referralLinkModal.deactivate();
    }

}]);
