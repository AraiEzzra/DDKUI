require('angular');

angular.module('DDKApp').factory('newUserMigration', function (btfModal) {
    return btfModal({
        controller: 'newUserMigrationController',
        templateUrl: '/partials/modals/newUserMigration.html'
    });
});
