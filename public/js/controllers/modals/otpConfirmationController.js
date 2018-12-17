require('angular');

angular.module('DDKApp').controller('otpConfirmationController', ["$scope", "$http", "$rootScope", "userService", "otpConfirmationModal", function ($scope, $http, $rootScope, userService, otpConfirmationModal) {

    $scope.successMessage = {};
    $scope.errorMessage = {};

     /*Close Verify Modal*/
       $scope.close = function (openAnyway) {
        if ($scope.destroy) {
            $scope.destroy(openAnyway);
        }
        otpConfirmationModal.deactivate();
    }

    $scope.disableTwoFactor = function (otp) {
        console.log('OTP :  ', otp);
            if (!otp) {
            $scope.presendError = true;
            $scope.errorMessage.otpNumber = 'Please input valid OTP';
            return;
        }
        var data = {
            otp: otp,
            publicKey: userService.publicKey
        };
        $http.post($rootScope.serverUrl + '/api/accounts/verifyOTP', data)
            .then(function (resp) {
                if (resp.data.success) {
                    $scope.enable = true;
                    $scope.disable = false;
                    $http.post($rootScope.serverUrl + '/api/accounts/disableTwoFactor', {
                        publicKey: userService.publicKey
                    })
                        .then(function (resp) {

                            /* Deactive OTP Modal */
                            otpConfirmationModal.deactivate();
                            Materialize.toast('2FA Disable', 3000, 'red white-text');
                        })
                        .catch(function (err) {
                            $scope.presendError = true;
                            return;
                        })

                } else {
                    console.log('2fa otp verification error : ', resp);
                    $scope.errorMessage.fromServer = resp.data.error;
                }
            })
            .catch(function (err) {
                console.log('2fa otp verification error : ', err);
                $scope.errorMessage.fromServer = err;
            })
    }
}]);




