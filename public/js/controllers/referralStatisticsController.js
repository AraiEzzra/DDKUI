require('angular');

angular.module('DDKApp').controller('referralStatisticsController', ['$scope', '$timeout', '$rootScope', '$http', "userService", "$interval", 'blockService', 'blockModal', 'blockInfo', 'userInfo', 'ngTableParams', 'viewFactory', 'gettextCatalog', 'referralService', 'esClient', function ($scope, $timeout, $rootScope, $http, userService, $interval, blockService, blockModal, blockInfo, userInfo, ngTableParams, viewFactory, gettextCatalog, referralService, esClient) {

    $scope.view = viewFactory;
    $scope.view.inLoading = true;
    $scope.view.page = { title: gettextCatalog.getString('Airdrop Statistics'), previous: null };
    $scope.loading = true;
    $scope.rememberedPassphrase = userService.rememberPassphrase ? userService.rememberedPassphrase : false;
    $scope.mixBalance = 900000;
    $scope.searchBlocks.searchForBlock = '';
    $scope.countForgingBlocks = 0;
    $scope.itemDetails = {};


    $scope.exp = function (index, sponsorAddress) {
        if (index === $scope.itemDetails.index) {
            $scope.itemDetails.index = null;
        } else {
            $scope.itemDetails.index = index;
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
        count: 1,
        sorting: {
            level: 'desc'
        }
    }, {
            total: 0,
            counts: [],
            getData: function ($defer, params) {
                $scope.loading = true;
                referralService.getReferralList($scope.searchBlocks.searchForBlock, $defer, params, $scope.filter, function () {
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

    $scope.tableReferral.settings().$scope = $scope;
    $scope.$watch("filter.$", function () {
        $scope.tableReferral.reload();
    });

    $scope.updateReferral = function () {
        $scope.tableReferral.reload();
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
                $scope.loading = true;
                referralService.getRewardList($scope.searchBlocks.searchForBlock, $defer, params, $scope.filter, function () {
                    $scope.searchBlocks.inSearch = false;
                    $scope.countForgingBlocks = params.total();
                    $scope.loading = false;
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

    $scope.tableRewards.settings().$scope = $scope;
    $scope.$watch("filter.$", function () {
        $scope.tableRewards.reload();
    });
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
        let airdropLeftPercentage = ($scope.mixBalance - (data / 100000000)) / ($scope.mixBalance) * 100;
        let data1 = [airdropLeftPercentage, 100 - airdropLeftPercentage];
        $scope.data1 = data1.map(function (each_element) {
            return Number(each_element.toFixed(4));
        });
        let con = $scope.mixBalance - (data / 100000000);
        let consume = con.toFixed(4);
        $scope.consumeValue = consume;
        let avlaible = data / 100000000;
        let avlaibleNum = avlaible.toFixed(4);
        $scope.avlaibleValue = avlaibleNum;

        let airdropDataJson = {
            "data": $scope.data1,
            "labels": ["Consume", "Available"],
            "colours": ["#cc3d3d", "#c0bebe"]
        };
        $scope.airdropData = airdropDataJson;
    });

    // Search blocks watcher
    var tempSearchBlockID = '',
        searchBlockIDTimeout;
    $scope.$watch('searchBlocks.searchForBlock', function (val) {
        if (searchBlockIDTimeout) $timeout.cancel(searchBlockIDTimeout);
        if (val.trim() != '') {
            $scope.searchBlocks.inSearch = true;
        } else {
            $scope.searchBlocks.inSearch = false;
            if (tempSearchBlockID != val) {
                tempSearchBlockID = val;
                $scope.updateReferral();
                return;
            }
        }
        tempSearchBlockID = val;
        searchBlockIDTimeout = $timeout(function () {
            $scope.searchBlocks.searchForBlock = tempSearchBlockID;
            $scope.updateReferral();
        }, 2000); // Delay 2000 ms
    });
}]);



