require('angular');

angular.module('DDKApp').controller('referralStatisticsController', ['$scope', '$timeout', '$rootScope', '$http', "userService", "$interval", 'blockService', 'blockModal', 'blockInfo', 'userInfo', 'ngTableParams', 'viewFactory', 'gettextCatalog', 'transactionsService','esClient', function ($scope, $timeout, $rootScope, $http, userService, $interval, blockService, blockModal, blockInfo, userInfo, ngTableParams, viewFactory, gettextCatalog, transactionsService, esClient) {

    $scope.labels = ["Download Sales", "In-Store Sales"];
    $scope.data = [300, 500];
    options: {
        legend: {
            maxWidth: 350;
            itemWidth: 320;
        }
    };




    


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

}]);



          