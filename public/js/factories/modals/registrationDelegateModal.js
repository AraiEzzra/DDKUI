require('angular');

angular.module('DDKApp').factory('registrationDelegateModal', function (btfModal) {
    return btfModal({
        controller: 'registrationDelegateModalController',
        templateUrl: '/partials/modals/registrationDelegateModal.html'
    });
});
