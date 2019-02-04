require('angular');

angular.module('DDKApp').controller('settingsController', ['$scope', '$rootScope', '$http', "userService", "$interval", "multisignatureModal", 'gettextCatalog', '$location', 'otpConfirmationModal', function ($rootScope, $scope, $http, userService, $interval, multisignatureModal, gettextCatalog, $location, otpConfirmationModal) {

    $scope.checkTwoFactorStatus = function () {
        $http.get($rootScope.serverUrl + '/api/accounts/checkTwoFactorStatus', {
            params: {
                publicKey: userService.publicKey
            }
        })
            .then(function (resp) {
                if (resp.data.success) {
                    $scope.disable = true;
                } else {
                    $scope.enable = true;
                }
            })
    }
    $scope.checkTwoFactorStatus();


    /* otpConfirmationModal Activate */
    $scope.openOTPModal = function () {
        $scope.otpConfirmationModal = otpConfirmationModal.activate({
            destroy: function () {
            }
        });
    }


    var setPage = function () {
        $scope.view.page = { title: gettextCatalog.getString('Settings'), previous: null };
    }

    /* Refresh $scope.view.page object on change of language. */
    $rootScope.$on('gettextLanguageChanged', setPage);
    /* Set $scope.view.page at runtime.*/
    setPage();
    $scope.successMessage = {};
    $scope.errorMessage = {};

    $scope.view.bar = {};
    $scope.myVar = false;

    $scope.settings = {
        user: userService,
        enabledMultisign: false
    }

    /* Show Div */
    $scope.showDiv = function (data) {
        $scope.myVar = data;
        $scope.goToStep(0);
    }

    /* Enable/Disable multisignature settings */
    $scope.multisignaturesEnabled = false;

    $scope.checkEnabledMultisign = function () {
        if (!_.isEmpty(userService.u_multisignatures)) {
            return true;
        } else if (!_.isEmpty(userService.multisignatures)) {
            return true;
        } else {
            return false;
        }
    }

    $scope.settings.enabledMultisign = $scope.checkEnabledMultisign();

    $scope.updateSettings = $interval(function () {
        $scope.settings.enabledMultisign = $scope.checkEnabledMultisign();
    }, 1000);

    $scope.setMultisignature = function () {
        if ($scope.checkEnabledMultisign()) {
            return;
        } else {
            $scope.settings.enabledMultisign = true;
        }
        $interval.cancel($scope.updateSettings);
        $scope.multisignatureModal = multisignatureModal.activate({
            destroy: function (enabled) {
                $scope.settings.enabledMultisign = enabled;
                $scope.settings.updateSettings = $interval(function () {
                    $scope.enabledMultisign = $scope.checkEnabledMultisign();
                }, 1000);
            }
        });
    }

    $scope.steps = [
        'Step 1: Download App',
        'Step 2: Scan QR Code',
        'Step 3: Backup Key',
        'Step 4: Enable Google Authentication'
    ];
    $scope.selection = $scope.steps[0];

    $scope.getCurrentStepIndex = function () {
        /* Get the index of the current step given selection */
        return _.indexOf($scope.steps, $scope.selection);
    };

    /* Go to a defined step index */
    $scope.goToStep = function (index) {
        if (!_.isUndefined($scope.steps[index])) {
            $scope.selection = $scope.steps[index];
        }
    };

    $scope.hasNextStep = function () {
        var stepIndex = $scope.getCurrentStepIndex();
        var nextStep = stepIndex + 1;
        /* Return true if there is a next step, false if not */
        return !_.isUndefined($scope.steps[nextStep]);
    };

    $scope.hasPreviousStep = function () {
        var stepIndex = $scope.getCurrentStepIndex();
        var previousStep = stepIndex - 1;
        /* Return true if there is a next step, false if not */
        return !_.isUndefined($scope.steps[previousStep]);
    };

    $scope.incrementStep = function () {
        if ($scope.hasNextStep()) {
            var stepIndex = $scope.getCurrentStepIndex();
            var nextStep = stepIndex + 1;
            $scope.selection = $scope.steps[nextStep];
        }
    };

    $scope.decrementStep = function () {
        if ($scope.hasPreviousStep()) {
            var stepIndex = $scope.getCurrentStepIndex();
            var previousStep = stepIndex - 1;
            if (stepIndex == 1) {
                $scope.settings.otp = '';
                $scope.errorMessage.otp = '';
            } 
            if(stepIndex == 3) {
                $scope.settings.twoFactor.key = '';
                $scope.settings.twoFactor.secret = '';
                $scope.settings.twoFactor.otp = '';
                $scope.errorMessage.fromServer = '';
            }
            $scope.selection = $scope.steps[previousStep];
        }
    };


    $scope.validateStep = function () {
        var stepIndex = $scope.getCurrentStepIndex();
        if (stepIndex === 0) {
            $scope.successMessage = {};
            var data = {
                publicKey: userService.publicKey
            };
            $http.post($rootScope.serverUrl + "/api/accounts/generateQRCode", data)
                .then(function (resp) {
                    if (resp.data.success) {
                        $scope.dataUrl = resp.data.dataUrl;
                        $scope.successMessage.nextStep = 'Click Next to Continue';
                        $scope.presendError = false;
                        $scope.errorMessage = {};
                        $scope.incrementStep();

                    }

                });
        }
        if (stepIndex === 1) {
            $scope.successMessage = {};
            if (!$scope.settings.otp) {
                $scope.errorMessage.otp = 'Empty OTP field';
                return;
            }
            var data = {
                publicKey: userService.publicKey,
                otp: $scope.settings.otp
            };
            $http.post($rootScope.serverUrl + "/api/accounts/verifyOTP", data)
                .then(function (resp) {
                    if (resp.data.success) {
                        $scope.twoFactorKey = resp.data.key
                        $scope.successMessage.nextStep = 'Click Next to Continue';
                        $scope.presendError = false;
                        $scope.errorMessage = {};
                        $scope.incrementStep();
                    } else {
                        $scope.presendError = true;
                        $scope.errorMessage.otp = resp.data.error;
                        return;
                    }
                });
        }
        if (stepIndex === 2) {
            $scope.successMessage = {};
            $scope.incrementStep();
        }
        if (stepIndex === 3) {
            $scope.successMessage = {};
            var data = {
                publicKey: userService.publicKey,
                key: $scope.settings.twoFactor.key,
                secret: $scope.settings.twoFactor.secret,
                otp: $scope.settings.twoFactor.otp
            };
            $http.post($rootScope.serverUrl + "/api/accounts/enableTwoFactor", data)
                .then(function (resp) {
                    if (resp.data.success) {
                        $scope.settings.otp = '';
                        $scope.settings.twoFactor.key = '';
                        $scope.settings.twoFactor.secret = '';
                        $scope.settings.twoFactor.otp = '';
                        $scope.twoFactorKey = resp.data.key
                        $scope.successMessage.nextStep = 'Google Authentication is enabled for : ' + userService.getAddress();
                        Materialize.toast('2FA Enabled', 3000, 'green white-text');

                        $scope.enable = false;

                        $scope.myVar = false;

                        $scope.disable = true

                        $scope.presendError = false;
                        $scope.errorMessage = {};

                    } else {
                        $scope.presendError = true;
                        $scope.errorMessage.fromServer = resp.data.error;
                    }
                });
        }
    };

    // $scope.disableTwoFactor = function () {
    //     var data = {
    //         publicKey: userService.publicKey
    //     };
    //     $http.post($rootScope.serverUrl + '/api/accounts/disableTwoFactor', data)
    //         .then(function (resp) {
    //             if (resp.data.success) {
    //                 $scope.enable = true;
    //                 $scope.disable = false;
    //             }
    //         })
    // }

}]);











