require('angular');

angular.module('DDKApp').controller('withdrawlController', ['$scope', '$rootScope', '$http', "userService", function ($rootScope, $scope, $http, userService) {
    $scope.address = userService.address;
    $scope.rules = [0, 1, 2, 3];
    $scope.errorMessage = {};
    $scope.errDescription = {
        0: "Maximum distribution is 15 DDK per week",
        1: "You should have at least one active stake order",
        2: "Your at least two referals of first level must have active stake order within last 30 days",
        3: "Ratio withdrawal is 1:10 from own staking DDK"
    }

    // validate rules for pending group bonus
    $scope.validateGroupBonusRules = function(allChecked) {
        if(!allChecked) {
            $scope.errorMessage.failedRule = "All rules are not passed. Please see failed rules to qualify for pending group bonus";
            return;
        }
        $http.post($rootScope.serverUrl + "/api/accounts/sendWithdrawlAmount", {
            address: $scope.address
        })
        .then(function(resp) {
            if(resp.data.success) {
                $scope.allChecked = true;
                Materialize.toast('Transaction sent', 3000, 'green white-text');
            }else {
                $scope.errCode = resp.data.error.code;
                $scope.errorMessage.fromServer = resp.data.error;
            }
        })
        .catch(function(err) {
            $scope.errorMessage.fromServer = err.data.error;
        })
    }
}]);
