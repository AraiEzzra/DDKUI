require('angular');

angular.module('DDKApp').factory('passphraseCheck', function (btfModal) {
    return btfModal({
        controller: 'passphraseCheckController',
        templateUrl: '/partials/modals/passphraseCheck.html'
    });
});
