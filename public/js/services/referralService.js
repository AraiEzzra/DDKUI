require('angular');

angular.module('DDKApp').service('referralService', function ($http, $rootScope, userService, $filter) {
    

    var referralStat = {

        /* Get Referral List */
        getReferralList: function ($defer, cb) {
            $http.post($rootScope.serverUrl + "/referral/list", {
                referrer_address: userService.address
            }).then(function (response) {
                if (response.data.success) {
                    $defer.resolve(response.data.SponsorList);
                    cb();
                } else {
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
