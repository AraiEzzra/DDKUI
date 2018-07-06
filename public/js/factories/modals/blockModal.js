require('angular');

angular.module('DDKApp').factory('blockModal', function (btfModal) {
    return btfModal({
        controller: 'blockModalController',
        templateUrl: '/partials/modals/blockModal.html'
    });
});
