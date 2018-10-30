require('angular');

angular.module('DDKApp').controller('withdrawlController', ['$scope', '$rootScope', '$http', 'userService', 'gettextCatalog', function ($rootScope, $scope, $http, userService, gettextCatalog) {
    $scope.address = userService.address;
    //$scope.view.inLoading = true;
    $scope.view.loadingText = gettextCatalog.getString('Loading Withdrawal Status');
    $scope.view.page = { title: gettextCatalog.getString('PendingGB'), previous: null };
    if ($scope.withdrawalStatus) {
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
                if (resp.data.success) {
                    let verified = resp.data.status.checkLastWithdrawl && resp.data.status.checkActiveStake && resp.data.status.checkActiveStakeOfLeftAndRightSponsor && resp.data.status.checkRatio;
                    if (verified) {
                        userService.setWithdrawlStatus(resp.data.status);
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
                        let verified = resp.data.status.checkLastWithdrawl && resp.data.status.checkActiveStake && resp.data.status.checkActiveStakeOfLeftAndRightSponsor && resp.data.status.checkRatio;
                        if (!verified) {
                            userService.setWithdrawlStatus(resp.data.error.status);
                            $scope.withdrawalStatus = userService.withdrawalStatus;
                            $scope.errorMessage.failedRule = 'All rules are not passed to qualify for your next withdrawal';
                            return;
                        }
                    }
                } else {
                    let verified = resp.data.error.status.checkLastWithdrawl && resp.data.error.status.checkActiveStake && resp.data.error.status.checkActiveStakeOfLeftAndRightSponsor && resp.data.error.status.checkRatio;
                    if (!verified) {
                        userService.setWithdrawlStatus(resp.data.error.status);
                        $scope.withdrawalStatus = userService.withdrawalStatus;
                        $scope.errorMessage.failedRule = 'All rules are not passed to qualify for your next withdrawal';
                        return;
                    } else {
                        userService.setWithdrawlStatus(resp.data.error.status);
                        $scope.withdrawalStatus = userService.withdrawalStatus;
                    }
                }

            })
            .catch(function (err) {
                $scope.errorMessage.fromServer = err;
            })
    }
    function loadWithdrawlStatus() {
        $http.get($rootScope.serverUrl + "/api/accounts/getWithdrawlStatus", {
            params: {
                address: $scope.address
            }
        })
            .then(function (resp) {
                if (resp.data.success) {
                    //$scope.view.inLoading = false;
                    userService.setWithdrawlStatus(resp.data.status);
                    $scope.withdrawalStatus = userService.withdrawalStatus;
                } else {
                    //$scope.view.inLoading = false;
                    userService.setWithdrawlStatus(resp.data.error.status);
                    $scope.withdrawalStatus = userService.withdrawalStatus;
                }
            })
            .catch(function (err) {
                console.log('err : ', err);
                $scope.errorMessage.fromServer = err;
            });
    }
    loadWithdrawlStatus();


    // validate rules for pending group bonus
    $scope.validateGroupBonusRules = function () {
        getWithdrawlStatus();
    }
}]);
