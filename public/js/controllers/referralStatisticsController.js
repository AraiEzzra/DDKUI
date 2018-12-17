require('angular');

angular.module('DDKApp').controller('referralStatisticsController', ['$scope', '$timeout', '$rootScope', '$http', "userService", "$interval", 'blockService', 'blockModal', 'blockInfo', 'userInfo', 'ngTableParams', 'viewFactory', 'gettextCatalog', 'referralService', 'esClient', function ($scope, $timeout, $rootScope, $http, userService, $interval, blockService, blockModal, blockInfo, userInfo, ngTableParams, viewFactory, gettextCatalog, referralService, esClient) {

    $scope.view = viewFactory;
    $scope.view.inLoading = true;
    $scope.view.page = { title: gettextCatalog.getString('Airdrop Statistics'), previous: null };
    $scope.loading = true;
    $scope.rewardloading = true;
    $scope.rememberedPassphrase = userService.rememberPassphrase ? userService.rememberedPassphrase : false;
    $scope.mixBalance = 900000;
    $scope.searchBlocks.searchForBlock = '';
    $scope.countForgingBlocks = 0;
    $rootScope.itemDetails = {};

    $scope.exp = function (index, sponsorAddress) {
        if (index === $rootScope.itemDetails.index) {
            $rootScope.itemDetails.index = null;
        } else {
            $rootScope.itemDetails.index = index;
            $scope.stakeStatus = [];
            $http.post($rootScope.serverUrl + "/sponsor/stakeStatus", { address: sponsorAddress })
                .then(function (resp) {
                    if (resp.data.success) {
                        $scope.stakeStatus = resp.data.sponsorStatus;
                    } else {
                        Materialize.toast(resp.data.error, 3000, 'red white-text');
                    }
                });
        }
    }

    // Referral List
    $scope.tableReferral = new ngTableParams({
        page: 1,
        count: 4
    }, {
            total: 0,
            counts: [],
            getData: function ($defer, params) {
                $scope.loading = true;
                referralService.getReferralList($defer, params, function () {
                    $scope.searchBlocks.inSearch = false;
                    $scope.countForgingBlocks = params.total();
                    $scope.loading = false;
                    $scope.view.inLoading = false;
                }, null, true);
            }
        });

    $scope.tableReferral.cols = {
        level: gettextCatalog.getString('Level'),
        referralInfo: gettextCatalog.getString('Referral Info'),
        totalVolume: gettextCatalog.getString('Total Volume'),
        action: gettextCatalog.getString('Action')
    };

    // End Referral

    // Rewards List
    $scope.tableRewards = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            rewardTime: 'desc'
        }
    }, {
            total: 0,
            counts: [],
            getData: function ($defer, params) {
                $scope.rewardloading = true;
                referralService.getRewardList($defer, params, $scope.filter, function () {
                    $scope.searchBlocks.inSearch = false;
                    $scope.countForgingBlocks = params.total();
                    $scope.rewardloading = false;
                    $scope.view.inLoading = false;
                }, null, true);
            }
        });

    $scope.tableRewards.cols = {
        sponsorAddress: gettextCatalog.getString('Sponsor Address'),
        reward: gettextCatalog.getString('Reward'),
        sponsorLevel: gettextCatalog.getString('Sponsor Level'),
        transactionType: gettextCatalog.getString('Transaction Type'),
        rewardTime: gettextCatalog.getString('Reward Time')
    };

    // End Rewards

    $scope.options = {
        legend: {
            display: true,
            position: "right"
        },
        tooltipEvents: [],
        showTooltips: true,
        tooltipCaretSize: 5,
        onAnimationComplete: function () {
            this.showTooltip(this.segments, true);
        },
    };

    let address = 'DDK10720340277000928808';
    referralService.getAirdropBalance(address, function (data) {
        data = parseFloat(data);
        let airdropLeftPercentage = (($scope.mixBalance - data / 100000000) / ($scope.mixBalance)) * 100;
        let data1 = [airdropLeftPercentage, 100 - airdropLeftPercentage];
        $scope.data1 = data1.map(function (each_element) {
            return Number(each_element.toFixed(3));
        });
        let con = $scope.mixBalance - data / 100000000;
        let consume = con.toFixed(4);
        $scope.consumeValue = consume;
        let avlaible = data / 100000000;
        let avlaibleNum = avlaible.toFixed(4);
        $scope.avlaibleValue = avlaibleNum;

        let airdropDataJson = {
            "data": $scope.data1,
            "labels": ["Consume", "Available"],
            "colours": ["#0288d1", "#c0bebe"]
        };
        $scope.airdropData = airdropDataJson;
    });

}]);
