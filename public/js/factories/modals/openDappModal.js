require('angular');

angular.module('DDKApp').factory('openDappModal', function (btfModal) {
    return btfModal({
        controller: 'openDappModalController',
        templateUrl: '/partials/modals/openDappModal.html'
    });
});
