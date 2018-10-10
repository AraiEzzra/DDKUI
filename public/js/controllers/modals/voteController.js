require('angular');

angular.module('DDKApp').controller('voteController', ["$scope", "voteModal", "$rootScope", "$http", "userService", "feeService", "$timeout", "$filter", function ($scope, voteModal, $rootScope, $http, userService, feeService, $timeout, $filter) {

    $scope.sending = false;
    $scope.passmode = false;
    $scope.fromServer = '';
    $scope.rememberedPassphrase = userService.rememberPassphrase ? userService.rememberedPassphrase : false;
    $scope.secondPassphrase = userService.secondPassphrase;
    $scope.focus = 'secretPhrase';
    $scope.confirmations = false;
    $scope.errorMessage = false;
    // $scope.secondPassphrase = userService.secondPassphrase;

    Object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    $scope.passcheck = function (fromSecondPass) {
        $scope.errorMessage = false;
        $scope.fromServer=null;
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
        if ($scope.rememberedPassphrase) {
            if(!$scope.secondPassphrase) {
                $scope.confirmations = true;
            } else {
                $scope.checkSecondPass = true;
                $scope.focus = 'secondPhrase';
                return;
            }
        } else {
            $scope.confirmations = false;
            $scope.passmode = !$scope.passmode;
            if ($scope.passmode) {
                $scope.focus = 'secretPhrase';
            }
            $scope.secretPhrase = '';
        }
    }

    $scope.confirmationsPopup =  function(){

        $scope.vote($scope.rememberedPassphrase);
    }

    $scope.confirmPassphrasePopup = function(secret,withSecond) {

        $scope.errorMessage = false;

        if(!secret) {
            $scope.errorMessage = 'Missing Passphrase';
            return;
        }
        
        if(!$scope.secondPassphrase && !withSecond) {
            $scope.confirmations = true;
            $scope.rememberedPassphrase = secret;
        } else {

            if(!$scope.checkSecondPass) {
                $scope.confirmations = false;
                $scope.checkSecondPass = true;
                return;
            } else {
                $scope.confirmations = true;
            }
        }
    }


    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy(true);
        }
        voteModal.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

    $scope.removeVote = function (publicKey) {
        delete $scope.voteList[publicKey];
        delete $scope.pendingList[publicKey];
        if (!Object.size($scope.voteList)) {
            $scope.close();
        }
    }

    $scope.vote = function (pass) {
/*         if ($scope.secondPassphrase && !withSecond) {
            $scope.checkSecondPass = true;
            $scope.focus = 'secondPhrase';
            return;
        } */
        pass = pass || $scope.secretPhrase;

        var data = {
            secret: pass,
            delegates: Object.keys($scope.voteList).map(function (key) {
                return ($scope.adding ? '+' : '-') + key;
            }),
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

            $http.put($rootScope.serverUrl + "/api/accounts/delegates", data).then(function (resp) {
                $scope.sending = false;

                if (resp.data.error) {
                    $scope.errorMessage = resp.data.error;
                    Materialize.toast(($scope.adding?'Vote Error':'DownVote Error'), 3000, 'red white-text');                    
                } else {
                    if ($scope.destroy) {
                        $scope.destroy();
                    }
                    Materialize.toast(($scope.adding?'Vote Success':'DownVote Success'), 3000, 'green white-text');
                    voteModal.deactivate();
                }
            });
        }
    }

    feeService(function (fees) {

        $scope.fee = (userService.totalFrozeAmount * fees.vote) / 100;

    });

}]);
