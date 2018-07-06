require('angular');

angular.module('DDKApp').factory('userInfo', function (btfModal) {
    return btfModal({
        controller: 'userInfoController',
        templateUrl: '/partials/modals/userInfo.html'
    });
});
