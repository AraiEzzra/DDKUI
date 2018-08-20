require('angular');

angular.module('DDKApp').service('referralService', function ($http, $rootScope, userService) {

    var referalStat = {

        // Get Referral List
        getReferralList: function ($searchForBlock, $defer, params, filter, cb, address, fromBlocks) {
            $http.post($rootScope.serverUrl + "/referral/list", {
                referrer_address: userService.address
            }).then(function (response) {
                console.log("response : ", response.data.SponsorList);
                if (response.data.success) {
                    cb();
                    $defer.resolve(response.data.SponsorList);
                } else {
                    cb();
                    $defer.resolve([]);
                }
            }
            );
        },
        // End Referral List

        // Get Rewards List
        getRewardList: function ($searchForBlock, $defer, params, filter, cb, address, fromBlocks) {
            $http.post($rootScope.serverUrl + "/referral/rewardHistory", {
                address: userService.address
            }).then(function (response) {
                //console.log("response : ", response.data.SponsorList);
                if (response.data.success) {
                    cb();
                    $defer.resolve(response.data.SponsorList);
                } else {
                    cb();
                    $defer.resolve([]);
                }
            }
            );
        },
        // End Rewards List

        // Get Airdrop Balance
        getAirdropBalance: function (address, cb) {
            $http.post($rootScope.serverUrl + "/api/accounts/senderBalance", {
                address: address
            }).then(function (response) {
                //console.log("response : ", response.data.balance);
                if (response.data.success) {
                    return cb(response.data.balance);
                } else {
                    return cb(response.data);
                }
            }
            );
        },
        // End Airdrop Balance

    };
    return referalStat;
});
