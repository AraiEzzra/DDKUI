require('angular');

angular.module('DDKApp').factory('sendFreezeOrderModal', function (btfModal) {
    return btfModal({
        controller: 'sendFreezeOrderController',
        templateUrl: '/partials/modals/sendFreezeOrder.html'
    });
}); 
