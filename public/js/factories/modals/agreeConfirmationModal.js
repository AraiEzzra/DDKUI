 require('angular');

angular.module('DDKApp').factory('agreeConfirmationModal', function (btfModal) {
    return btfModal({
        controller: 'agreeConfirmationController',
        templateUrl: '/partials/modals/agreeConfirmationModal.html'
    });
});
