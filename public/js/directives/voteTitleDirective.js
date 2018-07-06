require('angular');

angular.module('DDKApp').directive('voteTitle', function (gettextCatalog, DDKFilterFilter) {
    return {
        restrict: 'E',
        template: '<h2>{{action}}</h2>',
        replace: true,
        transclude: true,
        scope: {
            adding: '=adding'
        },
        link: function (scope, element, attrs) {
            if (scope.adding) {
                scope.action = gettextCatalog.getString('Voting for delegates');
            } else {
                scope.action = gettextCatalog.getString('Removing vote from delegates');
            }
        }
    };
});
