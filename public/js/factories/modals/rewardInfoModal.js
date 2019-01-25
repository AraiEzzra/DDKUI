require('angular');

angular.module('DDKApp').factory('rewardInfoModal', function (btfModal) {
    return btfModal({
        controller: 'rewardInfoController',
        templateUrl: '/partials/modals/rewardInfoModal.html'
    });
});