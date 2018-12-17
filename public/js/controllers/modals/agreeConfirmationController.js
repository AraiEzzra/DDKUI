angular.module('DDKApp').controller('agreeConfirmationController', ["$scope", "$http", "$rootScope", "userService", "agreeConfirmationModal", function ($scope, $http, $rootScope, userService, agreeConfirmationModal) {

    $scope.agreeConfirmation = function () {
            if ($scope.showFullTime == true) {
            $http.post($rootScope.serverUrl + '/api/accounts/updateUserStatus', {
                address: userService.address,
                status: "AGREED"
            })
                .then(function (resp) {
                    if (resp.data.success) {
                        Materialize.toast('You have successfully agreed to DDK Terms & Conditions Agreement', 3000, 'green white-text');
                        agreeConfirmationModal.deactivate();
                        angular.element(document.querySelector("body")).removeClass("ovh");
                    } else {
                        Materialize.toast('Sent Error', 5000, 'red white-text');
                    }

                });

        } else {
            Materialize.toast('Please Accept Terms & Conditions', 3000, 'red white-text');
        }

    }
}]);




