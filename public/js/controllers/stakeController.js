require('angular');

angular.module('DDKApp').controller('stakeController', ['$scope', '$rootScope', 'ngTableParams', 'stakeService', '$http', "userService", 'gettextCatalog', 'sendFreezeOrderModal', '$timeout', 'esClient', 'referralService', '$location', '$window', function ($scope, $rootScope, ngTableParams, stakeService, $http, userService, gettextCatalog, sendFreezeOrderModal, $timeout, esClient, referralService, $location, $window) {

  $scope.view.inLoading = true;
  $scope.rememberedPassphrase = userService.rememberedPassphrase;
  var resultData = [];
  var data = stakeService.data;
  $scope.view.loadingText = gettextCatalog.getString('Loading stake orders');
  $scope.view.page = { title: gettextCatalog.getString('Staking'), previous: null };

  $scope.view.loadingText1 = gettextCatalog.getString('Loading Rewards');
  $scope.view.page1 = { title: gettextCatalog.getString('Reward'), previous: null };
  $scope.countRewardOrders = 0

  $scope.countFreezeOrders = 0;
  $scope.loading = true;
  $scope.searchStake = stakeService;
  $scope.view.bar = { showStakeSearchBar: true };
  $scope.mixBalance = 41130000;

  /* For Air Drop Balance */
  $scope.options = {
    tooltipEvents: [],
    showTooltips: true,
    tooltipCaretSize: 0,
    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    },
  };

  let address = 'DDK4995063339468361088';
  referralService.getAirdropBalance(address, function (data) {
    data = parseFloat(data);
    $scope.labels = ["Consume", "Available"];
    let stakeLeftPercentage = (($scope.mixBalance - data / 100000000) / ($scope.mixBalance)) * 100;
    let airdropData = [stakeLeftPercentage, 100 - stakeLeftPercentage];
    $scope.airdropData = airdropData.map(function (each_element) {
      return Number(each_element.toFixed(3));
    });

    let con = $scope.mixBalance - data / 100000000;
    let consume = con.toFixed(4);
    $scope.consumeValue = consume;
    let avlaible = data / 100000000;
    let avlaibleNum = avlaible.toFixed(4);
    $scope.avlaibleValue = avlaibleNum;

    let diskDataJson = {
      "data": $scope.airdropData,
      "labels": ["Consume", "Available"],
      "colours": ["#0288d1", "#c0bebe"]
    };
    $scope.pieDiskData = diskDataJson;
  });
  /* End Air Drop Balance */


  $scope.tableStakes = new ngTableParams(
    {
      page: 1,            // show first page
      count: 5,           // count per page
      sorting: { status: 'desc' }
    },
    {
      total: 0, // length of data
      counts: [],
      getData: function ($defer, params) {
        $scope.loading = true;
        if ($scope.rememberedPassphrase == '') {
          $scope.rememberedPassphrase = $rootScope.secretPhrase;
        }
        stakeService.getData($scope.searchStake.searchForStake, $defer, params, $scope.filter, $scope.rememberedPassphrase, function () {
          $scope.searchStake.inSearch = false;
          $scope.countFreezeOrders = params.total();
          $scope.loading = false;
          $scope.view.inLoading = false;
        });
      }
    });

  $scope.tableStakes.cols = {
    stakedAmount: gettextCatalog.getString('StakeAmount'),
    status: gettextCatalog.getString('Status'),
    startTime: gettextCatalog.getString('StartTime'),
    VoteTimeRemain: gettextCatalog.getString('VoteTimeRemain'),
    reward: gettextCatalog.getString('Reward'),
    voteCount: gettextCatalog.getString('VoteCount'),
    voteDone: gettextCatalog.getString('Voted'),
    recipient: gettextCatalog.getString('Recipient'),
    transIndicator: gettextCatalog.getString('Transferred'),
    action: gettextCatalog.getString('Action')
  };

  /** Unused thing which calls the elastic search API for stake orders. 
   * Currently not used but will be apply on the specific column name as a filter 
   * */

/*   $scope.tableStakes.settings().$scope = $scope;

  $scope.$watch("filter.$", function () {
    $scope.tableStakes.reload();
  }); */

/* ---------Reward--------------- */


$scope.tableReward = new ngTableParams(
  {
    page: 1,            // show first page
    count: 5,           // count per page
    //sorting: { status: 'desc' }
  },
  {
    total: 0, // length of data
    counts: [],
    getData: function ($defer, params) {
      $scope.loading = true;

      stakeService.getRewardData($defer, params, function () {
        $scope.searchStake.inSearch = false;
        $scope.countRewardOrders = params.total();
        $scope.loading = false;
        $scope.view.inLoading = false;
      });

    }
  });

$scope.tableReward.cols = {
  rewardAmount: gettextCatalog.getString('RewardAmount'),
  rewardTime: gettextCatalog.getString('RewardTime'),
};

/* End Rewards */

  getCurrentTimestamp();

  function getCurrentTimestamp() {
    var epochTime = new Date(Date.UTC(2016, 0, 1, 17, 0, 0, 0));
    var epochTimestamp = epochTime.getTime();

    var date = new Date();
    var currentTimestamp = date.getTime();

    $scope.currentDDKTimestamp = Math.floor((currentTimestamp - epochTimestamp) / 1000);
  }


  $scope.sendFreezeOrder = function (id, freezedAmount) {
    $scope.sendFreezeOrderModal = sendFreezeOrderModal.activate({
      stakeId: id,
      freezedAmount: freezedAmount,
      destroy: function () {
      }
    });
    angular.element(document.querySelector("body")).addClass("ovh");
  }

  $scope.updateStakes = function () {
    $scope.tableStakes.reload();
  };

  $scope.$on('updateControllerData', function (event, data) {
    if (data.indexOf('main.stake') != -1) {
      $scope.updateStakes();
      $scope.tableReward.reload();
    }
  });

  $scope.clearSearch = function () {
    $scope.searchStake.searchForStake = '';
  }

  // Search blocks watcher
  var tempSearchBlockID = '',
    searchBlockIDTimeout;

  $scope.$watch('searchStake.searchForStake', function (val) {
    if (searchBlockIDTimeout) $timeout.cancel(searchBlockIDTimeout);

    if (val.trim() != '') {
      $scope.searchStake.inSearch = true;
    } else {
      $scope.searchStake.inSearch = false;
      if (tempSearchBlockID != val) {
        tempSearchBlockID = val;
        $scope.updateStakes();
        return;
      }
    }
    tempSearchBlockID = val;
    searchBlockIDTimeout = $timeout(function () {
      $scope.searchStake.searchForStake = tempSearchBlockID;
      $scope.updateStakes();
    }, 2000); // Delay 2000 ms
  });

  $scope.hideSearchBar = function() {
    $scope.view.bar.showStakeSearchBar = false;
  }

  $scope.showSearchBar = function() {
    $scope.view.bar.showStakeSearchBar = true;
  }

}]);
