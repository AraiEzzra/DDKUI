
require('angular');

angular.module('DDKApp').factory('referralLinkModal', function (btfModal) {
    return btfModal({
        controller: 'referralLinkModalController',
        templateUrl: '/partials/modals/referralLink.html'
    });
});
