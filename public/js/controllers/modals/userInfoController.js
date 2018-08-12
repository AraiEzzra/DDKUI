require('angular');
var config = require('../../../../config');
angular.module('DDKApp').controller('userInfoController', ["$scope", "$http", "$rootScope", "userInfo", "userService","sendTransactionModal", function ($scope, $http, $rootScope, userInfo, userService, sendTransactionModal) {
    $scope.ExplorerHost = config.explorerServerHost;
    $scope.ExplorerPort = config.explorerServerPort;
    $scope.userIdOld = '';
    $scope.thisUser = userService;

    $scope.sendTransactionToUser = function () {
        userInfo.deactivate();
        $scope.sendTransactionModal = sendTransactionModal.activate({
            totalBalance: $scope.unconfirmedBalance,
            to: $scope.userId,
            destroy: function () {
            }
        });
        angular.element(document.querySelector("body")).addClass("ovh");
    }

    $scope.getAccountDetail = function (userId) {
        if ($scope.userIdOld == userId) {
            return;
        }
        $scope.userIdOld = userId;
        $scope.transactions = { view: false, list: [] };
        $http.get($rootScope.serverUrl + "/api/accounts", { params: { address: userId }})
        .then(function (resp) {
            if (resp.data.account) {
                $scope.account = resp.data.account;
            } else {
                $scope.account = { address: userId, publicKey: null };
            }
            $http.get($rootScope.serverUrl + "/api/transactions", {
                params: {
                    senderPublicKey: $scope.account.publicKey,
                    recipientId: $scope.account.address,
                    limit: 6,
                    orderBy: 'timestamp:desc'
                }
            })
            .then(function (resp) {
                var transactions = resp.data.transactions;

                $http.get($rootScope.serverUrl + '/api/transactions/unconfirmed', {
                    params: {
                        senderPublicKey: $scope.account.publicKey,
                        address: $scope.account.address
                    }
                })
                .then(function (resp) {
                    var unconfirmedTransactions = resp.data.transactions;
                    $scope.transactions.list = unconfirmedTransactions.concat(transactions).slice(0, 6);
                });
            });
        });
    }

    $scope.transactions = { view: false, list: [] };

    $scope.toggleTransactions = function () {
        $scope.transactions.view = !$scope.transactions.view;
    }

    $scope.close = function () {
        userInfo.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

    $scope.getAccountDetail($scope.userId);

}]);
