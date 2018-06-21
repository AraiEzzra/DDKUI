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

    $scope.login = function (pass) {
        var data = { secret: pass };
        if (!Mnemonic.isValid(pass) || $scope.newPassphrase != pass) {
            $scope.noMatch = true;
        } else {
            $scope.view.inLoading = true;
            $http.post($rootScope.serverUrl + "/api/accounts/open/", { secret: pass, referal: _referalId }).then(function (resp) {
                $scope.view.inLoading = false;
                if (resp.data.success) {
                    $window.localStorage.setItem('token', resp.data.account.token);
                    newUser.deactivate();
                    userService.setData(resp.data.account.address, resp.data.account.publicKey, resp.data.account.balance, resp.data.account.unconfirmedBalance, resp.data.account.effectiveBalance, resp.data.account.token, resp.data.account.totalFrozeAmount);
                    userService.setForging(resp.data.account.forging);
                    userService.setSecondPassphrase(resp.data.account.secondSignature);
                    userService.unconfirmedPassphrase = resp.data.account.unconfirmedSignature;
                    $state.go('main.dashboard');
                } else {
                    console.error("Login failed. Failed to open account.");
                }
            });
        }
    }

    $scope.close = function () {
        newUser.deactivate();
    }

    $scope.generatePassphrase();


































}]);
