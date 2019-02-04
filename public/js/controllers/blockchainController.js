require('angular');

angular.module('DDKApp').controller('blockchainController', ['$scope', '$timeout', '$rootScope', '$http', "userService", "$interval", 'blockService', 'blockModal', 'blockInfo', 'userInfo', 'ngTableParams', 'viewFactory', 'gettextCatalog', 'esClient', function ($rootScope, $timeout, $scope, $http, userService, $interval, blockService, blockModal, blockInfo, userInfo, ngTableParams, viewFactory, gettextCatalog, esClient) {

    $scope.view = viewFactory;
    $scope.view.inLoading = true;
    $scope.view.loadingText = gettextCatalog.getString('Loading blockchain');
    $scope.view.page = { title: gettextCatalog.getString('Blockchain'), previous: null };
    $scope.view.bar = { showBlockSearchBar: true };
    $scope.address = userService.address;
    $scope.loading = true;
    $scope.showAllColumns = false;
    $scope.showFullTime = false;
    $scope.searchBlocks.searchForBlock='';
    $scope.countForgingBlocks = 0;

    /* Start Blocks */
    $scope.tableBlocks = new ngTableParams({
        page: 1,
        count: 15,
        sorting: {
            height: 'desc'
        }
    }, {
            total: 0,
            counts: [],
            getData: function ($defer, params) {
                blockService.gettingBlocks = false;
                $scope.loading = true;
                blockService.getBlocks($scope.searchBlocks.searchForBlock, $defer, params, $scope.filter, function () {
                    $scope.searchBlocks.inSearch = false;
                    $scope.countForgingBlocks = params.total();
                    $scope.loading = false;
                    $scope.view.inLoading = false;

                }, null, true);
            }
        });


    $scope.tableBlocks.cols = {
        height: gettextCatalog.getString('Height'),
        blockId: gettextCatalog.getString('Block ID'),
        generator: gettextCatalog.getString('Generator'),
        timestamp: gettextCatalog.getString('Time'),
        numberOfTransactions: gettextCatalog.getString('Transactions'),
        totalAmount: gettextCatalog.getString('Amount'),
        totalFee: gettextCatalog.getString('Fee')
        /* reward: gettextCatalog.getString('Reward')*/
    };

    $scope.updateBlocks = function () {
        $scope.tableBlocks.reload();
    };
    /* end Blocks */

    $scope.$on('updateControllerData', function (event, data) {
        if (data.indexOf('main.blockchain') != -1) {
            $scope.updateBlocks();
        }
    });

    $scope.updateBlocks();

    $scope.$on('socket:blocks/change', function (ev, data) {
        $scope.updateBlocks();
    });

    $scope.$on('$destroy', function () {
        $interval.cancel($scope.blocksInterval);
        $scope.blocksInterval = null;
    });

    $scope.showBlock = function (block) {
        $scope.modal = blockModal.activate({ block: block });
        angular.element(document.querySelector("body")).addClass("ovh");
    }

    $scope.blockInfo = function (block) {
        $scope.modal = blockInfo.activate({ block: block });
        angular.element(document.querySelector("body")).addClass("ovh");
    }

    $scope.userInfo = function (userId) {
        $scope.modal = userInfo.activate({ userId: userId });
        angular.element(document.querySelector("body")).addClass("ovh");
    }

    /* Search blocks watcher */
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
                $scope.updateBlocks();
                return;
            }
        }
        tempSearchBlockID = val;
        searchBlockIDTimeout = $timeout(function () {
            $scope.searchBlocks.searchForBlock = tempSearchBlockID;
            $scope.updateBlocks();
        }, 2000); /* Delay 2000 ms */
    });

}]);
