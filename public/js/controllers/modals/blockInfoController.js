require('angular');

angular.module('DDKApp').controller('blockInfoController', ["$scope", "$http", "$rootScope", "blockInfo", "userInfo", function ($scope, $http, $rootScope, blockInfo, userInfo) {

    $scope.transactions = [];
    $scope.transactionsLength = 0;

    $scope.getTransactionsOfBlock = function (blockId) {
        $http.get($rootScope.serverUrl + "/api/transactions/", {params: {blockId: blockId}})
            .then(function (resp) {
                $scope.transactions = resp.data.transactions;
                $scope.transactionsLength = $scope.transactions.length;
            });
    };

    $scope.getTransactionsOfBlock($scope.block.b_id);
    
    
    

    $scope.close = function () {
        blockInfo.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

    $scope.userInfo = function (userId) {
        blockInfo.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
        $scope.userInfo = userInfo.activate({userId: userId});
        angular.element(document.querySelector("body")).addClass("ovh");
    }


    $scope.showGenerator = function (generatorId) {
        blockInfo.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
        $scope.userInfo = userInfo.activate({userId: generatorId});
        angular.element(document.querySelector("body")).addClass("ovh");
    }

    $scope.previousBlock = function (blockId) {
        $http.get($rootScope.serverUrl + "/api/blocks/get?id=" + blockId)
        .then(function (resp) {
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
            $scope.block = tmp;
            $scope.transactions = [];
            $scope.transactionsLength = 0;
            $scope.getTransactionsOfBlock($scope.block.b_id);
        });
    }

}]);
