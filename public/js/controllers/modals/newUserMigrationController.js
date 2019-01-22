require('angular');


angular.module('DDKApp').controller('newUserMigrationController', ["$scope", "$http", "$rootScope", "newUserMigration", "userService", "$state", "viewFactory", 'gettextCatalog', '$window', function ($scope, $http, $rootScope, newUserMigration, userService, $state, viewFactory, gettextCatalog, $window) {

    $scope.step = 1;
    $scope.noMatch = false;
    $scope.view = viewFactory;
    $scope.view.loadingText = gettextCatalog.getString('Registering user');
    $scope.view.inLoading = false;

    $scope.activeLabel = function (pass) {
        return pass != '';
    }
    /* For Generate Passphrase */
    $scope.generatePassphrase = function () {
        var code = new Mnemonic(Mnemonic.Words.ENGLISH);
        $scope.newPassphrase = code.toString();
    };

    $scope.goToStep = function (step, email) {
        var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!regex.test(email) && email) {
            $scope.errorMessage = 'Please enter a valid email address.';
            $scope.emailErr = true;
            return;
        } else {
            $scope.emailErr = false;

            if (step == 1) {
                $scope.repeatPassphrase = '';
                $scope.noMatch = false;
            }
            $scope.step = step;
        }
    }
    /* For SavePasshrase */
    $scope.savePassToFile = function (pass) {
        var blob = new Blob([pass], { type: "text/plain;charset=utf-8" });
        FS.saveAs(blob, "DDKPassphrase.txt");
    }

    $scope.migrateData = function (data, address) {
        /* update database tables : mem_accounts and stakeOrder table */
        $http.post($rootScope.serverUrl + "/api/accounts/migrateData/", {
            data: data,
            address: address
        }).then(function (resp) {

        });

    }

    /* For Login with Email and Password */
    $scope.login = function (pass, email) {

        var data = { secret: pass };
        if (!Mnemonic.isValid(pass) || $scope.newPassphrase != pass) {
            $scope.errorMessage = 'The passphrase entered doesn\'t match with the one generated before.Please go back';
            $scope.noMatch = true;
            return;
        } else {
            $scope.view.inLoading = true;
            $http.post($rootScope.serverUrl + "/api/accounts/open/", { secret: pass, etps_user: true, email: email }).then(function (resp) {
                $scope.view.inLoading = false;
                if (resp.data.success) {
                    $window.localStorage.setItem('token', resp.data.account.token);
                    newUserMigration.deactivate();
                    angular.element(document.querySelector("body")).removeClass("ovh");
                    userService.setData(resp.data.account.address, resp.data.account.publicKey, resp.data.account.balance, resp.data.account.unconfirmedBalance, resp.data.account.effectiveBalance, resp.data.account.token, resp.data.account.totalFrozeAmount, resp.data.account.username, resp.data.account.groupBonus);
                    userService.setForging(resp.data.account.forging);
                    userService.setSecondPassphrase(resp.data.account.secondSignature);
                    userService.unconfirmedPassphrase = resp.data.account.unconfirmedSignature;
                    $scope.migrateData($scope.dataVar, resp.data.account.address);
                    $state.go('main.dashboard');
                } else {
                    console.error("Login failed. Failed to open account.");
                }
            });
        }
    }

    $scope.close = function () {
        newUserMigration.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

}]);
