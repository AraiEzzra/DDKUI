require('angular');

angular.module('DDKApp').controller('existingETPSUserController', ['$scope', '$rootScope', '$http', "$state", "userService", "newUserMigration", 'gettextCatalog', '$cookies', 'focus', function ($scope, $rootScope, $http, $state, userService, newUserMigration, gettextCatalog, $cookies, focus) {

    userService.setData();
    userService.rememberPassphrase = false;
    userService.rememberedPassphrase = '';
    $scope.password = '';
    $scope.errorMessage = "";
    $scope.URL_GLOBAL = "https://api.etpswallet.gold/";
    $scope.API_KEY_GLOBAL = "etps_2_etp_V1.1";

    focus('focusMe');

    $scope.newUser = function (data) {
        $scope.newUserModal = newUserMigration.activate({
            dataVar: data,
            destroy: function () {
            }
        });
    }

    // function to validate existing ETPS user from DDK_test database
    $scope.validateExistingUser = function (username, password) {
        var post = "username=" + btoa(username) + "&password=" + btoa(password);

        $http.post($rootScope.serverUrl +"/api/accounts/existingETPSUser/validate", {

            data: post
        })
            .success(function (resp) {

                if (!resp.success) {
                    $scope.errorMessage = resp.error;
                } else {
                    if(resp.userInfo.transferred_etp === 1){
                        $scope.errorMessage = 'User is already migrated';
                    }else{
                        var userInfo = {};
                        Object.assign(userInfo, resp.userInfo);
                        $scope.newUser(userInfo);
                    }
                }
            })
            .error(function (err) {
                $scope.errorMessage = err;
            });
    }
}]);
