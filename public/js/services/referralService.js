require('angular');

angular.module('DDKApp').service('referralService', function ($http, $rootScope, userService, $filter) {
    
    var pageLimit = 0, lastLevel, lastLevel2;

    var referralStat = {

        /* Get Referral List */

        getReferralList: function ($defer, params, $scope, cb) {
            if (params.page() == 2 && lastLevel) {
                $scope.referList = lastLevel;
            }
            if (params.page() == 1) {
                $scope.referList = null;
            }

            if (params.page() == 3 && lastLevel2) {
                $scope.referList = lastLevel2;
            }

            $http.post($rootScope.serverUrl + "/referral/list", {
                referrer_address: $scope.referList ? $scope.referList.addressList : [userService.address],
                level: $scope.referList ? $scope.referList.Level : 1
            }).then(function (response) {

                if (response.data.success && response.data.SponsorList.length > 0) {

                    let listLength = response.data.SponsorList.length;

                    if (listLength < 4 && params.page() == 1) {
                        pageLimit = 0;
                    }

                    if (listLength < 4 && params.page() == 2) {
                        pageLimit = 5;
                    }

                    if (listLength < 4 && params.page() == 3) {
                        pageLimit = 10;
                    }

                    if (listLength == 5 && params.page() == 1) {
                        pageLimit = 5;
                    }

                    if (listLength == 5 && params.page() == 2) {
                        pageLimit = 10;
                    }

                    if (listLength == 5 && params.page() == 3) {
                        pageLimit = 15;
                    }

                    if (params.page() == 1 && listLength == 5) {
                        lastLevel = response.data.SponsorList[3];
                    }

                    if (params.page() == 2 && listLength == 5) {
                        lastLevel2 = response.data.SponsorList[3];
                    }

                    $scope.referList = response.data.SponsorList[3];

                    params.total(pageLimit);
                    $defer.resolve(response.data.SponsorList.slice(0, 4));
                    cb();

                } else {
                    pageLimit = 0;
                    $defer.resolve([]);
                    cb();
                }
            });
        },

        /* End Referral List */

        /* Get Rewards List */
        getRewardList: function ($defer, params, cb) {
           
            $http.post($rootScope.serverUrl + "/referral/rewardHistory", {
                address: userService.address,
                limit: params.count(),
                offset: (params.page() - 1) * params.count()
            }).then(function (response) {
                if (response.data.success) {
                    params.total(response.data.count);
                    $defer.resolve(response.data.SponsorList);
                    cb();
                } else {
                    $defer.resolve([]);
                    cb();
                }
            }
            );
        },
        /* End Rewards List */

        /* Get Airdrop Balance */
        getAirdropBalance: function (address, cb) {
            $http.post($rootScope.serverUrl + "/api/accounts/senderBalance", {
                address: address
            }).then(function (response) {
                if (response.data.success) {
                    return cb(response.data.balance);
                } else {
                    return cb(response.data);
                }
            }
            );
        },
        /* End Airdrop Balance */

    };
    return referralStat;
});
