require('angular');

angular.module('DDKApp').factory('confirmDeletionModal', function (btfModal) {
    return btfModal({
        controller: 'confirmDeletionModalController',
        templateUrl: '/partials/modals/confirmDeletionModal.html'
    });
});
