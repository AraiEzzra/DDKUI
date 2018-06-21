require('angular');

angular.module('DDKApp').factory('addContactModal', function (btfModal) {
    return btfModal({
        controller: 'addContactModalController',
        templateUrl: '/partials/modals/addContactModal.html'
    });
});
