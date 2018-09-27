require('angular');

angular.module('DDKApp').service('referralService', function ($http, $rootScope, userService, $filter) {
    //var self = this;
    
    var pageLimit = 0;

    var lastLevel, lastLevel2;

    var referalStat = {

        // Get Referral List
        getReferralList: function ($defer, params, cb) {
            if (params.page() == 2 && lastLevel) {
                $rootScope.referList = lastLevel;
            }
            if (params.page() == 1) {
                $rootScope.referList = null;
            }

            if (params.page() == 3 && lastLevel2) {
                $rootScope.referList = lastLevel2;
            }

            $http.post($rootScope.serverUrl + "/referral/list", {
                referrer_address: $rootScope.referList ? $rootScope.referList.addressList : [userService.address],
                level: $rootScope.referList ? $rootScope.referList.Level : 1
            }).then(function (response) {

                $rootScope.itemDetails.index = null;

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

                    $rootScope.referList = response.data.SponsorList[3];

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
        // End Referral List

        // Get Rewards List
        getRewardList: function ($defer, params, filter, cb) {
            //var self = this;
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
        // End Rewards List

        // Get Airdrop Balance
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
        // End Airdrop Balance

    };
    return referalStat;
});
