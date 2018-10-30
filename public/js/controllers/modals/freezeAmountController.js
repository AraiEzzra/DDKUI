require('angular');

angular.module('DDKApp').controller('freezeAmountController', ['$scope', '$rootScope', 'userService', 'feeService','freezeAmountModal', '$http', function ($scope, $rootScope, userService,feeService,freezeAmountModal,$http) {

    $scope.rememberedPassphrase = userService.rememberPassphrase ? userService.rememberedPassphrase : false;
    $scope.sending = false;
    $scope.passmode = false;
    $scope.presendError = false;
    $scope.errorMessage = {};
    $scope.checkSecondPass = false;
    $scope.secondPassphrase = userService.secondPassphrase;
    $scope.confirmations = false;
    $scope.errorMessage.fromServer = false;
    $scope.balance = userService.getBalance();


    $scope.getCurrentFee = function () {
        $http.get($rootScope.serverUrl + '/api/blocks/getFee').then(function (resp) {
                $scope.currentFee = resp.data.fee;
                $scope.fee = resp.data.fee;
            });
    }

    $scope.isCorrectValue = function (currency, throwError) {
        var parts = String(currency).trim().split('.');
        var amount = parts[0];
        var fraction;

        if (!throwError) throwError = false;

        function error (message) {
            $scope.errorMessage.fAmount = message;

            if (throwError) {
              throw $scope.errorMessage.fAmount;
            } else {
              console.error(message);
              return false;
            }
        }

        if (currency == null) {
            return error('DDK amount can not be blank');
        }

        if(parts.length != 1){
            return error('DDK amount can not be decimal');
        }

        if (parts.length == 1) {
            // No fractional part
            fraction = '00000000';
        } else if (parts.length == 2) {
            if (parts[1].length > 8) {
                return error('DDK amount must not have more than 8 decimal places');
            } else if (parts[1].length <= 8) {
                // Less than eight decimal places
                fraction = parts[1];
            } else {
                // Trim extraneous decimal places
                fraction = parts[1].substring(0, 8);
            }
        } else {
            return error('DDK amount must have only one decimal point');
        }

        // Pad to eight decimal places
        for (var i = fraction.length; i < 8; i++) {
            fraction += '0';
        }

        // Check for zero amount
        if (amount == '0' && fraction == '00000000') {
            return error('DDK amount can not be zero');
        }

        // Combine whole with fractional part
        var result = amount + fraction;

        // In case there's a comma or something else in there.
        // At this point there should only be numbers.
        if (!/^\d+$/.test(result)) {
            return error('DDK amount contains non-numeric characters');
        }

        // Remove leading zeroes
        result = result.replace(/^0+/, '');

        return parseInt(result);
    }

    $scope.convertDDK = function (currency) {
        return $scope.isCorrectValue(currency, true);
    }

    /* function validateForm(onValid) {
        if ($scope.isCorrectValue($scope.fAmount)) {
            return onValid();
        } else {
            $scope.presendError = true;
        }
    } */
    function validateForm(onValid) {
        if ($scope.isCorrectValue($scope.fAmount)) {
            return onValid();
        } else {
            $scope.presendError = true;
            $scope.checkSecondPass = false;
            $scope.confirmations = false;
        }
    }

    $scope.passcheck = function (fromSecondPass) {
        if (fromSecondPass) {
            $scope.checkSecondPass = false;
            $scope.passmode = $scope.rememberedPassphrase ? false : true;
            if ($scope.passmode) {
                $scope.focus = 'secretPhrase';
            }
            $scope.secondPhrase = '';
            $scope.secretPhrase = '';
            return;
        }
        /* if ($scope.rememberedPassphrase) {
            validateForm(function () {
                $scope.presendError = false;
                $scope.errorMessage = {};
                $scope.freezeOrder($scope.rememberedPassphrase);
            });
        } */
        if ($scope.rememberedPassphrase) {
            validateForm(function () {
                if (!$scope.secondPassphrase) {
                    $scope.confirmations = true;
                }
                else {
                    $scope.checkSecondPass = true;
                    $scope.focus = 'secondPhrase';
                }
                $scope.presendError = false;
                $scope.errorMessage = {};
            });
        } /* else {
            validateForm(function () {
                $scope.presendError = false;
                $scope.errorMessage = {};
                $scope.passmode = !$scope.passmode;
                //$scope.focus = 'secretPhrase';
                $scope.secretPhrase = '';
            });
        } */
        else {
            validateForm(function () {
                $scope.confirmations = false;
                $scope.presendError = false;
                $scope.errorMessage = {};
                $scope.passmode = !$scope.passmode;
                //$scope.focus = 'secretPhrase';
                $scope.secretPhrase = '';
            });
        }
    }

    $scope.confirmationsPopup =  function(){
        $scope.freezeOrder($scope.rememberedPassphrase);
    }


    $scope.confirmPassphrasePopup = function(secret,withSecond) {

        $scope.errorMessage.fromServer = false;

        if(!secret) {
            $scope.errorMessage.fromServer = 'Missing Passphrase';
            return;
        }

        if (!$scope.secondPassphrase && !withSecond) {
            $scope.confirmations = true;
            $scope.rememberedPassphrase = secret;
        } else {
            if (!$scope.checkSecondPass) {
                $scope.focus = 'secondPhrase';
                $scope.confirmations = false;
                $scope.checkSecondPass = true;
                return;
            } else {
                $scope.confirmations = true;
            }
        }
    }



    $scope.freezeOrder = function(secretPhrase){
        /* $rootScope.secretPhrase = secretPhrase;
        if ($scope.secondPassphrase && !withSecond) {
            $scope.checkSecondPass = true;
            $scope.focus = 'secondPhrase';
            return;
        } */

        $scope.errorMessage = {};

        var data = {
            secret: secretPhrase,
            freezedAmount: $scope.convertDDK($scope.fAmount),
            publicKey: userService.publicKey
        };

        if ($scope.secondPassphrase) {
            data.secondSecret = $scope.secondPhrase;
            if ($scope.rememberedPassphrase) {
                data.secret = $scope.rememberedPassphrase;
            }
        }

        if (!$scope.sending) {
            $scope.sending = true;
            $http.post($rootScope.serverUrl + "/api/frogings/freeze", data)
                .then(function (resp) {
                    $scope.sending = false;
                    if (resp.data.success) {
                        Materialize.toast('Stake Success', 3000, 'green white-text');
                        freezeAmountModal.deactivate();
                        $rootScope.enableReferOption = resp.data.referStatus;
                    } else {
                        Materialize.toast('Stake Error', 3000, 'red white-text');
                        $scope.errorMessage.fromServer = resp.data.error;

                    }
                });

        }
    }

    $scope.calFees = function (fAmount) {
        if (parseFloat(fAmount) > 0) {
            var regEx2 = /[0]+$/;
            feeService(function (fees) {
                var rawFee = (parseFloat(fAmount) * (fees.froze)) / 100;
                $scope.fee = (rawFee % 1) != 0 ? rawFee.toFixed(8).toString().replace(regEx2, '') : rawFee.toString();
            });
        } else {
            $scope.fee = 0;
        }
    };

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy();
        }

        freezeAmountModal.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

}]);
