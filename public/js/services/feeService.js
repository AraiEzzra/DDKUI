require('angular');

angular.module('DDKApp').service('feeService', function ($http, $rootScope) {

    return function (cb) {
        $http.get($rootScope.serverUrl + '/api/blocks/getFees')
        .then(function (response) {
            return cb(response.data.fees || {
                send: 0,
                vote: 0,
                secondsignature: 0,
                delegate: 0,
                multisignature: 0,
                dapp: 0
            });
        });
    }

});
