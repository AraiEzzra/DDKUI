require('angular');

angular.module('DDKApp').controller('forgingModalController', ["$scope", "$rootScope", "forgingModal", "$http", "userService", 'gettextCatalog', function ($scope, $rootScope, forgingModal, $http, userService, gettextCatalog) {

    $scope.error = null;
    $scope.sending = false;
    $scope.forging = userService.forging;
    $scope.focus = 'secretPhrase';

    if ($scope.forging) {
        $scope.label = gettextCatalog.getString('Disable Forging');
    } else {
        $scope.label = gettextCatalog.getString('Enable Forging');
    }

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy($scope.forging);
        }

        forgingModal.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

    $scope.forgingState = function () {
        if ($scope.forging) {
            $scope.stopForging();
        } else {
            $scope.startForging();
        }
    }

    $scope.startForging = function () {
        $scope.error = null;

        if ($scope.forging) {
            return $scope.stopForging();
        }

        if (!$scope.sending) {
            $scope.sending = true;

            $http.post($rootScope.serverUrl + "/api/delegates/forging/enable", {secret: $scope.secretPhrase, publicKey: userService.publicKey})
                .then(function (resp) {
                    userService.setForging(resp.data.success);
                    $scope.forging = resp.data.success;
                    $scope.sending = false;

                    if (resp.data.success) {
                        if ($scope.destroy) {
                            $scope.destroy(resp.data.success);
                        }

                        Materialize.toast('Forging enabled', 3000, 'green white-text');
                        forgingModal.deactivate();
                        angular.element(document.querySelector("body")).removeClass("ovh");
                    } else {
                        $scope.error = resp.data.error;
                    }
                });
        }
    }

    $scope.stopForging = function () {
        $scope.error = null;

        if (!$scope.sending) {
            $scope.sending = true;

            $http.post($rootScope.serverUrl + "/api/delegates/forging/disable", {secret: $scope.secretPhrase, publicKey: userService.publicKey})
                .then(function (resp) {
                    userService.setForging(!resp.data.success);
                    $scope.forging = !resp.data.success;
                    $scope.sending = false;

                    if (resp.data.success) {
                        if ($scope.destroy) {
                            $scope.destroy(!resp.data.success);
                        }

                        Materialize.toast('Forging disabled', 3000, 'red white-text');
                        forgingModal.deactivate();
                        angular.element(document.querySelector("body")).removeClass("ovh");
                    } else {
                        $scope.error = resp.data.error;
                    }
                });
        }
    }

}]);
