require('angular');

angular.module('DDKApp').factory('blockInfo', function (btfModal) {
    return btfModal({
        controller: 'blockInfoController',
        templateUrl: '/partials/modals/blockInfo.html'
    });
});
