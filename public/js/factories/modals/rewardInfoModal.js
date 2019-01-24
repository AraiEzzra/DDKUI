// require('angular');

// angular.module('DDKApp').factory('SpecifictransactionInfoModal', function (btfModal) {
//     return btfModal({
//         controller: 'SpecifictransactionController',
//         templateUrl: '/partials/modals/SpecifictransactionInfoModal.html'
//     });
// });


require('angular');

angular.module('DDKApp').factory('rewardInfoModal', function (btfModal) {
    return btfModal({
        controller: 'rewardInfoController',
        templateUrl: '/partials/modals/rewardInfoModal.html'
    });
});