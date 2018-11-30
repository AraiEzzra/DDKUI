require('angular');

angular.module('DDKApp').controller('agreeConfirmationController', ["$scope", "$http", "$rootScope", "userService", "agreeConfirmationModal", function ($scope, $http, $rootScope, userService, agreeConfirmationModal) {

    $scope.agreeConfirmation = function () {

        console.log("Damini");

        $http.post($rootScope.serverUrl + '/api/accounts/updateUserStatus', {
            address: userService.address,
            status: "AGREED"
        })
            .then(function (resp) {
                if (resp.data.success) {
                    Materialize.toast('You have successfully agreed to DDK Terms & Conditions agreement', 3000, 'green white-text');
                    agreeConfirmationModal.deactivate();
                } else {
                    Materialize.toast('Sent Error', 3000, 'red white-text');
                }

            });

    }
}]);




