require('angular');

angular.module('DDKApp').factory('newUser', function (btfModal) {
    return btfModal({
        controller: 'newUserController',
        templateUrl: '/partials/modals/newUser.html'
    });
});
