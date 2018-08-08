require('angular');

angular.module('DDKApp').controller('explorerController', ['$scope', '$timeout', '$rootScope', '$http', "userService", "$interval", 'blockService', 'blockModal', 'blockInfo', 'userInfo', 'ngTableParams', 'viewFactory', 'gettextCatalog', 'transactionsService','esClient', function ($scope, $timeout, $rootScope, $http, userService, $interval, blockService, blockModal, blockInfo, userInfo, ngTableParams, viewFactory, gettextCatalog, transactionsService, esClient) {

    $scope.view = viewFactory;
    $scope.view.inLoading = true;
    $scope.view.loadingText = gettextCatalog.getString('Loading blockchain');
    $scope.view.page = { title: gettextCatalog.getString('Explorer'), previous: null };
    $scope.view.bar = { showBlockSearchBar: true };
    $scope.address = userService.address;
    $scope.loading = true;
    $scope.showAllColumns = false;
    $scope.showFullTime = false;
    $scope.searchBlocks = blockService;
    $scope.countForgingBlocks = 0;

    $scope.transactionsView = transactionsService;
    $scope.rememberedPassphrase = userService.rememberPassphrase ? userService.rememberedPassphrase : false;

    // Latest Blocks Details
    $scope.tableBlocks = new ngTableParams({
        page: 1,
        count: 10,
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
        totalFee: gettextCatalog.getString('Fee'),
        reward: gettextCatalog.getString('Reward')
    };

    $scope.tableBlocks.settings().$scope = $scope;

    $scope.$watch("filter.$", function () {
        $scope.tableBlocks.reload();
    });

    $scope.updateBlocks = function () {
        $scope.tableBlocks.reload();
    };
    // end Blocks

    $scope.$on('updateControllerData', function (event, data) {
        if (data.indexOf('main.blockchain') != -1) {
            $scope.updateBlocks();
        }
    });
   
    $scope.showDDKPrice = function () {
        $scope.DDK_Price = 200;

        /* $http.get("http://ddkoin.com/price/price-ddk-api.php?com=sell")
            .then(function (price) {
                console.log("resp"+price);
                $scope.DDK_Price = price;
            });*/ 

    }

    $scope.showDDKPrice();
    $scope.updateBlocks();

    $scope.$on('$destroy', function () {
        $interval.cancel($scope.blocksInterval);
        $scope.blocksInterval = null;
    });

    $scope.showBlock = function (block) {
        $scope.modal = blockModal.activate({ block: block });
    }

    $scope.blockInfo = function (block) {
        $scope.modal = blockInfo.activate({ block: block });
    }

    $scope.blockIdInfo = function (blockID) {
        $http.get($rootScope.serverUrl + "/api/blocks/get", {
            params: {
                id: blockID
            }
        }).then(function (resp) {
            var tmp = [];
            var keys = Object.keys(resp.data.block);
            for (var j = 0; j < keys.length; j++) {
                if (keys[j] === 'username') {
                    var key = keys[j].replace(keys[j], 'm_' + keys[j]);
                } else {
                    var key = keys[j].replace(keys[j], 'b_' + keys[j]);
                }
                tmp[key] = resp.data.block[keys[j]];
            }
            $scope.modal = blockInfo.activate({ block: tmp });
        });
    }

    $scope.userInfo = function (userId) {
        $scope.modal = userInfo.activate({ userId: userId });
    }

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
                $scope.updateBlocks();
                return;
            }
        }
        tempSearchBlockID = val;
        searchBlockIDTimeout = $timeout(function () {
            $scope.searchBlocks.searchForBlock = tempSearchBlockID;
            $scope.updateBlocks();
        }, 2000); // Delay 2000 ms
    });

    // For ChainHeight
    $scope.chainHeight = function() {
        esClient.search({
            index: 'blocks_list',
            type: 'blocks_list',
            body: {
                query: {
                    match_all: {}
                },
            }
        }, function (err, res) {
            if(!err) {
                $scope.blockchainHeight = res.hits.total;
            }
        });
    }
    $scope.chainHeight();

    // For TransactionsCount
    $scope.transactionsCount = function() {
        esClient.search({
            index: 'trs',
            type: 'trs',
            body: {
                query: {
                    match_all: {}
                },
            }
        }, function (err, res) {
            if(!err) {
                $scope.totalTransaction = res.hits.total;
            }
        });
    }
    $scope.transactionsCount();

    // Latest Transactions Details
    $scope.tableTransactions = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            timestamp: 'desc'
        }
    }, {
            total: 0,
            counts: [],
            getData: function ($defer, params) {
                $scope.loading = true;
                transactionsService.getTransactions($defer, params, $scope.filter, $scope.transactionsView.searchForTransaction,
                    function (error) {
                        $scope.searchTransactions.inSearch = false;
                        $scope.countForgingBlocks = params.total();
                        $scope.loading = false;
                        $http.get($rootScope.serverUrl + '/api/transactions/unconfirmed', {
                            params: {
                                senderPublicKey: userService.publicKey,
                                address: userService.address
                            }
                        })
                        .then(function (resp) {
                            var unconfirmedTransactions = resp.data.transactions;
                            $scope.view.inLoading = false;
                            $timeout(function () {
                                $scope.unconfirmedTransactions = unconfirmedTransactions;
                                $scope.$apply();
                            }, 1);
                        });
                    });
            }
        });

    $scope.tableTransactions.cols = {
        height: gettextCatalog.getString('Height'),
        id: gettextCatalog.getString('Transaction ID'),
        senderId: gettextCatalog.getString('Sender'),
        recipientId: gettextCatalog.getString('Recipient'),
        timestamp: gettextCatalog.getString('Time'),
        amount: gettextCatalog.getString('Amount'),
        fee: gettextCatalog.getString('Fee')
    };

    $scope.tableTransactions.settings().$scope = $scope;

    $scope.$watch("filter.$", function () {
        $scope.tableTransactions.reload();
    });
    // end Transactions


    /* For DDK Tansaction Per Day and DDK Price */
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40]
    ];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    // Simulate async data update 
    $timeout(function () {
        $scope.data = [
            [28, 48, 40, 19, 86, 27, 90]
        ];
    }, 3000);

    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series = ['Series A'];

    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40]
    ];















}]);
