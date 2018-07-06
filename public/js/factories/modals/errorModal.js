require('angular');

angular.module('DDKApp').factory('errorModal', function (btfModal) {
    return btfModal({
        controller: 'errorModalController',
        templateUrl: '/partials/modals/errorModal.html'
    });
});
