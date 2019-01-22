/* controller configuration for elasticsearch to inject into services */

require('angular');

angular.module('DDKApp').controller('authController', ['$scope', '$http', function ($scope, $http) {
    $scope.error = null;
    
}]);
