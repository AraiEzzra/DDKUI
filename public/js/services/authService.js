angular.module('DDKApp').service('AuthService', ['$http', 'userService', '$window', '$location', '$rootScope', 'agreeConfirmationModal', function ($http, userService, $window, $location, $rootScope,agreeConfirmationModal) {

    // create user variable to track user's status
    var user = null;

    // return available functions for use in the controllers
    return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus
    });

    // check whether user is logged-in or not
    function isLoggedIn() {
	if (user) {
            return true;
        } else {
            return false;
        }
    }
    
    // get user's status
    function getUserStatus() {
        return $http({
            method: 'GET',
            url: $rootScope.serverUrl + '/user/status',
            params: {
                token: $window.localStorage.getItem('token')
            }
        }).success(function (resp) {
            if (resp.hasOwnProperty('data')) {
                $window.localStorage.setItem('token', resp.data.refreshToken);
            }
            if (resp.status && resp.data.success) {
                user = true;
                $rootScope.enableReferOption = resp.data.referStatus;
                userService.setData();
                userService.setData(resp.data.account.address, resp.data.account.publicKey, resp.data.account.balance, resp.data.account.unconfirmedBalance, resp.data.account.effectiveBalance, null, resp.data.account.totalFrozeAmount, resp.data.account.username, resp.data.account.group_bonus, resp.data.account.user_status);
                userService.setForging(resp.data.account.forging);
                userService.setSecondPassphrase(resp.data.account.secondSignature || resp.data.account.unconfirmedSignature);
                userService.unconfirmedPassphrase = resp.data.account.unconfirmedSignature;
                
                if(!resp.data.account.user_status) {
                
                $rootScope.agreeConfirmationModal = agreeConfirmationModal.activate({
            
                });
            }
            
            } else {
                user = false;
            }
        }).error(function (err) {
            user = false;
        });
    }
}]);
