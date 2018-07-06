require('angular');
angular.module('DDKApp').directive('ngFocus', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.ngFocus, function (val) {
                if (angular.isDefined(val) && val) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            }, true);

            element.bind('blur', function () {
                if (angular.isDefined(attrs.ngFocusLost)) {
                    scope.$apply(attrs.ngFocusLost);
                }
            });
        }
    };
});


angular.module('DDKApp').directive('focusOn', function() {
    return function(scope, elem, attr) {
       scope.$on('focusOn', function(e, name) {
         if(name === attr.focusOn) {
           elem[0].focus();
         }
       });
    };
 });
 



