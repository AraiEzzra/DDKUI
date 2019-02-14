require('angular');

angular.module('DDKApp').factory('transactionErrorModal', function (btfModal) {
    return btfModal({
        controller: 'transactionErrorModalController',
        templateUrl: '/partials/modals/transactionErrorModal.html'
    });
});
