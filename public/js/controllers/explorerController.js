require('angular');

angular.module('ETPApp').controller('explorerController', ['$scope', '$timeout', '$rootScope', '$http', "userService", "$interval", 'blockService', 'blockModal', 'blockInfo', 'userInfo', 'ngTableParams', 'viewFactory', 'gettextCatalog', 'esClient', function ($rootScope, $timeout, $scope, $http, userService, $interval, blockService, blockModal, blockInfo, userInfo, ngTableParams, viewFactory, gettextCatalog, esClient) {
    
    $scope.view = viewFactory;
    $scope.view.inLoading = true;
    $scope.view.loadingText = gettextCatalog.getString('Loading blockchain');
    $scope.view.page = {title: gettextCatalog.getString('Explorer'), previous: null};
    $scope.view.bar = {showBlockSearchBar: true};
    $scope.address = userService.address;
    $scope.loading = true;
    $scope.showAllColumns = false;
    $scope.showFullTime = false;
    $scope.searchBlocks = blockService;
    $scope.countForgingBlocks = 0;

    // Blocks
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
        Id : gettextCatalog.getString('Id'),
        height : gettextCatalog.getString('Height'),
        timestamp : gettextCatalog.getString('Timestamp'),
        transactions : gettextCatalog.getString('Transactions'),
        generatedBy : gettextCatalog.getString('Generated By'),
        amount : gettextCatalog.getString('Amount'),
        fee : gettextCatalog.getString('Fee'),
        monthlyReward : gettextCatalog.getString('Monthly Reward')
    };

    $scope.tableBlocks.settings().$scope = $scope;

    $scope.$watch("filter.$", function () {
        $scope.tableBlocks.reload();
    });

    $scope.updateHeight = function() {
        $http.get($rootScope.serverUrl + "/api/blocks/getHeight").then(function (resp) {
            console.log('height response : ', resp);
            if(resp.data.success) {
                $scope.updatedHeight = resp.data.height;
            }
        });
    }

    $scope.updateTotalTrs = function() {
        esClient.search({
            index: 'trs',
            type: 'trs',
            body: {
                query: {
                    match_all: {}
                },
            }
        }, function (err, res) {
            console.log('trs resp : ', resp);
            if(!err) {
                if (res.hits.hits[0]._source.height) {
                    $scope.totalTrs = res.hits.hits[0]._source.height;
                }
            }
        });
    }

    $scope.updateBlocks = function () {
        $scope.tableBlocks.reload();
    };
    // end Blocks

    $scope.$on('updateControllerData', function (event, data) {
        if (data.indexOf('main.blockchain') != -1) {
            $scope.updateBlocks();
        }
    });

    $scope.updateBlocks();
    $scope.updateHeight();
    $scope.updateTotalTrs();

    $scope.$on('$destroy', function () {
        $interval.cancel($scope.blocksInterval);
        $scope.blocksInterval = null;
    });

    $scope.showBlock = function (block) {
        $scope.modal = blockModal.activate({block: block});
    }

    $scope.blockInfo = function (block) {
        $scope.modal = blockInfo.activate({block: block});
    }

    $scope.userInfo = function (userId) {
        $scope.modal = userInfo.activate({userId: userId});
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
