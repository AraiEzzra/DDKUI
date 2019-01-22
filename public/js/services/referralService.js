require('angular');

angular.module('DDKApp').service('referralService', function ($http, $rootScope, userService, $filter) {
    

    var referalStat = {

        /* Get Referral List */
        getReferralList: function ($searchForBlock, $defer, params, filter, cb, address, fromBlocks) {
            $http.post($rootScope.serverUrl + "/referral/list", {
                referrer_address: userService.address
            }).then(function (response) {
                if (response.data.success) {
                    cb();
                    $defer.resolve(response.data.SponsorList);
                } else {
                    cb();
                    $defer.resolve([]);
                }
            });
        },
        /* End Referral List */

        /* Get Rewards List */
        getRewardList: function ($searchForBlock, $defer, params, filter, cb, address, fromBlocks) {
           
            $http.post($rootScope.serverUrl + "/referral/rewardHistory", {
                address: userService.address
            }).then(function (response) {
                function filterData(data, filter) {
                    return $filter('filter')(data, filter)
                }
                function orderData(data, params) {
                    return params.sorting() ? $filter('orderBy')(data, params.orderBy()) : filteredData;
                }
                function sliceData(data, params) {
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count())
                }
                function transformData(data, filter, params) {
                    return sliceData(orderData(filterData(data, filter), params), params);
                }
                if (response.data.success) {
                    params.total(response.data.count);
                    var filteredData = $filter('filter')(response.data.SponsorList, filter);
                    var transformData = transformData(response.data.SponsorList, filter, params)
                    $defer.resolve(transformData);
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
    return referalStat;
});
