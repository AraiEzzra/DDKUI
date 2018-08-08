require('angular');

angular.module('DDKApp').controller('referralStatisticsController', ['$scope', '$timeout', '$rootScope', '$http', "userService", "$interval", 'blockService', 'blockModal', 'blockInfo', 'userInfo', 'ngTableParams', 'viewFactory', 'gettextCatalog', 'referralService', 'esClient', function ($scope, $timeout, $rootScope, $http, userService, $interval, blockService, blockModal, blockInfo, userInfo, ngTableParams, viewFactory, gettextCatalog, referralService, esClient) {

    $scope.view = viewFactory;
    $scope.view.inLoading = true;
    $scope.view.page = { title: gettextCatalog.getString('Referral Statistics'), previous: null };
    $scope.loading = true;
    $scope.rememberedPassphrase = userService.rememberPassphrase ? userService.rememberedPassphrase : false;
    $scope.mixBalance = 900000;
    $scope.searchBlocks.searchForBlock='';
    $scope.countForgingBlocks = 0;
    

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
                console.log('defer: ', $defer);
                $scope.searchBlocks.inSearch = false;
                $scope.countForgingBlocks = params.total();
                $scope.loading = false;
                $scope.view.inLoading = false;
            }, null, true);
        }
    });

    $scope.tableReferral.cols = {
        level: gettextCatalog.getString('Level'),
        sponsorAddress: gettextCatalog.getString('Sponsor Address')
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
                //console.log('defer: ', $defer);
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


    // Airdrop Balance
    let address = 'DDK15861787991000760463';
    referralService.getAirdropBalance(address, function (data) {
        data = parseFloat(data);
        $scope.labels = ["Download Sales", "In-Store Sales"];
        $scope.data = [data, $scope.mixBalance];
        $scope.options = {
            colors : ['#fff0000', '#46BFBD'] 
        }
        
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



