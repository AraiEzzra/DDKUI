require('angular');

angular.module('ETPApp').controller('settingsController', ['$scope', '$rootScope', '$http', "userService", "$interval", "multisignatureModal", 'gettextCatalog', '$location', function ($rootScope, $scope, $http, userService, $interval, multisignatureModal, gettextCatalog, $location) {

    $scope.checkTwoFactorStatus = function () {
        console.log('checking 2fa status');
        $http.get($rootScope.serverUrl + '/api/accounts/checkTwoFactorStatus', {
            params: {
                publicKey: userService.publicKey
            }
        })
            .then(function (resp) {
                console.log('resp', resp);
                if (resp.data.success) {
                    $scope.disable = true;
                } else {
                    $scope.enable = true;
                }
            })
    }
    $scope.checkTwoFactorStatus();
    var setPage = function () {
        $scope.view.page = { title: gettextCatalog.getString('Settings'), previous: null };
    }

    // Refresh $scope.view.page object on change of language.
    $rootScope.$on('gettextLanguageChanged', setPage);
    // Set $scope.view.page at runtime.
    setPage();
    $scope.successMessage = {};
    $scope.errorMessage = {};

    $scope.view.bar = {};
    $scope.myVar = false;

    $scope.settings = {
        user: userService,
        enabledMultisign: false
    }

    // Show Div
    $scope.showDiv = function (data) {
        $scope.myVar = data;
        $scope.goToStep(0);
    }

    // Enable/Disable multisignature settings
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
        // Get the index of the current step given selection
        return _.indexOf($scope.steps, $scope.selection);
    };

    // Go to a defined step index
    $scope.goToStep = function (index) {
        if (!_.isUndefined($scope.steps[index])) {
            $scope.selection = $scope.steps[index];
        }
    };

    $scope.hasNextStep = function () {
        var stepIndex = $scope.getCurrentStepIndex();
        var nextStep = stepIndex + 1;
        // Return true if there is a next step, false if not
        return !_.isUndefined($scope.steps[nextStep]);
    };

    $scope.hasPreviousStep = function () {
        var stepIndex = $scope.getCurrentStepIndex();
        var previousStep = stepIndex - 1;
        // Return true if there is a next step, false if not
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
            $scope.selection = $scope.steps[previousStep];
        }
    };


    $scope.validateStep = function () {
        var stepIndex = $scope.getCurrentStepIndex();
        //console.log('stepIndex : ', stepIndex);
        if (stepIndex === 0) {
            $scope.successMessage = {};
            console.log('executing step 1');
            var data = {
                publicKey: userService.publicKey
            };
            $http.post($rootScope.serverUrl + "/api/accounts/generateQRCode", data)
                .then(function (resp) {
                    console.log('resp : ', resp);
                    if (resp.data.success) {
                        $scope.dataUrl = resp.data.dataUrl;
                        $scope.successMessage.nextStep = 'Click Next to Continue';
                        $scope.presendError = false;
                        $scope.errorMessage = {};
                        $scope.incrementStep();

                    }
                    //$scope.presendError = false;
                    //$scope.errorMessage = {};
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
                        $scope.errorMessage.fromServer = resp.data.error;
                        return;
                    }
                });
        }
        if (stepIndex === 2) {
            $scope.successMessage = {};
            console.log('executing step 3');
            $scope.incrementStep();
        }
        if (stepIndex === 3) {
            $scope.successMessage = {};
            console.log('executing step 4');
            // $scope.enableTwoFactor = function (twoFactor) {
            var data = {
                publicKey: userService.publicKey,
                key: $scope.settings.twoFactor.key,
                secret: $scope.settings.twoFactor.secret,
                otp: $scope.settings.twoFactor.otp
            };
            console.log('data : ', data);
            $http.post($rootScope.serverUrl + "/api/accounts/enableTwoFactor", data)
                .then(function (resp) {
                    console.log('resp : ', resp);
                    if (resp.data.success) {
                        $scope.twoFactorKey = resp.data.key
                        $scope.successMessage.nextStep = 'Google Authentication is enabled for : ' + userService.getAddress();
                        Materialize.toast('2FA Enabled', 3000, 'green white-text');

                        $scope.enable = false;
                        console.log($scope.enable);

                        $scope.myVar = false;
                        console.log($scope.myVar);

                        $scope.disable = true
                        console.log($scope.disable);




                        $scope.presendError = false;
                        $scope.errorMessage = {};

                    } else {
                        $scope.presendError = true;
                        $scope.errorMessage.fromServer = resp.data.error;
                        //$scope.twoFactorKey = 'No Key. Please check previous step.'
                    }
                });
        }
    };



    $scope.disableTwoFactor = function () {
        var data = {
            publicKey: userService.publicKey
        };
        $http.post($rootScope.serverUrl + '/api/accounts/disableTwoFactor', data)
            .then(function (resp) {
                if (resp.data.success) {
                    $scope.enable = true;
                    $scope.disable = false;
                }
                /// console.log('resp', resp);


                // console.log('resp', resp);

                //$scope.myVarDisable = false;
                //console.log('resp', resp);
            })
    }

}]);











