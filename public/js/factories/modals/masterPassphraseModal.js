require('angular');

angular.module('DDKApp').factory('masterPassphraseModal', function (btfModal) {
    return btfModal({
        controller: 'masterPassphraseModalController',
        templateUrl: '/partials/modals/masterPassphraseModal.html'
    });
});
