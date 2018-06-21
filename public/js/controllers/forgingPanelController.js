require('angular');

angular.module('DDKApp').controller('forgingPanelController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    $scope.buttonType = "submit";

    $scope.getForgingInfo = function () {
      $http.get($rootScope.serverUrl + "/api/forging").then(function (resp) {
        $scope.forgingEnabled = resp.data.enabled;

        if ($scope.forgingEnabled) {
          $scope.buttonType = "button";
        } else {
          $scope.buttonType = "submit";
        }

        $scope.loaded = true;
      });
    }

    $scope.startForging = function (pass) {
      if (!pass || pass.length == 0) {
        alert("Provide secret passphrase");
        return;
      }

      $http.post($rootScope.serverUrl + "/api/forging/enable", {
        secret: pass,
        saveToConfig: $scope.saveToConfig
      }).then(function (resp) {
        if (resp.data.success) {
          $scope.pass = null;
          $scope.getForgingInfo();
          alert("Forging enabled at account: " + resp.data.address);
        } else {
          alert(resp.data.error);
        }
      });
    }

    $scope.stopForging = function (pass) {
      if (!pass || pass.length == 0) {
        alert("Provide secret passphrase");
        return;
      }
      $http.post($rootScope.serverUrl + "/api/forging/disable", {
        secret: pass
      }).then(function (resp) {
        if (resp.data.success) {
          $scope.pass = null;
          $scope.getForgingInfo();

          alert("Forging disabled at account: " + resp.data.address);
        } else {
          alert(resp.data.error);
        }
      });
    }

    $scope.getForgingInfo();

}])
