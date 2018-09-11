require('angular');


angular.module('DDKApp').controller('referalController', ["$scope", "$http", "$rootScope", "newUser", "userService", "$state", "viewFactory", 'gettextCatalog', '$window', '$location', '$stateParams', function ($scope, $http, $rootScope, newUser, userService, $state, viewFactory, gettextCatalog, $window, $location, $stateParams) {

    var _referalId = $stateParams.id;
    $scope.step = 1;
    $scope.noMatch = false;
    $scope.view = viewFactory;
    $scope.view.loadingText = gettextCatalog.getString('Registering user');
    $scope.view.inLoading = false;

 
    $scope.activeLabel = function (pass) {
        return pass != '';
    }

    $scope.generatePassphrase = function () {
        var code = new Mnemonic(Mnemonic.Words.ENGLISH);
        $scope.newPassphrase = code.toString();
    };

    $scope.goToStep = function (step) {
        if (step == 1) {
            $scope.repeatPassphrase = '';
            $scope.noMatch = false;
        }
        $scope.step = step;
    }

    $scope.savePassToFile = function (pass) {
        var blob = new Blob([pass], { type: "text/plain;charset=utf-8" });
        FS.saveAs(blob, "DDKPassphrase.txt");
    }

    $scope.login = function (pass,email) {

        var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if(!regex.test(email) && email)
        {
            $scope.errorMessage = 'Please enter a valid email address.';
            $scope.noMatch = true;
            return;
        }

        if (!pass || pass.trim().split(/\s+/g).length < 12) {
            $scope.errorMessage = 'Passphrase must consist of 12 or more words.';
            $scope.noMatch = true;
            return;
        }
        if (pass.length > 100) {
            $scope.errorMessage = 'Passphrase must contain less than 100 characters.';
            $scope.noMatch = true;
            return;
        }
        if(_referalId == "") {
            $scope.errorMessage = 'Referal Id in the URL can\'t be blank';
            $scope.noMatch = true;
            return;
        }
        if (!Mnemonic.isValid(pass) || $scope.newPassphrase != pass) {
            $scope.errorMessage = 'The passphrase entered doesn\'t match with the one generated before.Please go back';
            $scope.noMatch = true;
            return;
        } else {
            $scope.view.inLoading = true;
            $http.post($rootScope.serverUrl + "/api/accounts/open/", { secret: pass, referal: _referalId, email:email }).then(function (resp) {
                $scope.view.inLoading = false;
                if (resp.data.success) {
                    $window.localStorage.setItem('token', resp.data.account.token);
                    newUser.deactivate();
                    userService.setData(resp.data.account.address, resp.data.account.publicKey, resp.data.account.balance, resp.data.account.unconfirmedBalance, resp.data.account.effectiveBalance, resp.data.account.token, resp.data.account.totalFrozeAmount, resp.data.account.username, resp.data.account.groupBonus);
                    userService.setForging(resp.data.account.forging);
                    userService.setSecondPassphrase(resp.data.account.secondSignature);
                    userService.unconfirmedPassphrase = resp.data.account.unconfirmedSignature;
                    $state.go('main.dashboard');
                } else {
                    $scope.errorMessage = resp.data.error;
                    $scope.noMatch = true;                    
                }
            }, function (error) {
                $scope.errorMessage = error.data.error ? error.data.error : error.data;
            });
        }
    }

    $scope.close = function () {
        newUser.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

   $scope.generatePassphrase();
    
}]);
