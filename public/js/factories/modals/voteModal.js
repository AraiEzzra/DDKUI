require('angular');

angular.module('DDKApp').factory('voteModal', function (btfModal) {
    return btfModal({
        controller: 'voteController',
        templateUrl: '/partials/modals/vote.html'
    });
});
