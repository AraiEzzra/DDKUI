require('angular');

angular.module('DDKApp').controller('withdrawlController', ['$scope', '$rootScope', '$http', "userService", function ($rootScope, $scope, $http, userService) {
    $scope.address = userService.address;
    $scope.withdrawalStatus = userService.withdrawalStatus;
    if($scope.withdrawalStatus) {
        $scope.errCode = $scope.withdrawalStatus.checkLastWithdrawl && $scope.withdrawalStatus.checkActiveStake && $scope.withdrawalStatus.checkActiveStakeOfLeftAndRightSponsor && $scope.withdrawalStatus.checkRatio ? true : false;
    }
    
    $scope.rules = [1, 2, 3, 4];
    $scope.errorMessage = {};
    $scope.errDescription = {
        0: "Maximum distribution is 15 DDK per week",
        1: "You should have at least one active stake order",
        2: "Your at least two referals of first level must have active stake order within last 30 days",
        3: "Ratio withdrawal is 1:10 from own staking DDK"
    }

    function getWithdrawlStatus() {
        $http.get($rootScope.serverUrl + "/api/accounts/getWithdrawlStatus", {
            params: {
                address: $scope.address
            }
        })
        .then(function (resp) {
            let verified = resp.data.status.checkLastWithdrawl && resp.data.status.checkActiveStake && resp.data.status.checkActiveStakeOfLeftAndRightSponsor && resp.data.status.checkRatio;
            if (verified) {
                userService.setWithdrawlStatus(resp.data.status);
                //$scope.errCode = $scope.withdrawalStatus.checkLastWithdrawl && $scope.withdrawalStatus.checkActiveStake && $scope.withdrawalStatus.checkActiveStakeOfLeftAndRightSponsor && $scope.withdrawalStatus.checkRatio ? true : false;
                if ($scope.errCode) {
                    $http.post($rootScope.serverUrl + "/api/accounts/sendWithdrawlAmount", {
                        address: $scope.address,
                        publicKey: userService.publicKey
                    })
                    .then(function (resp) {
                        if (resp.data.success) {
                            Materialize.toast('Transaction sent', 3000, 'green white-text');
                        } else {
                            $scope.errorMessage.fromServer = resp.data.error.message;
                            return;
                        }
                    })
                    .catch(function (err) {
                        $scope.errorMessage.fromServer = err;
                        return;
                    })
                }
            } else {
                userService.setWithdrawlStatus(resp.data.status);
                $scope.errorMessage.failedRule = 'All rules are not passed to qualify for your next withdrawal';
                return;
            }
        })
        .catch(function (err) {
            $scope.errorMessage.fromServer = err;
        })
    }
    //$scope.getWithdrawlStatus();

    // validate rules for pending group bonus
    $scope.validateGroupBonusRules = function () {
        getWithdrawlStatus();
        /* $scope.errCode = $scope.withdrawalStatus.checkLastWithdrawl && $scope.withdrawalStatus.checkActiveStake && $scope.withdrawalStatus.checkActiveStakeOfLeftAndRightSponsor && $scope.withdrawalStatus.checkRatio ? true : false;
        if (!$scope.errCode) {
            $scope.errorMessage.failedRule = 'All rules are not passed to qualify for your next withdrawal';
            return;
        } else {
            
        } */

    }
}]);
