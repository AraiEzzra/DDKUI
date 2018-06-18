
require('angular');

angular.module('ETPApp').factory('referralLinkModal', function (btfModal) {
    return btfModal({
        controller: 'referralLinkModalController',
        templateUrl: '/partials/modals/referralLink.html'
    });
});
