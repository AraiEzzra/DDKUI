require('angular');

angular.module('DDKApp').controller('blockModalController', ["$scope", "$http", "$rootScope", "blockModal", "userInfo", function ($scope, $http, $rootScope, blockModal, userInfo) {

    $scope.loading = true;
    $scope.transactions = [];
    $scope.getTransactionsOfBlock = function (blockId) {
        $http.get($rootScope.serverUrl + "/api/transactions/", {params: {blockId: blockId}})
            .then(function (resp) {
                $scope.transactions = resp.data.transactions;
                $scope.loading = false;
            });
    };

    $scope.getTransactionsOfBlock($scope.block.b_id);

    $scope.close = function () {
        blockModal.deactivate();
    }

    $scope.userInfo = function (userId) {
        blockModal.deactivate();
        $scope.userInfo = userInfo.activate({userId: userId});
        angular.element(document.querySelector("body")).addClass("ovh");
    }

}]);
