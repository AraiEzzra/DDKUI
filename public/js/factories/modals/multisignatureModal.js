require('angular');

angular.module('DDKApp').factory('multisignatureModal', function (btfModal) {
    return btfModal({
        controller: 'multisignatureModalController',
        templateUrl: '/partials/modals/multisignatureModal.html'
    });
});
