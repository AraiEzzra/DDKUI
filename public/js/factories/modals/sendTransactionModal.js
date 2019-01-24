require('angular');

angular.module('DDKApp').factory('sendTransactionModal', function (btfModal) {
    return btfModal({
        controller: 'sendTransactionController',
        templateUrl: '/partials/modals/sendTransaction.html'
    });
});


angular.module('DDKApp').factory('freezeAmountModal', function (btfModal) {
    return btfModal({
        controller: 'freezeAmountController',
        templateUrl: '/partials/modals/freezeAmount.html'
    });
});

