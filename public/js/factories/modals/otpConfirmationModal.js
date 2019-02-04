require('angular');

angular.module('DDKApp').factory('otpConfirmationModal', function (btfModal) {
    return btfModal({
        controller: 'otpConfirmationController',
        templateUrl: '/partials/modals/otpConfirmationModal.html'
    });
}); 