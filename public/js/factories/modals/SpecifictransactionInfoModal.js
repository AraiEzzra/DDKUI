require('angular');

angular.module('DDKApp').factory('SpecifictransactionInfoModal', function (btfModal) {
    return btfModal({
        controller: 'SpecifictransactionController',
        templateUrl: '/partials/modals/SpecifictransactionInfoModal.html'
    });
});
